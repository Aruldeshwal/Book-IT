import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot {
    date: Date;
    time: string; // e.g., "10:00 AM"
    capacity: number;
    bookedCount: number;
    isAvailable: boolean;
}

export interface IExperience extends Document {
    title: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    location: string; 
    slots: ISlot[];
}

const SlotSchema: Schema = new Schema({
    date: { type: Date, required: true },
    time: { type: String, required: true },
    capacity: { type: Number, required: true, default: 10 },
    bookedCount: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, required: true, default: true },
});

const ExperienceSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true }, 
    slots: [SlotSchema],
}, { timestamps: true });

const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
export default Experience;