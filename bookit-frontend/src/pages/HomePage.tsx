import React, { useState, useEffect } from 'react';
import { fetchExperiences } from '../api/apiService';
import type { Experience } from '../api/apiService';
import { Link, useSearchParams } from 'react-router-dom';

// NEW: Define Props structure to receive search term from App.tsx
interface HomePageProps {
   
}

const HomePage: React.FC<HomePageProps> = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const searchTermFromURL = searchParams.get('search') || ''; // Defaults to '' if not present
    // Removed local search state logic, now relying on props.

    // Data Fetching useEffect: Now dependent on the prop
    useEffect(() => {
        const loadExperiences = async () => {
            setLoading(true);
            setError(null);
            try {
                // PASS THE TERM READ DIRECTLY FROM THE URL
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

    // Placeholder rendering remains the same
    if (loading && !experiences.length) return <div className="text-center text-lg p-10 text-dark-text bg-bg-primary min-h-screen">Loading experiences... A moment, please.</div>;
    if (error) return <div className="text-center text-red-600 text-lg p-10 bg-bg-primary min-h-screen">{error}</div>;

    return (
        <div className="p-4 md:px-8 py-6 bg-bg-primary min-h-screen"> 
            
            {/* Conditional message if search returns no results */}
            {loading === false && experiences.length === 0 && searchTermFromURL && (
                <p className="col-span-full text-center text-lg py-10 text-[#6C6C6C]">No distinguished offerings match your search criteria for "{searchTermFromURL}", sir.</p>
            )}

            {/* Grid layout matching typical desktop views, with adequate gap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> 
                {experiences.map((exp) => (
                    // CARD CONTAINER (STYLES PRESERVED)
                    <div 
                        key={exp._id} 
                        className="bg-[#F0F0F0] rounded-xl shadow-md overflow-hidden flex flex-col transition duration-300 hover:shadow-lg"
                    >
                        
                        {/* IMAGE (STYLES PRESERVED) */}
                        <img 
                            src={exp.image} 
                            alt={exp.title} 
                            className="w-full h-44 object-cover flex-none"
                        />

                        {/* CONTENT WRAPPER (STYLES PRESERVED) */}
                        <div className="px-4 py-3 flex flex-col justify-between grow space-y-5">
                            
                            {/* TOP BLOCK (STYLES PRESERVED) */}
                            <div className="flex flex-col space-y-3">
                                
                                <div className="flex items-center justify-between">
                                    {/* Title */}
                                    <h3 className="text-base font-medium text-[#161616] leading-tight">
                                        {exp.title}
                                    </h3>
                                    
                                    {/* Location Tag */}
                                    {exp.location && ( 
                                        <span className="flex items-center justify-center px-2 py-1 bg-[#D6D6D6] rounded-md text-[#161616] text-xs font-medium leading-4 flex-none">
                                            {exp.location || 'Udupi'}
                                        </span>
                                    )}
                                </div>

                                {/* Description Text */}
                                <p className="text-xs font-normal text-[#6C6C6C] leading-4 line-clamp-2">
                                    Curated small-group experience. Certified guide. Safety first with gear included.
                                </p>
                            </div>

                            {/* PRICE + BUTTON ROW (STYLES PRESERVED) */}
                            <div className="flex items-center justify-between pt-1">
                                
                                <div className="flex items-end space-x-1.5">
                                    <span className="text-xs font-normal text-[#161616]">
                                        From
                                    </span>
                                    <p className="text-xl font-medium text-[#161616] leading-tight">
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