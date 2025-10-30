import express from 'express';
import Experience from '../models/ExperienceModel';

const router = express.Router();

// GET /experiences - Return list of experiences.
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().select('title price duration image');
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: 'A server mishap of the highest order!' });
    }
});

// GET /experiences/:id - Return details and slot availability.
router.get('/:id', async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found. Utterly gone!' });
        }
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: 'A deplorable database error.' });
    }
});

export default router;