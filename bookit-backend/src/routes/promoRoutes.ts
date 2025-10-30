import express from 'express';

const router = express.Router();

type Promo = {
    type: 'percentage' | 'flat'; // A gentleman only uses precise values.
    value: number;
    description: string;
};
type PromoCodes = {
    [key: string]: Promo;
};
// Define a simple list of valid promo codes
const promoCodes:PromoCodes = {
    SAVE10: { type: 'percentage', value: 0.10, description: '10% off the total price' },
    FLAT100: { type: 'flat', value: 100, description: 'A stately $100 deduction' },
};

// POST /promo/validate - Validate promo codes
router.post('/validate', (req, res) => {
    const { code, originalPrice } = req.body;

    if (!code || originalPrice === undefined) {
        return res.status(400).json({ message: 'Both the code and the original price are required, good sir.' });
    }

    const promo: Promo | undefined = promoCodes[code.toUpperCase()];

    if (!promo) {
        return res.status(404).json({ message: 'This promo code is not recognized by any reputable institution.' });
    }

    let discountAmount = 0;
    let finalPrice = originalPrice;

    if (promo.type === 'percentage') {
        discountAmount = originalPrice * promo.value;
        finalPrice = originalPrice - discountAmount;
    } else if (promo.type === 'flat') {
        discountAmount = promo.value;
        finalPrice = originalPrice - promo.value;
    }
    
    // Ensure the price doesn't go below zero
    finalPrice = Math.max(0, finalPrice);

    res.json({
        isValid: true,
        discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimals
        finalPrice: Math.round(finalPrice * 100) / 100,
        promoDetails: promo,
    });
});

export default router;