import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, validatePromoCode } from '../api/apiService';
import { ChevronLeft } from 'lucide-react';

// Updated interface to include 'quantity' which is passed from DetailsPage
interface CheckoutData {
    experienceId: string;
    experienceTitle: string;
    originalPrice: number;
    selectedSlot: any;
    quantity: number; 
    finalPrice: number; 
}

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    
    // --- Data Parsing ---
    const storedData = localStorage.getItem('bookingData');
    const parsedData: CheckoutData | null = storedData ? JSON.parse(storedData) : null;

    const initialDataRef = useRef(parsedData);
    const initialData = initialDataRef.current;
    
    const [isLoading, setIsLoading] = useState(true);

    // Initial state setup: Use the finalPrice from initialData for summary initialization
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        promoCode: '',
    });
    
    // We start with the price calculated in the BookingSummary and update it if a promo is applied
    const [priceSummary, setPriceSummary] = useState({
        originalPrice: initialData?.finalPrice || 0,
        discountAmount: 0,
        finalPrice: initialData?.finalPrice || 0,
        promoCodeUsed: '',
    });
    
    const [validationMsg, setValidationMsg] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Initial price check useEffect (runs once)
    useEffect(() => {
        if (!initialData) {
            console.error('Missing booking data. Redirecting to home.');
            navigate('/'); 
        } else {
            setIsLoading(false);
        }
    }, [initialData, navigate]);


    // Simple form validation check: Ensure both fields are valid and user agrees to terms
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const isFormValid = formData.name.trim() !== '' && formData.email.includes('@') && agreedToTerms;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePromoValidation = async () => {
        if (!initialData) return;
        
        if (!formData.promoCode.trim()) {
            setValidationMsg('Please enter a code, sir.');
            return;
        }
        setBookingLoading(true);
        try {
            const result = await validatePromoCode(formData.promoCode, priceSummary.finalPrice);
            
            if (result.isValid) {
                setPriceSummary(prev => ({
                    ...prev,
                    discountAmount: result.discountAmount,
                    finalPrice: result.finalPrice,
                    promoCodeUsed: formData.promoCode,
                }));
                setValidationMsg(`Success! Discount of $${result.discountAmount.toFixed(2)} applied.`);
            } else {
                setValidationMsg(result.message);
                // Reset discount if code is invalid
                setPriceSummary({
                    originalPrice: initialData.finalPrice, 
                    discountAmount: 0,
                    finalPrice: initialData.finalPrice,
                    promoCodeUsed: '',
                });
            }
        } catch (error: any) {
            setValidationMsg(error.response?.data?.message || 'A validation error occurred. Most irregular!');
             setPriceSummary({
                originalPrice: initialData.finalPrice,
                discountAmount: 0,
                finalPrice: initialData.finalPrice,
                promoCodeUsed: '',
            });
        } finally {
            setBookingLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !initialData) {
            console.error('Form validation failed.');
            return;
        }

        setBookingLoading(true);

        const bookingPayload = {
            experienceId: initialData.experienceId,
            slotDate: initialData.selectedSlot.date,
            slotTime: initialData.selectedSlot.time,
            userName: formData.name,
            userEmail: formData.email,
            finalPrice: priceSummary.finalPrice,
            promoCodeUsed: priceSummary.promoCodeUsed || undefined,
            quantity: initialData.quantity, // Pass quantity to backend
        };

        try {
            const confirmation = await createBooking(bookingPayload);
            localStorage.removeItem('bookingData');
            navigate('/result', { state: { success: true, confirmation } });
        } catch (error: any) {
            navigate('/result', { state: { success: false, message: error.response?.data?.message || 'A catastrophic booking failure has occurred.' } });
        } finally {
            setBookingLoading(false);
        }
    };

    if (isLoading || !initialData) {
        return <div className="text-center p-8 text-lg">Acquiring booking credentials... A moment of dignified waiting.</div>;
    }
    
    const formattedDate = new Date(initialData.selectedSlot.date).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

    // Custom Checkbox SVG Component
    const CheckboxIcon = ({ checked }: { checked: boolean }) => (
        <svg 
            width="16" // Scaled up from 12px to 16px to match h-4 w-4 container
            height="16" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`flex-none ${checked ? 'opacity-100' : 'opacity-0'}`}
        >
            <path 
                fillRule="evenodd" 
                clipRule="evenodd" 
                d="M1.33333 0C0.979711 0 0.640573 0.140476 0.390524 0.390524C0.140476 0.640573 0 0.979711 0 1.33333V10.6667C0 11.0203 0.140476 11.3594 0.390524 11.6095C0.640573 11.8595 0.979711 12 1.33333 12H10.6667C11.0203 12 11.3594 11.8595 11.6095 11.6095C11.8595 11.3594 12 11.0203 12 10.6667V1.33333C12 0.979711 11.8595 0.640573 11.6095 0.390524C11.3594 0.140476 11.0203 0 10.6667 0H1.33333ZM9.3 4.53067C9.42509 4.40566 9.49541 4.23608 9.49547 4.05924C9.49553 3.88239 9.42534 3.71276 9.30033 3.58767C9.17533 3.46257 9.00575 3.39226 8.8289 3.3922C8.65206 3.39214 8.48243 3.46233 8.35733 3.58733L5.05733 6.88733L3.64333 5.47333C3.58144 5.41139 3.50795 5.36225 3.42706 5.32871C3.34617 5.29517 3.25947 5.2779 3.1719 5.27787C2.99506 5.2778 2.82543 5.34799 2.70033 5.473C2.57524 5.59801 2.50493 5.76758 2.50487 5.94443C2.5048 6.12128 2.57499 6.29091 2.7 6.416L4.53867 8.25467C4.60677 8.3228 4.68763 8.37685 4.77662 8.41372C4.86561 8.4506 4.961 8.46958 5.05733 8.46958C5.15367 8.46958 5.24905 8.4506 5.33805 8.41372C5.42704 8.37685 5.5079 8.3228 5.576 8.25467L9.3 4.53067Z" 
                fill="#161616"
            />
        </svg>
    );

    return (
        <div className="font-sans text-[#161616] pb-10 **px-2 md:px-8**"> 

            
{/* 1. REDUCED OUTER PADDING: px-2 (8px) for mobile */}
             {/* Back Button Component (Frame 64) - Checkout label */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center space-x-2 mb-8 mt-2 cursor-pointer hover:opacity-80 transition"
            >
                <ChevronLeft size={20} />

                <span className="text-sm font-medium text-[#161616] leading-[18px]">
                    Checkout
                </span>
            </button>



            {/* Main Layout: Stacks on mobile, Grid on large screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: User Information Form (Frame 62) */}
                
<div className="lg:col-span-2 flex flex-col p-4 sm:p-6 rounded-xl order-1 lg:order-1" style={{ background: '#EFEFEF' }}>

    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6"> {/* REDUCED: space-y-6 -> space-y-4 on mobile */}
        
        {/* Frame 60: Full Name and Email Row (gap: 24px) - Now responsive */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            
            {/* Full Name (Frame 58) */}
            <div className="flex-1 flex flex-col space-y-1 sm:space-y-2"> {/* REDUCED: space-y-2 -> space-y-1 on mobile */}
                <label htmlFor="name" className="text-sm font-normal leading-[18px]" style={{ color: '#5B5B5B' }}>Full name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} 
                        placeholder="Your name"
                        className="w-full bg-[#DDDDDD] rounded-md px-4 h-[42px] text-sm placeholder-[#727272] focus:outline-none focus:ring-1 focus:ring-[#FFD643]" required/>
            </div>
            
            {/* Email (Frame 57) */}
            <div className="flex-1 flex flex-col space-y-1 sm:space-y-2"> {/* REDUCED: space-y-2 -> space-y-1 on mobile */}
                <label htmlFor="email" className="text-sm font-normal leading-[18px]" style={{ color: '#5B5B5B' }}>Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} 
                        placeholder="Your email"
                        className="w-full bg-[#DDDDDD] rounded-md px-4 h-[42px] text-sm placeholder-[#727272] focus:outline-none focus:ring-1 focus:ring-[#FFD643]" required/>
            </div>
        </div>

        {/* Frame 59: Promo Code Row (gap: 16px) */}
        <div className="flex items-end space-x-4">
            {/* Promo Code Input */}
            <div className="grow">
                <label htmlFor="promoCode" className="block text-sm font-normal leading-[18px] mb-1 sm:mb-2" style={{ color: '#5B5B5B' }}>Promo Code</label> {/* REDUCED: mb-2 -> mb-1 on mobile */}
                <input type="text" id="promoCode" name="promoCode" value={formData.promoCode} onChange={handleInputChange} 
                        placeholder="Promo code"
                        className="w-full bg-[#DDDDDD] rounded-md px-4 h-[42px] text-sm placeholder-[#727272] focus:outline-none focus:ring-1 focus:ring-[#FFD643]"/>
            </div>
            
            {/* Apply Button (Frame 2) */}
            <button type="button" onClick={handlePromoValidation} disabled={bookingLoading}
                    className="bg-[#161616] text-[#F9F9F9] px-4 rounded-lg h-[42px] text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {bookingLoading ? 'Validating...' : 'Apply'}
            </button>
        </div>
        {validationMsg && <p className={`text-sm ${priceSummary.discountAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>{validationMsg}</p>}

        {/* Frame 61: Terms Checkbox - Vertical spacing remains minimal */}
        <label htmlFor="terms" className="flex items-center space-x-2 pt-2 cursor-pointer">
            <input 
                type="checkbox" 
                id="terms" 
                checked={agreedToTerms} 
                onChange={() => setAgreedToTerms(!agreedToTerms)} 
                className="sr-only"
            />
            {/* Custom Checkbox Appearance */}
            <div className="relative h-4 w-4 rounded-sm border border-[#5B5B5B] flex-none">
                <div 
                    className={`absolute inset-0 transition-opacity flex items-center justify-center`}
                >
                    <CheckboxIcon checked={agreedToTerms} />
                </div>
            </div>
            
            {/* Text label */}
            <span className="text-xs font-normal leading-4" style={{ color: '#5B5B5B' }}>
                I agree to the terms and safety policy
            </span>
        </label>

    </form>

    {/* Pay and Confirm Button (Mobile only) */}
    <button type="submit" onClick={handleSubmit} disabled={!isFormValid || bookingLoading}
            className="lg:hidden bg-[#FFD643] rounded-lg h-11 text-base font-medium text-[#161616] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6"> {/* REDUCED: mt-6 -> mt-4 on mobile */}
        {bookingLoading ? 'Processing...' : `Pay $${priceSummary.finalPrice.toFixed(2)}`}
    </button>
</div>
                
                {/* RIGHT COLUMN: Order Summary Card (Frame 54) */}
                <div className="lg:col-span-1 p-4 sm:p-6 rounded-xl h-fit flex flex-col space-y-6 **order-2 lg:order-2**" style={{ background: '#EFEFEF' }}> {/* 3. CORRECT ORDER: Order 2 on mobile (below form) */}

                    {/* Frame 56: Summary Rows */}
                    <div className="flex flex-col space-y-4">
                        
                        {/* Frame 52: Experience Details (gap: 10px) */}
                        <div className="flex flex-col space-y-2.5">
                            {/* Experience Row (Frame 54) */}
                            <div className="flex justify-between items-start h-auto"> 
                                <span className="text-base font-normal flex-none pr-4" style={{ color: '#656565' }}>Experience</span>
                                <span className="text-base font-normal text-[#161616] truncate text-right min-w-0" title={initialData.experienceTitle}>{initialData.experienceTitle}</span>
                            </div>

                            {/* Date Row (Frame 50) */}
                            <div className="flex justify-between items-center h-5">
                                <span className="text-base font-normal" style={{ color: '#656565' }}>Date</span>
                                <span className="text-sm font-normal text-[#161616] leading-tight">{formattedDate}</span>
                            </div>

                            {/* Time Row (Frame 55) */}
                            <div className="flex justify-between items-center h-5">
                                <span className="text-base font-normal" style={{ color: '#656565' }}>Time</span>
                                <span className="text-sm font-normal text-[#161616] leading-tight">{initialData.selectedSlot.time}</span>
                            </div>

                            {/* Quantity Row (Frame 51) */}
                            <div className="flex justify-between items-center h-5">
                                <span className="text-base font-normal" style={{ color: '#656565' }}>Qty</span>
                                <span className="text-sm font-normal text-[#161616] leading-tight">{initialData.quantity}</span>
                            </div>
                        </div>

                        {/* Frame 53: Price Breakdown (gap: 10px) */}
                        <div className="flex flex-col space-y-2.5 pt-2">
                            
                            {/* Subtotal Row (Frame 54) - Uses finalPrice from initialData as subtotal base */}
                            <div className="flex justify-between items-center h-5">
                                <span className="text-base font-normal" style={{ color: '#656565' }}>Subtotal</span>
                                {/* Display the original calculated price (including quantity/taxes) received from DetailsPage */}
                                <span className="text-base font-normal text-[#161616]">${initialData.finalPrice.toFixed(2)}</span>
                            </div>

                            {/* Discount/Taxes Row (Frame 50) */}
                            <div className="flex justify-between items-center h-5">
                                <span className="text-base font-normal" style={{ color: '#656565' }}>Discount</span>
                                <span className={`text-sm font-normal leading-tight ${priceSummary.discountAmount > 0 ? 'text-red-500' : 'text-[#161616]'}`}>
                                    -${priceSummary.discountAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Rectangle 1: Separator */}
                        <div className="h-px w-full my-1" style={{ background: '#D9D9D9' }} />

                        {/* Total Row (Frame 51) */}
                        <div className="flex justify-between items-center h-6 pt-1">
                            <span className="text-xl font-medium leading-snug text-[#161616]">Total</span>
                            <span className="text-xl font-medium leading-snug text-[#161616]">${priceSummary.finalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Pay and Confirm Button (Hidden on mobile, shown on desktop) */}
                    <button type="submit" onClick={handleSubmit} disabled={!isFormValid || bookingLoading}
                            className="hidden lg:block bg-[#FFD643] rounded-lg h-11 text-base font-medium text-[#161616] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {bookingLoading ? 'Processing...' : `Pay and Confirm $${priceSummary.finalPrice.toFixed(2)}`}
                    </button>
                </div>
                
                

                </div>
        </div>
    );
};

export default CheckoutPage;