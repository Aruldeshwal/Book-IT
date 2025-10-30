import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Experience {
    _id: string;
    title: string;
    price: number;
    duration: string;
    image: string;
}

export interface Slot {
    date: string;
    time: string;
    capacity: number;
    bookedCount: number;
    isAvailable: boolean;
}

export interface ExperienceDetail extends Experience {
    description: string;
    slots: Slot[];
}

export const fetchExperiences = async (): Promise<Experience[]> => {
    const { data } = await axios.get(`${API_BASE_URL}/experiences`);
    return data;
};

export const fetchExperienceDetails = async (id: string): Promise<ExperienceDetail> => {
    const { data } = await axios.get(`${API_BASE_URL}/experiences/${id}`);
    return data;
};

export const createBooking = async (bookingData: any): Promise<{ message: string, bookingId: string, finalPrice: number }> => {
    const { data } = await axios.post(`${API_BASE_URL}/bookings`, bookingData);
    return data;
};

export const validatePromoCode = async (code: string, originalPrice: number): Promise<any> => {
    const { data } = await axios.post(`${API_BASE_URL}/promo/validate`, { code, originalPrice });
    return data;
};