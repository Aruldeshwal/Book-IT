"use client"

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DetailsPage from './pages/DetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ResultPage from './pages/ResultPage';
import Header from './components/Header';
import { useState } from 'react';

function App() {
    // Keep local state only for controlling the input field value in the Header.
    // The actual filtering value will now be read from the URL in HomePage.tsx.
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // NOTE: onSearchSubmit is no longer needed as the search navigation logic moves to Header.tsx

    return (
        <Router>
            <div className="min-h-screen bg-[#F9F9F9] font-sans">
                
                {/* GLOBAL HEADER INTEGRATION */}
                <Header 
                    searchTerm={searchTerm} 
                    onSearchChange={handleSearchChange} 
                    // We remove onSearchSubmit as the Header will now handle navigation internally.
                />

                <main className="mx-auto" style={{ maxWidth: '1440px', minHeight: 'calc(100vh - 87px)' }}>
                    <div className="py-6 px-4 sm:px-12 xl:px-32 2xl:px-48">
                        <Routes>
                            {/* HomePage now reads the search term from the URL */}
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
