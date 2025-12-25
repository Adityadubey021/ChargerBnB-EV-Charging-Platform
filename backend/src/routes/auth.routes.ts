import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/postgres/User.model';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// Signup
router.post('/signup',
  [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 10 })
      .withMessage('Password must be at least 10 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('firstName').trim().notEmpty(),
    body('phoneNumber').matches(/^[0-9]{10,11}$/),
    body('role').isIn(['USER', 'HOST']),
    // Conditional validation for HOST role
    body('aadhaarNumber')
      .if(body('role').equals('HOST'))
      .matches(/^[2-9]{1}[0-9]{11}$/)
      .withMessage('Aadhaar must be 12 digits starting with 2-9'),
    body('panNumber')
      .if(body('role').equals('HOST'))
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
      .withMessage('PAN must be in format: ABCDE1234F')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName, phoneNumber, role, ...hostData } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userData: any = {
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

      const user = await User.create(userData);

      // Generate tokens (JWT 2.0)
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string }
      );

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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as string }
      );

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
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };
    const user = await User.findByPk(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as string }
    );

    res.json({ accessToken });
  } catch (error: any) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user!.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot password - send OTP
router.post('/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.json({ message: 'If email exists, reset OTP has been sent' });
      }

      const OTP = (await import('../models/postgres/OTP.model')).default;
      const emailService = await import('../services/email.service');

      const otp = emailService.generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await OTP.destroy({ where: { email } });
      await OTP.create({ email, otp, expiresAt, verified: false });
      await emailService.sendOTPEmail(email, otp);

      res.json({ message: 'If email exists, reset OTP has been sent' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Reset password with OTP
router.post('/reset-password',
  [
    body('email').isEmail().normalizeEmail(),
    body('otp').isLength({ min: 6, max: 6 }),
    body('newPassword')
      .isLength({ min: 12 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/)
  ],
  async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      const OTP = (await import('../models/postgres/OTP.model')).default;
      const { Op } = await import('sequelize');

      const otpRecord = await OTP.findOne({
        where: { email, otp, verified: false, expiresAt: { [Op.gt]: new Date() } }
      });

      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      otpRecord.verified = true;
      await otpRecord.save();

      res.json({ message: 'Password reset successful' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

