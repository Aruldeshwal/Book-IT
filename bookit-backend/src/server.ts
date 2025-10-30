import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import experienceRoutes from './routes/experienceRoutes'; // Explicit import
import bookingRoutes from './routes/bookingRoutes';       // Explicit import
import promoRoutes from './routes/promoRoutes';             // Explicit import

dotenv.config();
connectDB(); // Establish the database connection

const app = express();

// --- CRITICAL CORS FIX ---
// This robust check should cover all origins including Vercel and local development
const isAllowed = (origin: string | undefined): boolean => {
    if (!origin) return true; // Allow requests with no origin

    // Allow *.vercel.app domain pattern
    if (origin.endsWith('.vercel.app')) return true;

    // Explicit whitelisting
    const explicitOrigins = [
        'http://localhost:5173', 
        'https://book-it-7agp.onrender.com'
    ];
    return explicitOrigins.includes(origin);
};

app.use(cors({ 
    origin: (origin, callback) => {
        if (isAllowed(origin)) {
            return callback(null, true);
        }
        const msg = `CORS Policy Error: Origin ${origin} is not allowed by the server.`;
        return callback(new Error(msg), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// -------------------------

// Middleware to parse JSON bodies
app.use(express.json()); 

// Basic test route
app.get('/', (req, res) => {
    res.send('API is running with the utmost respect!');
});

// --- FINAL ROUTE REGISTRATION ---
// The Express server must explicitly use the imported route modules.
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);
// ----------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is operating on port ${PORT}. A true gentleman's server!`));
