// src/seed.ts
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'; // Use 'import * as' for better compatibility
// Adjust the path as necessary for your project structure
import Experience, { ISlot, IExperience } from '../models/ExperienceModel'; 

dotenv.config();

// 💡 Define the exact structure of the mock data array for type safety
// We use the imported IExperience interface for maximum rigor, but omit the Mongoose-specific fields
interface MockExperience {
    title: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    slots: ISlot[]; // The slots array uses the imported ISlot interface
}

// --- Mock Data: Experiences and Slots ---
const experiencesData: MockExperience[] = [
    {
        title: "Gentleman's High-Seas Sailing Lesson",
        description: "Master the nautical arts aboard a pristine yacht. Learn knot-tying and navigation. A truly distinguished experience.",
        price: 350.00,
        duration: "4 hours",
        image: "https://images.unsplash.com/photo-1549488344-f89a80e1a14c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        // The type assertion 'as ISlot[]' is no longer required due to the MockExperience interface!
        slots: [
            { date: new Date('2025-11-15T00:00:00Z'), time: "10:00 AM", capacity: 5, bookedCount: 0, isAvailable: true },
            { date: new Date('2025-11-15T00:00:00Z'), time: "2:00 PM", capacity: 5, bookedCount: 2, isAvailable: true },
            { date: new Date('2025-11-16T00:00:00Z'), time: "10:00 AM", capacity: 5, bookedCount: 5, isAvailable: false },
            { date: new Date('2025-11-17T00:00:00Z'), time: "10:00 AM", capacity: 5, bookedCount: 0, isAvailable: true },
        ],
    },
    {
        title: "Art of Fine Cigar and Whisky Pairing",
        description: "An evening dedicated to refined tastes. Sample vintage single malts and rare Cuban cigars under the guidance of a sommelier.",
        price: 180.00,
        duration: "2 hours",
        image: "https://images.unsplash.com/photo-1628173429813-f47053ccbe77?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slots: [
            { date: new Date('2025-11-20T00:00:00Z'), time: "7:00 PM", capacity: 10, bookedCount: 3, isAvailable: true },
            { date: new Date('2025-11-21T00:00:00Z'), time: "7:00 PM", capacity: 10, bookedCount: 0, isAvailable: true },
        ],
    },
    {
        title: "Vintage Car Restoration Workshop",
        description: "Spend a day with master mechanics learning the delicate touch required to restore classic automobiles to their former glory.",
        price: 499.00,
        duration: "Full Day",
        image: "https://images.unsplash.com/photo-1549926442-53535914614a?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        slots: [
            { date: new Date('2025-12-05T00:00:00Z'), time: "9:00 AM", capacity: 8, bookedCount: 1, isAvailable: true },
            { date: new Date('2025-12-06T00:00:00Z'), time: "9:00 AM", capacity: 8, bookedCount: 0, isAvailable: true },
        ],
    }
];

// --- Database Connection and Seeding Logic ---

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri: string = process.env.MONGO_URI || 'mongodb://localhost:27017/bookit_db';
        const conn = await mongoose.connect(mongoUri);
        console.log(`\n💎 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // 💡 Use the type guard 'instanceof Error' to access the message safely
        const errorMessage = error instanceof Error ? error.message : 'An unknown database connection error occurred.';
        console.error(`\n🚨 Error connecting to MongoDB: ${errorMessage}`);
        process.exit(1);
    }
};

const importData = async (): Promise<void> => {
    await connectDB();
    try {
        console.log('⏳ Preparing to obliterate and replenish the catalogue...');
        // Obliterate the existing collection with extreme prejudice (drop all data)
        await Experience.deleteMany({}); 

        // Insert the new, respectable data
        // 💡 'insertMany' expects an array matching the Mongoose Model's interface (IExperience). 
        // We ensure the data conforms to the required fields.
        await Experience.insertMany(experiencesData as IExperience[]);

        console.log('✅ Data Imported with utmost success! The catalogue is replenished.');
        process.exit(0); // Explicitly use 0 for success
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown data importation error occurred.';
        console.error(`\n❌ A deplorable data importation failure: ${errorMessage}`);
        process.exit(1);
    }
};

// Start the import process
importData();