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

// --- CRITICAL FINAL CORS FIX ---
// Whitelist all necessary origins, including a robust check for Vercel's pattern.
const RENDER_BACKEND_URL = 'https://book-it-7agp.onrender.com';

const isAllowed = (origin: string | undefined): boolean => {
    if (!origin) return true; // Allow requests with no origin (e.g., non-browser tools)

    const explicitOrigins = [
        'http://localhost:5173', 
        RENDER_BACKEND_URL,
        'https://book-it-rosy.vercel.app', // Explicit Rosy domain
    ];

    if (explicitOrigins.includes(origin)) {
        return true;
    }

    // CHECK FOR VERCEL SUBDOMAIN PATTERN: *.vercel.app
    if (origin.endsWith('.vercel.app')) {
        return true; 
    }

    return false;
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

app.use(express.json()); 

app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is operating on port ${PORT}. A true gentleman's server!`));
