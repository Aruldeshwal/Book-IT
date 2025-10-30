import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking, validatePromoCode } from '../api/apiService';

interface CheckoutData {
  experienceId: string;
  experienceTitle: string;
  originalPrice: number;
  selectedSlot: any;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const storedData = localStorage.getItem('bookingData');
  const initialData: CheckoutData | null = storedData ? JSON.parse(storedData) : null;

  if (!initialData) {
    navigate('/');
    return null;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    promoCode: '',
  });
  const [priceSummary, setPriceSummary] = useState({
    originalPrice: initialData.originalPrice,
    discountAmount: 0,
    finalPrice: initialData.originalPrice,
    promoCodeUsed: '',
  });
  const [validationMsg, setValidationMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple form validation check
  const isFormValid = formData.name.trim() !== '' && formData.email.includes('@');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePromoValidation = async () => {
    if (!formData.promoCode.trim()) {
        setValidationMsg('Please enter a code, sir.');
        return;
    }
    setLoading(true);
    try {
        const result = await validatePromoCode(formData.promoCode, initialData.originalPrice);
        
        if (result.isValid) {
            setPriceSummary(prev => ({
                ...prev,
                discountAmount: result.discountAmount,
                finalPrice: result.finalPrice,
                promoCodeUsed: formData.promoCode,
            }));
            setValidationMsg(`Success! Discount of $${result.discountAmount} applied.`);
        } else {
            setValidationMsg(result.message);
            // Reset discount if code is invalid
            setPriceSummary({
                originalPrice: initialData.originalPrice,
                discountAmount: 0,
                finalPrice: initialData.originalPrice,
                promoCodeUsed: '',
            });
        }
    } catch (error: any) {
        setValidationMsg(error.response?.data?.message || 'A validation error occurred. Most irregular!');
         // Reset discount on error
         setPriceSummary({
            originalPrice: initialData.originalPrice,
            discountAmount: 0,
            finalPrice: initialData.originalPrice,
            promoCodeUsed: '',
        });
    } finally {
        setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        alert('Kindly complete the form with correct information before proceeding.');
        return;
    }

    setLoading(true);

    const bookingPayload = {
        experienceId: initialData.experienceId,
        slotDate: initialData.selectedSlot.date,
        slotTime: initialData.selectedSlot.time,
        userName: formData.name,
        userEmail: formData.email,
        finalPrice: priceSummary.finalPrice,
        promoCodeUsed: priceSummary.promoCodeUsed || undefined,
    };

    try {
        const confirmation = await createBooking(bookingPayload);
        localStorage.removeItem('bookingData'); // Clear temp data
        navigate('/result', { state: { success: true, confirmation } });
    } catch (error: any) {
        navigate('/result', { state: { success: false, message: error.response?.data?.message || 'A catastrophic booking failure has occurred.' } });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 bg-white p-6 shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Booking Acknowledgment (The Checkout)</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Your Noble Information</h3>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} 
                           className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" required/>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} 
                           className="mt-1 block w-full border border-gray-300 rounded-md p-2" required/>
                </div>

                <h3 className="text-xl font-semibold border-b pb-2 pt-4">Promo Code (If Applicable, Sir)</h3>
                <div className="flex gap-3">
                    <input type="text" id="promoCode" name="promoCode" value={formData.promoCode} onChange={handleInputChange} 
                           className="grow border border-gray-300 rounded-md p-2" placeholder="e.g., SAVE10"/>
                    <button type="button" onClick={handlePromoValidation} disabled={loading}
                            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50">
                        {loading ? 'Validating...' : 'Apply Code'}
                    </button>
                </div>
                {validationMsg && <p className={`text-sm ${priceSummary.discountAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>{validationMsg}</p>}

                <button type="submit" disabled={!isFormValid || loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg text-lg font-bold mt-8 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? 'Completing Transaction...' : `Confirm Booking and Pay $${priceSummary.finalPrice.toFixed(2)}`}
                </button>
            </form>
        </div>

        <div className="md:w-1/3 bg-indigo-50 p-6 shadow-md rounded-lg h-fit">
            <h3 className="text-2xl font-bold mb-4 text-indigo-800">Order Summary</h3>
            <p className="text-lg font-medium">{initialData.experienceTitle}</p>
            <p className="text-sm text-gray-600">
                Date: {new Date(initialData.selectedSlot.date).toLocaleDateString()} at {initialData.selectedSlot.time}
            </p>
            
            <hr className="my-4 border-indigo-200"/>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span className="font-semibold">${priceSummary.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span className="font-semibold">-${priceSummary.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-indigo-200 mt-2">
                    <span>Total Due:</span>
                    <span>${priceSummary.finalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CheckoutPage;