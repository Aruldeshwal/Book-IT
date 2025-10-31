import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExperienceDetails} from '../api/apiService';
import type { ExperienceDetail, Slot } from '../api/apiService';
import BookingSummary from '../components/BookingSummary';

const DetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [detail, setDetail] = useState<ExperienceDetail | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchExperienceDetails(id)
                .then(data => {
                    setDetail(data);
                    const uniqueDates = data.slots
                        .map(slot => new Date(slot.date).toISOString().split('T')[0])
                        .filter((date, index, self) => self.indexOf(date) === index)
                        .sort();
                    if (uniqueDates.length > 0) {
                        setSelectedDate(uniqueDates[0]);
                    }
                })
                .catch(() => {
                    console.error('Failed to fetch experience details. A terrible breakdown!');
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const availableTimes = useMemo(() => {
        if (!detail || !selectedDate) return [];
        return detail.slots.filter(slot => 
            new Date(slot.date).toISOString().split('T')[0] === selectedDate
        ).sort((a, b) => a.time.localeCompare(b.time));
    }, [detail, selectedDate]);


    const handleBookNow = (quantity: number, finalPrice: number) => {
        if (!selectedSlot || !detail) {
            console.error('A slot must be selected before proceeding, sir.');
            return;
        }

        const bookingPayload = {
            experienceId: detail._id,
            experienceTitle: detail.title,
            originalPrice: detail.price,
            quantity: quantity,
            finalPrice: finalPrice, 
            
            selectedSlot: {
                date: new Date(selectedSlot.date).toISOString(),
                time: selectedSlot.time,
                capacity: selectedSlot.capacity,
                bookedCount: selectedSlot.bookedCount,
                isAvailable: selectedSlot.isAvailable,
                _id: (selectedSlot as any)._id, 
            },
        };

        localStorage.setItem('bookingData', JSON.stringify({
            ...bookingPayload,
            finalPrice: finalPrice,
            quantity: quantity
        }));
        
        console.log("DATA STORED. CHECK LOCAL STORAGE TAB NOW!");
        navigate('/checkout');
    };

    if (loading) return <div className="text-center text-lg py-10">Acquiring the fine details...</div>;
    if (!detail) return <div className="text-center text-red-600 text-lg py-10">No such experience exists. A ghost in the machine!</div>;
    
    const formatDateButton = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    // NOTE: The main wrapper now removes its padding (p-4 md:p-8) to use the App.tsx global margin.
    return (
        <div className="font-sans text-[#161616] pb-10"> 
            
            {/* Back Button Component (Frame 64) - Adjusted vertical spacing */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center space-x-2 mb-8 mt-2 cursor-pointer hover:opacity-80 transition" // Adjust mt/mb for proper alignment
            >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.152 5.4937H2.8437L6.91037 1.42704C7.23537 1.10204 7.23537 0.568703 6.91037 0.243703C6.83328 0.16645 6.7417 0.105161 6.64089 0.0633426C6.54008 0.0215248 6.43201 0 6.32287 0C6.21373 0 6.10566 0.0215248 6.00485 0.0633426C5.90404 0.105161 5.81247 0.16645 5.73537 0.243703L0.243704 5.73537C0.166451 5.81246 0.105161 5.90404 0.063343 6.00485C0.0215252 6.10566 0 6.21373 0 6.32287C0 6.43201 0.0215252 6.54008 0.063343 6.64089C0.105161 6.7417 0.166451 6.83328 0.243704 6.91037L5.73537 12.402C5.81252 12.4792 5.90411 12.5404 6.00492 12.5821C6.10572 12.6239 6.21376 12.6454 6.32287 12.6454C6.43198 12.6454 6.54002 12.6239 6.64082 12.5821C6.74163 12.5404 6.83322 12.4792 6.91037 12.402C6.98752 12.3249 7.04872 12.2333 7.09048 12.1325C7.13223 12.0317 7.15372 11.9236 7.15372 11.8145C7.15372 11.7054 7.13223 11.5974 7.09048 11.4966C7.04872 11.3958 6.98752 11.3042 6.91037 11.227L2.8437 7.16037H12.152C12.6104 7.16037 12.9854 6.78537 12.9854 6.32704C12.9854 5.8687 12.6104 5.4937 12.152 5.4937Z" fill="black"/>
                </svg>


                <span className="text-sm font-medium text-[#161616] leading-[18px]">
                    Details
                </span>
            </button>


            {/* Main Content Layout: Two-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Increased gap for visual breathing room */}

                {/* Left Column (2/3 space): Main Experience Details */}
                <div className="lg:col-span-2 flex flex-col space-y-8"> {/* space-y-8 for vertical gap */}
                    
                    {/* Frame 27: Placeholder for the main image */}
                    <div 
                        /* 💡 ADJUSTMENT: Smaller fixed height on mobile (h-[200px]) 
                           💡 Restored original height only on large screens (lg:h-[381px]) */
                        className="w-full rounded-xl overflow-hidden shadow-md h-[200px] lg:h-[381px] bg-gray-300"
                    > 
                        <img 
                            src={detail.image} 
                            alt={detail.title} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Frame 47: Main Info Block (gap: 32px) 
                        *** Removed bg-white and shadow-md here *** */}
                    <div className="flex flex-col space-y-8">
                        
                        {/* Frame 46: Title and Description Block (gap: 16px) */}
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-2xl font-medium leading-8 text-[#161616]">
                                {detail.title}
                            </h2>
                            <p className="text-base font-normal leading-6 text-[#6C6C6C]">
                                {detail.description}
                            </p>
                        </div>
                        
                        {/* FRAME 45: Slot Selector Block (gap: 24px) */}
                        <div className="flex flex-col space-y-6">
                            
                            {/* Choose Date Section */}
                            <div className="flex flex-col space-y-3">
                                <h3 className="text-lg font-medium leading-[22px] text-[#161616]">
                                    Choose date
                                </h3>
                                
                                {/* 💡 ADJUSTMENT HERE: Replaced space-x-4 overflow-x-auto with flex-wrap and gap-3 for proper wrapping 💡 */}
                                <div className="flex flex-wrap gap-3">
                                    {detail.slots
                                        .reduce((dates: string[], slot) => {
                                            const dateString = new Date(slot.date).toISOString().split('T')[0];
                                            if (!dates.includes(dateString)) {
                                                dates.push(dateString);
                                            }
                                            return dates;
                                        }, [])
                                        .map((dateString) => {
                                            const isSelected = selectedDate === dateString;
                                            return (
                                                <button 
                                                    key={dateString}
                                                    onClick={() => {
                                                        setSelectedDate(dateString);
                                                        setSelectedSlot(null); 
                                                    }}
                                                    className={`
                                                        px-3 py-2 text-sm rounded-md transition border shrink-0
                                                        ${isSelected 
                                                            ? 'bg-[#FFD643] text-[#161616] border-transparent' 
                                                            : 'border-[#BDBDBD] text-[#838383] hover:border-[#FFD643]'
                                                        }
                                                    `}
                                                >
                                                    {formatDateButton(dateString)}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Choose Time Section */}
                            <div className="flex flex-col space-y-3">
                                <h3 className="text-lg font-medium leading-[22px] text-[#161616]">
                                    Choose time
                                </h3>
                                
                                <div className="flex flex-col space-y-3">
                                    <div className="flex flex-wrap gap-4">
                                        {availableTimes.map((slot, index) => {
                                            const slotId = (slot as any)._id || index; 
                                            const isSelected = (selectedSlot as any)?._id === slotId;
                                            const seatsLeft = slot.capacity - slot.bookedCount;
                                            const isSoldOut = !slot.isAvailable || seatsLeft <= 0;
                                            
                                            let slotClasses = `px-3 py-2 text-sm rounded-md transition border flex items-center gap-1.5`; 
                                            let timeTextClass = 'text-sm font-normal leading-[18px]';
                                            let leftTextClass = 'text-[10px] font-medium leading-[12px]'; 
                                            let statusElement = null;

                                            if (isSoldOut) {
                                                slotClasses += ' bg-[#CCCCCC] cursor-not-allowed';
                                                timeTextClass += ' text-[#838383] line-through';
                                                statusElement = <span className='text-[#6A6A6A] line-through'>Sold out</span>;
                                            } else if (isSelected) {
                                                slotClasses += ' bg-[#FFD643] text-[#161616] border-transparent';
                                                timeTextClass += ' text-[#161616]';
                                                leftTextClass += ' text-[#FF4C0A]';
                                            } else {
                                                slotClasses += ' border-[#BDBDBD] text-[#838383] hover:border-[#FFD643]';
                                                timeTextClass += ' text-[#838383]';
                                                leftTextClass += ' text-[#FF4C0A]'; 
                                            }

                                            if (!isSoldOut) {
                                                statusElement = <span className={leftTextClass}>{seatsLeft} left</span>;
                                            }
                                            
                                            return (
                                                <button
                                                    key={slotId}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    disabled={isSoldOut}
                                                    className={slotClasses}
                                                >
                                                    <span className={timeTextClass}>{slot.time}</span>
                                                    {statusElement}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <p className="text-xs font-normal leading-4 text-[#838383] pt-1">
                                        All times are in IST (GMT +5:30)
                                    </p>
                                </div>
                            </div>
                            
                            {/* About Section */}
                            <div className="flex flex-col space-y-3 pt-3">
                                <h3 className="text-lg font-medium leading-[22px] text-[#161616]">
                                    About
                                </h3>
                                
                                <div className="bg-[#EEEEEE] px-3 py-2 rounded-md">
                                    <p className="text-xs font-normal leading-4 text-[#838383]">
                                        Scenic routes, trained guides, and safety briefing. Minimum age 10.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column (1/3 space): Booking Summary Component (Frame 53) */}
                <div className="lg:col-span-1">
                    {selectedSlot ? (
                        <BookingSummary 
                            experiencePrice={detail.price}
                            onConfirm={(quantity, finalPrice) => {
                                handleBookNow(quantity, finalPrice); 
                            }}
                        />
                    ) : (
                        <div className="p-6 rounded-xl shadow-md text-center text-[#6C6C6C]">
                            Kindly select a slot above to proceed to booking summary.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
