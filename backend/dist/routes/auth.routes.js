"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/postgres/User.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Signup
router.post('/signup', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 10 })
        .withMessage('Password must be at least 10 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    (0, express_validator_1.body)('firstName').trim().notEmpty(),
    (0, express_validator_1.body)('phoneNumber').matches(/^[0-9]{10,11}$/),
    (0, express_validator_1.body)('role').isIn(['USER', 'HOST']),
    // Conditional validation for HOST role
    (0, express_validator_1.body)('aadhaarNumber')
        .if((0, express_validator_1.body)('role').equals('HOST'))
        .matches(/^[2-9]{1}[0-9]{11}$/)
        .withMessage('Aadhaar must be 12 digits starting with 2-9'),
    (0, express_validator_1.body)('panNumber')
        .if((0, express_validator_1.body)('role').equals('HOST'))
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
        .withMessage('PAN must be in format: ABCDE1234F')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password, firstName, lastName, phoneNumber, role, ...hostData } = req.body;
        // Check if user exists
        const existingUser = await User_model_1.default.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const userData = {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            role
        };
        if (role === 'HOST') {
            userData.aadhaarNumber = hostData.aadhaarNumber;
            userData.panNumber = hostData.panNumber;
            userData.address = hostData.address;
            userData.city = hostData.city;
            userData.state = hostData.state;
            userData.pincode = hostData.pincode;
        }
        const user = await User_model_1.default.create(userData);
        // Generate tokens (JWT 2.0)
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') });
        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Login
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty()
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await User_model_1.default.findOne({ where: { email } });
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') });
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Refresh token
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_model_1.default.findByPk(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') });
        res.json({ accessToken });
    }
    catch (error) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
});
// Get current user
router.get('/me', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const user = await User_model_1.default.findByPk(req.user.userId, {
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Forgot password - send OTP
router.post('/forgot-password', [(0, express_validator_1.body)('email').isEmail().normalizeEmail()], async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.json({ message: 'If email exists, reset OTP has been sent' });
        }
        const OTP = (await Promise.resolve().then(() => __importStar(require('../models/postgres/OTP.model')))).default;
        const emailService = await Promise.resolve().then(() => __importStar(require('../services/email.service')));
        const otp = emailService.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await OTP.destroy({ where: { email } });
        await OTP.create({ email, otp, expiresAt, verified: false });
        await emailService.sendOTPEmail(email, otp);
        res.json({ message: 'If email exists, reset OTP has been sent' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Reset password with OTP
router.post('/reset-password', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('otp').isLength({ min: 6, max: 6 }),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 12 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/)
], async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const OTP = (await Promise.resolve().then(() => __importStar(require('../models/postgres/OTP.model')))).default;
        const { Op } = await Promise.resolve().then(() => __importStar(require('sequelize')));
        const otpRecord = await OTP.findOne({
            where: { email, otp, verified: false, expiresAt: { [Op.gt]: new Date() } }
        });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
        const user = await User_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.password = await bcryptjs_1.default.hash(newPassword, 10);
        await user.save();
        otpRecord.verified = true;
        await otpRecord.save();
        res.json({ message: 'Password reset successful' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
