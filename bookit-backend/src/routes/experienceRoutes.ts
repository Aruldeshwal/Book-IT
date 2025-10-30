import express from 'express';
import Experience from '../models/ExperienceModel';

const router = express.Router();

// GET /experiences - Return list of experiences, supporting search query.
router.get('/', async (req, res) => {
    try {
        // FIX A: Ensure 'search' is extracted safely, converting potential arrays to a single string
        const search = Array.isArray(req.query.search) ? req.query.search[0] : req.query.search;
        let query: any = {}; 
        
        // CRITICAL DEBUGGING LOGS
        console.log(`➡️ FULL REQUEST URL RECEIVED: ${req.url}`); 
        console.log(`➡️ Raw search query parameter: ${req.query.search}`); 

        if (typeof search === 'string' && search.trim().length > 0) {
            
            const searchTrimmed = search.trim();
            console.log(`✅ EXECUTING DEFINITIVE search for: ${searchTrimmed}`); // Must see this!

            // FIX B: Escape all special Regex characters to ensure the term is searched literally
            const escapedSearchTerm = searchTrimmed.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const searchRegex = new RegExp(escapedSearchTerm, 'i'); // 'i' is case-insensitive
            
            // Build the MongoDB Query using $or across target fields
            query = {
                $or: [
                    { title: { $regex: searchRegex } },
                    { description: { $regex: searchRegex } }, 
                    { location: { $regex: searchRegex } },
                ],
            };
        } else {
            console.log("No valid search term provided. Fetching all experiences.");
        }

        // Execute the query using the constructed filter object
        // FIX C: Ensure all searched fields are selected to avoid projection conflicts.
        const experiences = await Experience.find(query)
            .select('title price duration image location description')
            .lean();
        
        console.log(`Query successful. Returned ${experiences.length} result(s).`);

        res.json(experiences);
    } catch (error) {
        console.error("Deplorable search execution error:", error);
        res.status(500).json({ message: 'A catastrophic server error occurred during the catalogue search!' });
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
