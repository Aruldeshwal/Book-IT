import React, { useState, useEffect } from 'react';
import { fetchExperiences } from '../api/apiService';
import type { Experience } from '../api/apiService';
import { Link, useSearchParams } from 'react-router-dom';

// NEW: Define Props structure (standard interface)
interface HomePageProps {
    
}

const HomePage: React.FC<HomePageProps> = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const searchTermFromURL = searchParams.get('search') || '';
    
    // Data Fetching useEffect: Dependent on the search term in the URL
    useEffect(() => {
        const loadExperiences = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchExperiences(searchTermFromURL); 
                setExperiences(data);
            } catch (err) {
                setError('Failed to fetch experiences. The catalogue is momentarily misplaced.');
            } finally {
                setLoading(false);
            }
        };
        loadExperiences();
    }, [searchTermFromURL]);

    // Conditional rendering for loading/error states
    if (loading && !experiences.length) return <div className="text-center text-lg p-10 text-dark-text bg-bg-primary min-h-screen">Loading experiences... A moment, please.</div>;
    if (error) return <div className="text-center text-red-600 text-lg p-10 bg-bg-primary min-h-screen">{error}</div>;

    return (
        /* Outer Content Wrapper */
        <div 
          className="px-0 md:px-8 py-2 md:py-6 bg-bg-primary min-h-screen"
        > 
            
            {/* Conditional message if search returns no results */}
            {loading === false && experiences.length === 0 && searchTermFromURL && (
                <p className="col-span-full text-center text-lg py-10 text-[#6C6C6C]">No distinguished offerings match your search criteria for "{searchTermFromURL}", sir.</p>
            )}

            {/* Grid Container */}
            {/* The grid is still 1-column on 'sm' (default), but elements inside adapt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
                {experiences.map((exp) => (
                    // CARD CONTAINER
                    <div 
                        key={exp._id} 
                        className="bg-[#F0F0F0] rounded-xl shadow-md overflow-hidden flex flex-col transition duration-300 hover:shadow-lg mx-2 md:mx-0"
                    >
                        
                        {/* IMAGE (height fixed) */}
                        <img 
                            src={exp.image} 
                            alt={exp.title} 
                            className="w-full h-44 object-cover flex-none"
                        />

                        {/* CONTENT WRAPPER */}
                        <div className="px-4 py-4 flex flex-col justify-between grow space-y-4">
                            
                            {/* 💡 TOP BLOCK: Now a single column on extra-small viewports 💡 */}
                            <div className="flex flex-col space-y-2">
                                
                                {/* 💡 Title: Always full width 💡 */}
                                <h3 className="text-base font-medium text-[#161616] leading-tight pr-2">
                                    {exp.title}
                                </h3>
                                
                                {/* 💡 Location Tag: Below title, left-aligned 💡 */}
                                {exp.location && ( 
                                    <span className="self-start px-2 py-1 bg-[#D6D6D6] rounded-md text-[#161616] text-xs font-medium leading-4 flex-none mt-0.5">
                                        {exp.location || 'Udupi'}
                                    </span>
                                )}

                                {/* Description Text */}
                                <p className="text-xs font-normal text-[#6C6C6C] leading-4 line-clamp-2">
                                    Curated small-group experience. Certified guide. Safety first with gear included.
                                </p>
                            </div>

                            {/* 💡 PRICE + BUTTON ROW: Left/Right aligned at the very bottom 💡 */}
                            <div className="flex items-center justify-between pt-1">
                                
                                <div className="flex items-end space-x-1.5">
                                    {/* 💡 'From' text: DISAPPEARS on mobile 💡 */}
                                    <span 
                                        className="hidden sm:inline text-xs md:text-xs font-normal text-[#161616]"
                                    >
                                        From
                                    </span>
                                    
                                    {/* Price text: Now text-base on mobile */}
                                    <p 
                                        className="text-base md:text-xl font-medium text-[#161616] leading-tight"
                                    >
                                        ₹{exp.price}
                                    </p>
                                </div>
                                
                                {/* ACTION BUTTON */}
                                <Link 
                                    to={`/experience/${exp._id}`} 
                                    className="flex items-center justify-center px-2 py-1.5 text-dark-text text-sm font-medium bg-[#FFD643] rounded-md transition hover:opacity-90 shadow-sm"
                                    style={{ lineHeight: '18px' }}
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;