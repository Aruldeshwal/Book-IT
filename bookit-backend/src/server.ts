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

// --- CRITICAL CORS FIX ---
// Replace the old CORS middleware with this configuration:
const allowedOrigins = [
    'http://localhost:5173', 
    'book-it-rosy.vercel.app', // <--- REPLACE WITH YOUR ACTUAL VERCEL DOMAIN
    'https://book-it-7agp.onrender.com' // If you test your backend directly
];

app.use(cors({ 
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// 💡 CRITICAL GLOBAL DEBUGGING MIDDLEWARE
app.use((req, res, next) => {
    // This log must fire for every single request that reaches the server.
    console.log(`\n🚨 SERVER INGRESS LOG 🚨: ${req.method} ${req.url}`);
    res.set('Cache-Control', 'no-store');
    next();
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('API is running with the utmost respect!');
});

// Use the API routes
// The entire application's routing is mounted here, starting with /api
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promo', promoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\n💎 Server is operating on port ${PORT}. A true gentleman's server!`));