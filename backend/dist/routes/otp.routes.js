"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const OTP_model_1 = __importDefault(require("../models/postgres/OTP.model"));
const email_service_1 = require("../services/email.service");
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
// Send OTP to email
router.post('/send-otp', [(0, express_validator_1.body)('email').isEmail().normalizeEmail()], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email } = req.body;
        // Generate 6-digit OTP
        const otp = (0, email_service_1.generateOTP)();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Delete old OTPs for this email
        await OTP_model_1.default.destroy({ where: { email } });
        // Create new OTP
        await OTP_model_1.default.create({ email, otp, expiresAt, verified: false });
        // Send email
        const sent = await (0, email_service_1.sendOTPEmail)(email, otp);
        if (!sent) {
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }
        res.json({ message: 'OTP sent successfully', expiresIn: 600 }); // 600 seconds
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Verify OTP
router.post('/verify-otp', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, otp } = req.body;
        // Find OTP
        const otpRecord = await OTP_model_1.default.findOne({
            where: {
                email,
                otp,
                verified: false,
                expiresAt: { [sequelize_1.Op.gt]: new Date() } // Not expired
            }
        });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        // Mark as verified
        otpRecord.verified = true;
        await otpRecord.save();
        res.json({ message: 'Email verified successfully', verified: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
