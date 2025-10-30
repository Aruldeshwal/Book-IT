import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db'; // Assuming this file connects Mongoose
import experienceRoutes from './routes/experienceRoutes';
import bookingRoutes from './routes/bookingRoutes';
import promoRoutes from './routes/promoRoutes';

dotenv.config();
connectDB(); // Establish the database connection

const app = express();

// Middleware:
// IMPORTANT: Use the precise origin from your client for security
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' })); 
app.use(express.json()); // To parse JSON bodies

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