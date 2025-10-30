import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import experienceRoutes from './routes/experienceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoRoutes from './routes/promoRoutes';

dotenv.config();
connectDB(); // Establish the database connection

const app = express();

// --- CRITICAL CORS FIX ---
// The origin of the request is the URL of your Vercel frontend.
// The origin of the request is blocked unless explicitly whitelisted.

// Replace this placeholder with your exact Vercel domain (e.g., https://book-it-gray.vercel.app)
const VERCEL_FRONTEND_URL = 'https://book-it-rosy.vercel.app/'; 
const RENDER_BACKEND_URL = 'https://book-it-7agp.onrender.com'; // Your Render URL

const allowedOrigins = [
    'http://localhost:5173', 
    VERCEL_FRONTEND_URL, 
    RENDER_BACKEND_URL
];

app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the requesting origin is in our allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // Final fallback: Allow the specific Vercel URL (in case of subtle trailing slash/protocol issues)
        if (origin.startsWith(VERCEL_FRONTEND_URL)) {
             return callback(null, true);
        }

        const msg = `The CORS policy for this site does not allow access from the Origin: ${origin}`;
        return callback(new Error(msg), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// -------------------------

app.use(express.json()); // To parse JSON bodies

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running with the utmost respect!');
});

// Use the routes
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is operating on port ${PORT}. A true gentleman's server!`));
