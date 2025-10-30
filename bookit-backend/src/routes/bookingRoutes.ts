import express from 'express';
import Booking from '../models/BookingModel';
import Experience from '../models/ExperienceModel';
import mongoose from 'mongoose';

const router = express.Router();

// Utility for basic email validation
const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

// POST /bookings - Accept booking details and store them with robust validation.
router.post('/', async (req, res) => {
    const { experienceId, slotDate, slotTime, userName, userEmail, finalPrice, quantity } = req.body;

    // 1. Initial Data Integrity & Validation
    if (!experienceId || !slotDate || !slotTime || !userName || !userEmail || finalPrice === undefined || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'All required fields (including quantity) must be supplied, sir, and quantity must be positive.' });
    }
    if (!validateEmail(userEmail)) {
        return res.status(400).json({ message: 'The provided email address is not respectable.' });
    }
    if (typeof userName !== 'string' || userName.trim().length < 2) {
        return res.status(400).json({ message: 'The full name must be a complete string.' });
    }
    
    // 2. Find the Experience and Slot
    try {
        const experience = await Experience.findById(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'The experience is simply not on the menu.' });
        }

        // Find the specific slot based on date and time
        const slot = experience.slots.find(
            s => s.date.toISOString().split('T')[0] === new Date(slotDate).toISOString().split('T')[0] && s.time === slotTime
        );

        if (!slot) {
            return res.status(404).json({ message: 'Selected date and time slot is invalid or misplaced.' });
        }
        
        // 3. Capacity Check (Prevent Double-Booking)
        const availableCapacity = slot.capacity - slot.bookedCount;
        
        if (quantity > availableCapacity) {
            return res.status(400).json({ 
                message: `Capacity exceeded! Only ${availableCapacity} spot(s) left.`,
            });
        }

        if (!slot.isAvailable || availableCapacity < 1) {
            slot.isAvailable = false; // Ensures status is accurate
            await experience.save();
            return res.status(400).json({ message: 'Sold out! A lamentable predicament.' });
        }
        
        // 4. Atomic Update and Booking Creation
        
        // Update the slot's bookedCount and availability status
        slot.bookedCount += quantity;
        if (slot.bookedCount >= slot.capacity) {
            slot.isAvailable = false;
        }

        // Create the Booking Record
        const booking = new Booking({
            experienceId, slotDate, slotTime, userName, userEmail, finalPrice, quantity, // Added quantity
            isConfirmed: true,
        });

        await booking.save();
        await experience.save(); // Save the updated slot count

        res.status(201).json({ 
            message: 'Booking confirmed! A transaction of the highest calibre.', 
            bookingId: booking._id,
            finalPrice: booking.finalPrice,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A deplorable server lapse during booking.' });
    }
});

export default router;
