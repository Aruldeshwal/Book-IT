import React from 'react';
import '../index.css'
import { useNavigate } from 'react-router-dom';
// Define the expected props structure for clarity
interface HeaderProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// --- Search Bar Component (Inner Element) ---
interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBarComponent: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
    // Styles for the placeholder text specified: Inter, 400, 14px, 18px line-height, text color #727272
    const placeholderText = "Search experiences"; 

    
    return (
        <div 
            // Outer container: w: 340, h: 42, background: #EDEDED, border-radius: 4px
            className="w-[340px] h-[42px] bg-[#EDEDED] rounded-sm opacity-100 flex items-center" 
        >
            <input
                type="text"
                placeholder={placeholderText}
                value={searchTerm} // CONNECTED to state
                onChange={onSearchChange} // CONNECTED to state setter
                
                // Applying padding to the input: pt: 12px, pr: 16px, pb: 12px, pl: 16px
                className="w-full h-full 
                            pt-3 pr-4 pb-3 pl-4 
                            bg-transparent border-none 
                            text-gray-800 
                            focus:outline-none 
                            
                            /* Placeholder Styles - Kept exact as specified */
                            placeholder:font-inter 
                            placeholder:font-normal 
                            placeholder:text-[14px] 
                            placeholder:leading-[18px] 
                            placeholder:text-[#727272]" 
            />
        </div>
    );
};

// --- Main Header Component (Final Structure) ---
const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchChange}) => {
    const navigate = useNavigate(); // 💡 USE THE HOOK
    const handleSearch = () => {
        // 💡 CRITICAL: Navigate to the home page with the search term as a query parameter
        navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    };
    return (
        <header 
            // Outer container: w: 1440, h: 87, bg: #F9F9F9, opacity: 1
            className="flex items-center justify-center 
                        w-full h-[87px] 
                        bg-[#F9F9F9] opacity-100 sticky top-0 z-10" // Added sticky/z-index for fixed header UX
        >
            {/* Inner padding container and box-shadow approximation */}
            <div 
                className="w-full h-full 
                            pt-4 pr-[124px] pb-4 pl-[124px] 
                            flex items-center justify-between 
                            shadow-md"
            >
                {/* 1. LEFT SIDE: Logo Component (w: 100, h: 55) */}
                <div 
                    className="flex items-center justify-center w-[100px] h-[55px] opacity-100" 
                >
                    <img src="/logo/HDlogo1.png" alt="logo.png"></img>
                </div>
                
                {/* 2. RIGHT SIDE CONTAINER (w: 443, h: 42, gap: 16px) */}
                <div 
                    className="flex items-center 
                                w-[443px] h-[42px] opacity-100 
                                gap-4" // 4px is used for gap-4, approximately matching 16px gap
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} // Allow 'Enter' key to search
                >
                    {/* Element A: Search Bar - CONNECTED */}
                    <SearchBarComponent 
                        searchTerm={searchTerm} 
                        onSearchChange={onSearchChange} 
                    />
                    
                    {/* 💡 Element B: THE SEARCH BUTTON - CONNECTED 💡 */}
                    <button
                        onClick={handleSearch} // Triggers search submission
                        // Button Dimensions: w: 87, h: 42, background: #FFD643, border-radius: 8px
                        className="flex items-center justify-center
                                    w-[87px] h-[42px] 
                                    bg-[#FFD643] rounded-lg opacity-100 
                                    font-inter font-semibold text-sm text-gray-800
                                    transition duration-150 hover:bg-[#FFC000]"
                    >
                        {/* Applying padding to the button text for internal spacing */}
                        <span 
                            className="pt-3 pr-5 pb-3 pl-5" // Kept exact padding as specified
                        >
                            Search
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header; // Export the main Header component