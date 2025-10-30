import express from 'express';
import Booking from '../models/BookingModel';
import Experience from '../models/ExperienceModel';

const router = express.Router();

// POST /bookings - Accept booking details and store them.
router.post('/', async (req, res) => {
    const { experienceId, slotDate, slotTime, userName, userEmail, finalPrice } = req.body;

    // Minimal Validation - A gentleman must have his credentials!
    if (!experienceId || !slotDate || !slotTime || !userName || !userEmail || finalPrice === undefined) {
        return res.status(400).json({ message: 'All required fields must be supplied, sir.' });
    }

    try {
        // 1. Find the Experience and Slot
        const experience = await Experience.findById(experienceId);
        if (!experience) {
            return res.status(404).json({ message: 'The experience is simply not on the menu.' });
        }

        const slot = experience.slots.find(
            s => s.date.toISOString().split('T')[0] === new Date(slotDate).toISOString().split('T')[0] && s.time === slotTime
        );

        if (!slot) {
            return res.status(400).json({ message: 'Selected slot is invalid or a brainroot error.' });
        }

        // 2. Prevent Double-Booking & Check Capacity
        if (slot.bookedCount >= slot.capacity) {
            // Update availability status if capacity is met (optional, for frontend clarity)
            slot.isAvailable = false;
            await experience.save(); 
            return res.status(400).json({ message: 'Sold out! A lamentable predicament.' });
        }

        // 3. Create the Booking
        const booking = new Booking({
            experienceId, slotDate, slotTime, userName, userEmail, finalPrice,
        });

        await booking.save();

        // 4. Update the Slot's bookedCount
        slot.bookedCount += 1;
        if (slot.bookedCount >= slot.capacity) {
            slot.isAvailable = false;
        }
        await experience.save();

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