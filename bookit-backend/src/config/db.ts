import mongoose, { ConnectOptions } from 'mongoose';

/**
 * @function connectDB
 * @description Establishes a connection to the MongoDB database.
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
const connectDB = async (): Promise<void> => {
    try {
        // The `ConnectOptions` type is imported for clarity, though Mongoose often infers options now.
        // We ensure process.env.MONGO_URI is treated as a string or defaults.
        const mongoUri: string = process.env.MONGO_URI || 'mongodb://localhost:27017/bookit_db';

        const conn = await mongoose.connect(mongoUri);

        // We use string interpolation within the console log for impeccable presentation.
        console.log(`\n🎉 MongoDB Connection Established: ${conn.connection.host} 🎉`);
    } catch (error) {
        // The 'error' must be explicitly asserted as an 'Error' object
        // to access the 'message' property with type safety.
        const errorMessage = error instanceof Error ? error.message : 'An unknown database connection error occurred.';

        console.error(`\n❌ Fatal Database Error: ${errorMessage}`);
        
        // A gentleman acknowledges his errors and takes decisive action.
        process.exit(1); // Exit the process with an indication of failure.
    }
};

export default connectDB;