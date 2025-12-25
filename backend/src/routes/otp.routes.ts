import express from 'express';
import { body, validationResult } from 'express-validator';
import OTP from '../models/postgres/OTP.model';
import { generateOTP, sendOTPEmail } from '../services/email.service';
import { Op } from 'sequelize';

const router = express.Router();

// Send OTP to email
router.post('/send-otp',
    [body('email').isEmail().normalizeEmail()],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email } = req.body;

            // Generate 6-digit OTP
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

            // Delete old OTPs for this email
            await OTP.destroy({ where: { email } });

            // Create new OTP
            await OTP.create({ email, otp, expiresAt, verified: false });

            // Send email
            const sent = await sendOTPEmail(email, otp);

            if (!sent) {
                return res.status(500).json({ error: 'Failed to send OTP email' });
            }

            res.json({ message: 'OTP sent successfully', expiresIn: 600 }); // 600 seconds
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

// Verify OTP
router.post('/verify-otp',
    [
        body('email').isEmail().normalizeEmail(),
        body('otp').isLength({ min: 6, max: 6 }).isNumeric()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, otp } = req.body;

            // Find OTP
            const otpRecord = await OTP.findOne({
                where: {
                    email,
                    otp,
                    verified: false,
                    expiresAt: { [Op.gt]: new Date() } // Not expired
                }
            });

            if (!otpRecord) {
                return res.status(400).json({ error: 'Invalid or expired OTP' });
            }

            // Mark as verified
            otpRecord.verified = true;
            await otpRecord.save();

            res.json({ message: 'Email verified successfully', verified: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
);

export default router;
