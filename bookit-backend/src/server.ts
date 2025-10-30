import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import experienceRoutes from './routes/experienceRoutes'; 
import bookingRoutes from './routes/bookingRoutes';       
import promoRoutes from './routes/promoRoutes';             

dotenv.config();
connectDB(); 

const app = express();

// --- CRITICAL CORS FIX (as previously defined) ---
const isAllowed = (origin: string | undefined): boolean => {
    if (!origin) return true; 
    if (origin.endsWith('.vercel.app')) return true;

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

// --- FINAL ROUTE REGISTRATION ---
// Use the API route handler as the single entry point.
// We remove the /api prefix from the app.use here and rely on the frontend
// to hit the base URL, but we will leave the /api prefixes in the sub-routes.

// Test route (for base URL check)
app.get('/', (req, res) => {
    res.send('API is running with the utmost respect!');
});

// CRITICAL: We explicitly register the routes with the /api prefix
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);
// ----------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is operating on port ${PORT}. A true gentleman's server!`));
