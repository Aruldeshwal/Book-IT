import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    experienceId: mongoose.Schema.Types.ObjectId;
    slotDate: Date;
    slotTime: string;
    userName: string;
    userEmail: string;
    promoCodeUsed?: string;
    finalPrice: number;
    isConfirmed: boolean;
}

const BookingSchema: Schema = new Schema({
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
    slotDate: { type: Date, required: true },
    slotTime: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    promoCodeUsed: { type: String },
    finalPrice: { type: Number, required: true },
    isConfirmed: { type: Boolean, default: true },
}, { timestamps: true });

const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;