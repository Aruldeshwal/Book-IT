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

// Middleware:
app.use(cors({ origin: 'http://localhost:5173' })); // IMPORTANT for frontend to connect
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