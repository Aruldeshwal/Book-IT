import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Experience, { ISlot } from '../models/ExperienceModel'; 

dotenv.config();

// Helper to generate a future date string (e.g., today + N days)
const getFutureDate = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    // Zero out time components to keep the date consistent (00:00:00Z)
    date.setHours(0, 0, 0, 0); 
    return date;
};

// --- Mock Data: Experiences and Slots ---
const experiencesData = [
    {
        title: "The Kayaking Expedition",
        description: "A serene paddle through lush mangroves and hidden creeks. Certified guide and all safety gear included. Experience the quiet majesty of the backwaters.",
        price: 999.00,
        duration: "4 hours",
        location: "Udupi, Karnataka",
        image: "/images/Kayaking.png", 
        slots: [
            { date: getFutureDate(3), time: "07:00 AM", capacity: 8, bookedCount: 4, isAvailable: true },
            { date: getFutureDate(3), time: "09:00 AM", capacity: 8, bookedCount: 6, isAvailable: true },
            { date: getFutureDate(4), time: "07:00 AM", capacity: 8, bookedCount: 8, isAvailable: false }, // Fully booked
            { date: getFutureDate(5), time: "08:00 AM", capacity: 10, bookedCount: 0, isAvailable: true },
        ] as ISlot[],
    },
    {
        title: "Nandi Hills Sunrise Trek",
        description: "Witness a spectacular dawn from the historic Nandi Hills. Includes transport, breakfast, and professional trekking leadership. An invigorating start to the day.",
        price: 899.00,
        duration: "6 hours",
        location: "Bangalore",
        image: "/images/NandiHills.png", 
        slots: [
            { date: getFutureDate(10), time: "04:00 AM", capacity: 15, bookedCount: 1, isAvailable: true },
            { date: getFutureDate(10), time: "05:00 AM", capacity: 15, bookedCount: 0, isAvailable: true },
            { date: getFutureDate(11), time: "04:00 AM", capacity: 15, bookedCount: 15, isAvailable: false }, // Fully booked
        ] as ISlot[],
    },
    {
        title: "Boat Cruise Sunset Safari",
        description: "A luxury cruise to view coastal wildlife and the magnificent sunset over the Arabian Sea. Refreshments provided. Elegance on the high seas.",
        price: 1899.00,
        duration: "3 hours",
        location: "Sunderban",
        image: "/images/BoatCruise.png", 
        slots: [
            { date: getFutureDate(7), time: "04:30 PM", capacity: 20, bookedCount: 5, isAvailable: true },
            { date: getFutureDate(8), time: "05:00 PM", capacity: 20, bookedCount: 0, isAvailable: true },
        ] as ISlot[],
    },
    {
        title: "Bungee Jumping Thrill",
        description: "Experience the ultimate adrenaline rush from India's highest jump point. Safety inspected and certified by international standards. Courage required.",
        price: 3499.00,
        duration: "2 hours",
        location: "Manali",
        image: "/images/BungeeJumping.png", 
        slots: [
            { date: getFutureDate(14), time: "11:00 AM", capacity: 5, bookedCount: 0, isAvailable: true },
            { date: getFutureDate(15), time: "12:00 PM", capacity: 5, bookedCount: 1, isAvailable: true },
        ] as ISlot[],
    },
    {
        title: "Aromatic Coffee Trail Walk",
        description: "A guided walk through lush coffee plantations. Learn about the bean-to-cup process and enjoy fresh brews. A sensory delight.",
        price: 750.00,
        duration: "3 hours",
        location: "Coorg, Karnataka",
        image: "/images/CoffeeTrail.png", 
        slots: [
            { date: getFutureDate(6), time: "10:00 AM", capacity: 12, bookedCount: 2, isAvailable: true },
            { date: getFutureDate(13), time: "02:00 PM", capacity: 12, bookedCount: 10, isAvailable: true },
        ] as ISlot[],
    },
    {
        title: "Silent Forest Overnight Camping",
        description: "Spend a night under the stars deep within a protected forest. Includes dinner, bonfire, and guided nature interpretation. Pure tranquility.",
        price: 1599.00,
        duration: "2 days",
        location: "Wayanad, Kerala",
        image: "/images/Forest.png", 
        slots: [
            { date: getFutureDate(18), time: "03:00 PM", capacity: 15, bookedCount: 7, isAvailable: true },
            { date: getFutureDate(25), time: "03:00 PM", capacity: 15, bookedCount: 15, isAvailable: false }, // Fully booked
        ] as ISlot[],
    },
    {
        title: "White Water River Rafting",
        description: "Navigate class III and IV rapids on a thrilling river journey. All gear and professional raft masters are provided. Get ready for an adventure!",
        price: 1200.00,
        duration: "3 hours",
        location: "Rishikesh, Uttarakhand",
        image: "/images/River.png", 
        slots: [
            { date: getFutureDate(20), time: "09:30 AM", capacity: 25, bookedCount: 3, isAvailable: true },
            { date: getFutureDate(21), time: "11:00 AM", capacity: 25, bookedCount: 0, isAvailable: true },
        ] as ISlot[],
    },
    {
        title: "Desert Sunrise Camel Safari",
        description: "Experience the magic of a desert sunrise from atop a camel. A traditional Rajasthani breakfast is included. An unforgettable cultural trek.",
        price: 1050.00,
        duration: "5 hours",
        location: "Jaisalmer, Rajasthan",
        image: "/images/Sunrise.png", 
        slots: [
            { date: getFutureDate(22), time: "04:00 AM", capacity: 18, bookedCount: 8, isAvailable: true },
            { date: getFutureDate(29), time: "04:00 AM", capacity: 18, bookedCount: 1, isAvailable: true },
        ] as ISlot[],
    }
];

// --- Database Connection and Seeding Logic ---

const connectDB = async () => {
    try {
        // Use the environment variable for Mongo URI
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookit_db');
        console.log(`\n💎 MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`\n🚨 Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();
    try {
        // Obliterate the existing collection with extreme prejudice (drop all data)
        await Experience.deleteMany({}); 

        // Insert the new, respectable data
        await Experience.insertMany(experiencesData);

        console.log('✅ Data Imported with utmost success! The catalogue is replenished with refined experiences.');
        process.exit();
    } catch (error: any) {
        console.error(`\n❌ A deplorable data importation failure: ${error.message}`);
        process.exit(1);
    }
};

// Start the import process
importData();
