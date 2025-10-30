import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Experience {
    _id: string;
    title: string;
    price: number;
    duration: string;
    image: string;
    location: string,
    description: string
}

export interface Slot {
    _id: string;
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


export const fetchExperiences = async (search?: string): Promise<Experience[]> => {
    // CRITICAL FIX: The base URL must include the /api prefix, matching the Express middleware.
    let url = `${API_BASE_URL}/experiences`; 
    
    if (search) {
        url += `?search=${encodeURIComponent(search)}`;
    }
    
    //console.log(`[API Call] Fetching URL: ${url}`); // Client-side log left here for debugging confidence
    const { data } = await axios.get(url);
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