import React, { useState } from 'react';

interface BookingSummaryProps {
    experiencePrice: number;
    onConfirm: (quantity: number, subtotal: number) => void;
    // Assuming taxes are fixed for this example, or passed down
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ experiencePrice, onConfirm }) => {
    // Component state for quantity
    const [quantity, setQuantity] = useState(1);
    const taxesRate = 0.06; // Example tax rate (6% based on ₹59 on ₹999)

    // Derived values
    const subtotal = experiencePrice * quantity;
    const taxes = subtotal * taxesRate;
    const total = subtotal + taxes;

    // Custom Colors used from tailwind.config: dark-text, card-bg, view-details-btn
    const lightGrayText = '#656565';
    const borderGray = '#C9C9C9';

    const handleQuantityChange = (delta: 1 | -1) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    return (
        // FRAME 53: Outer Card Container (bg: #EFEFEF, padding: 24px, gap: 24px, border-radius: 12px)
        <div className="flex flex-col rounded-xl p-6 space-y-6" style={{ background: '#EFEFEF' }}>

            {/* FRAME 56: Content Wrapper (gap: 16px) */}
            <div className="flex flex-col space-y-4 w-full"> {/* space-y-4 is 16px gap */}
                
                {/* FRAME 52: Price/Quantity Rows Wrapper */}
                <div className="flex flex-col space-y-4">

                    {/* 1. Starts At (Frame 54) */}
                    <div className="flex justify-between items-center h-5"> {/* h-5 for 20px line-height */}
                        <span className="text-base font-normal" style={{ color: lightGrayText }}>
                            Starts at
                        </span>
                        <span className="text-lg font-normal text-dark-text leading-snug">
                            ₹{experiencePrice}
                        </span>
                    </div>

                    {/* 2. Quantity (Frame 49) */}
                    <div className="flex justify-between items-center h-5">
                        <span className="text-base font-normal" style={{ color: lightGrayText }}>
                            Quantity
                        </span>
                        
                        {/* Frame 48: Quantity Controls (gap: 9px) */}
                        <div className="flex items-center space-x-2.5"> {/* space-x-2.5 is 10px, closest to 9px gap */}
                            
                            {/* Minus Button (ic:outline-minus) */}
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                                className="w-4 h-4 rounded-sm border flex items-center justify-center text-dark-text disabled:opacity-50"
                                style={{ borderColor: borderGray }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.2" y="0.2" width="15.6" height="15.6" stroke="#C9C9C9" stroke-width="0.4"/>
                                <path d="M12.6668 8.66533H3.3335V7.332H12.6668V8.66533Z" fill="#161616"/>
                                </svg>

                            </button>
                            
                            {/* Quantity Value (1: font-size: 12px) */}
                            <span className="text-xs font-normal text-dark-text">
                                {quantity}
                            </span>
                            
                            {/* Plus Button (material-symbols:add) */}
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="w-4 h-4 rounded-sm border flex items-center justify-center text-dark-text"
                                style={{ borderColor: borderGray }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.2" y="0.2" width="15.6" height="15.6" stroke="#C9C9C9" stroke-width="0.4"/>
                                <path d="M7.3335 8.66666H3.3335V7.33333H7.3335V3.33333H8.66683V7.33333H12.6668V8.66666H8.66683V12.6667H7.3335V8.66666Z" fill="#161616"/>
                                </svg>

                            </button>
                        </div>
                    </div>

                    {/* 3. Subtotal (Frame 50) */}
                    <div className="flex justify-between items-center h-5">
                        <span className="text-base font-normal" style={{ color: lightGrayText }}>
                            Subtotal
                        </span>
                        <span className="text-sm font-normal text-dark-text leading-tight">
                            ₹{subtotal.toFixed(0)}
                        </span>
                    </div>

                    {/* 4. Taxes (Frame 51 - first instance) */}
                    <div className="flex justify-between items-center h-5">
                        <span className="text-base font-normal" style={{ color: lightGrayText }}>
                            Taxes
                        </span>
                        <span className="text-sm font-normal text-dark-text leading-tight">
                            ₹{taxes.toFixed(0)}
                        </span>
                    </div>
                </div>

                {/* Rectangle 1: Separator */}
                <div className="h-px w-full" style={{ background: '#D9D9D9' }} />

                {/* Total (Frame 51 - second instance) */}
                <div className="flex justify-between items-center h-6"> {/* h-6 for 24px line-height */}
                    <span className="text-xl font-medium text-dark-text leading-snug">
                        Total
                    </span>
                    <span className="text-xl font-medium text-dark-text leading-snug">
                        ₹{total.toFixed(0)}
                    </span>
                </div>
            </div>

            {/* Frame 55: Confirm Button */}
            <button
                onClick={() => onConfirm(quantity, total)}
                className="w-full bg-[#D7D7D7] hover:bg-[#FFD643] h-11 flex justify-center items-center rounded-md text-base font-medium transition duration-200 text-[#7F7F7F]"
            >
                Confirm
            </button>
        </div>
    );
};

export default BookingSummary;