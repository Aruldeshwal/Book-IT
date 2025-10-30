import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExperienceDetails} from '../api/apiService';
import type { ExperienceDetail, Slot } from '../api/apiService';
const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ExperienceDetail | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchExperienceDetails(id)
        .then(data => setDetail(data))
        .catch(() => alert('Failed to fetch experience details. A terrible breakdown!'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleBookNow = () => {
    if (!selectedSlot || !detail) {
      alert('A slot must be selected before proceeding, sir.');
      return;
    }

    // Save selected data to localStorage before navigating
    localStorage.setItem('bookingData', JSON.stringify({
      experienceId: detail._id,
      experienceTitle: detail.title,
      originalPrice: detail.price,
      selectedSlot: selectedSlot,
    }));
    
    navigate('/checkout');
  };

  if (loading) return <div className="text-center text-lg">Acquiring the fine details...</div>;
  if (!detail) return <div className="text-center text-red-600 text-lg">No such experience exists. A ghost in the machine!</div>;

  return (
    <div className="bg-white shadow-xl p-6 rounded-lg">
      <h2 className="text-4xl font-bold mb-4">{detail.title}</h2>
      <p className="text-gray-600 mb-6">{detail.description}</p>
      <p className="text-2xl font-semibold text-indigo-700">Price: ${detail.price}</p>
      
      <h3 className="text-2xl font-semibold mt-8 mb-4">Available Slots (A Selection of Respectable Times)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {detail.slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => setSelectedSlot(slot)}
            disabled={!slot.isAvailable}
            className={`p-3 rounded-lg border-2 text-sm transition ${
              !slot.isAvailable 
                ? 'bg-red-200 text-red-700 cursor-not-allowed border-red-400' 
                : selectedSlot === slot 
                  ? 'bg-indigo-600 text-white border-indigo-700' 
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-indigo-100'
            }`}
          >
            {new Date(slot.date).toLocaleDateString()} at {slot.time}
            <p className="text-xs mt-1 font-medium">{slot.isAvailable ? `Seats: ${slot.capacity - slot.bookedCount}` : 'Sold Out!'}</p>
          </button>
        ))}
      </div>

      <button
        onClick={handleBookNow}
        disabled={!selectedSlot}
        className={`mt-8 w-full py-3 rounded-lg text-lg font-bold transition ${
          selectedSlot 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
      >
        {selectedSlot ? `Proceed to Checkout for ${detail.title}` : 'Select a Slot, Gentleman'}
      </button>
    </div>
  );
};

export default DetailsPage;