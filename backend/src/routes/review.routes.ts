import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  res.json({ message: 'Review creation - implement with Review model' });
});

export default router;

