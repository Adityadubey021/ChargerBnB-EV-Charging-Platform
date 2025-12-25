import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create-order', authenticateToken, async (req, res) => {
  res.json({ message: 'Payment order creation - implement with Razorpay' });
});

export default router;

