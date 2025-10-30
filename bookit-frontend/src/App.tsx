import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // CHANGED TO HASHROUTER
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ResultPage from './pages/ResultPage';
import Header from './components/Header';
import { useState } from 'react';

// The 'use client' directive is correctly placed at the top of the file
// and is useful when using component libraries that rely on it.

function App() {
    // Keep local state only for controlling the input field value in the Header.
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        // USING HASHROUTER: This resolves 404 errors by shifting routing from the server to the client.
        <Router>
            <div className="min-h-screen bg-[#F9F9F9] font-sans">
                
                {/* GLOBAL HEADER INTEGRATION */}
                <Header 
                    searchTerm={searchTerm} 
                    onSearchChange={handleSearchChange} 
                    // onSearchSubmit is not needed here as the logic is now handled by the URL change (which Header will execute)
                />

                <main className="mx-auto" style={{ maxWidth: '1440px', minHeight: 'calc(100vh - 87px)' }}>
                    <div className="py-6 px-4 sm:px-12 xl:px-32 2xl:px-48">
                        <Routes>
                            {/* All routes will now start with /#/ */}
                            <Route path="/" element={<HomePage />} /> 
                            <Route path="/experience/:id" element={<DetailsPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/result" element={<ResultPage />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
