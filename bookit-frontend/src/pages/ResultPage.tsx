import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ResultPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { success: boolean, confirmation?: any, message?: string };

  if (!state) {
    return <div className="text-center text-red-600 text-lg">A deplorable navigational error.</div>;
  }

  const { success, confirmation, message } = state;

  return (
    <div className={`text-center p-8 rounded-xl shadow-2xl max-w-lg mx-auto ${success ? 'bg-green-100 border-4 border-green-500' : 'bg-red-100 border-4 border-red-500'}`}>
      {success ? (
        <>
          <h2 className="text-4xl font-extrabold text-green-700 mb-4">✅ Booking Confirmed!</h2>
          <p className="text-xl text-gray-700 mb-6">Your transaction has been executed with the utmost respectability, sir.</p>
          <div className="text-left bg-white p-4 rounded-lg border border-green-200">
            <p className="font-semibold">Confirmation ID: <span className="font-normal block break-all">{confirmation.bookingId}</span></p>
            <p className="font-semibold">Final Price Paid: <span className="font-normal">${confirmation.finalPrice.toFixed(2)}</span></p>
          </div>
          <Link to="/" className="mt-8 inline-block bg-green-600 text-white py-3 px-6 rounded-full text-lg hover:bg-green-700 transition">
            Return to the Catalogue
          </Link>
        </>
      ) : (
        <>
          <h2 className="text-4xl font-extrabold text-red-700 mb-4">❌ Booking Failure!</h2>
          <p className="text-xl text-gray-700 mb-6">A lamentable failure has occurred:</p>
          <p className="text-lg font-mono bg-white p-4 rounded-lg border border-red-200">{message}</p>
          <Link to="/" className="mt-8 inline-block bg-red-600 text-white py-3 px-6 rounded-full text-lg hover:bg-red-700 transition">
            Start Anew
          </Link>
        </>
      )}
    </div>
  );
};

export default ResultPage;