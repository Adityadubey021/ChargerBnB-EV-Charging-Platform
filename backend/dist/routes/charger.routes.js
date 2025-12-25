"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const Charger_model_1 = __importDefault(require("../models/postgres/Charger.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all chargers (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { city, state, chargerType, available } = req.query;
        const where = {};
        if (city)
            where.city = city;
        if (state)
            where.state = state;
        if (chargerType)
            where.chargerType = chargerType;
        if (available)
            where.isAvailable = available === 'true';
        const chargers = await Charger_model_1.default.findAll({ where });
        res.json({ chargers });
    }
    catch (error) {
        console.error('Get chargers error:', error);
        res.status(500).json({ error: 'Failed to fetch chargers' });
    }
});
// Get charger by ID
router.get('/:id', async (req, res) => {
    try {
        const charger = await Charger_model_1.default.findByPk(req.params.id);
        if (!charger) {
            return res.status(404).json({ error: 'Charger not found' });
        }
        res.json({ charger });
    }
    catch (error) {
        console.error('Get charger error:', error);
        res.status(500).json({ error: 'Failed to fetch charger' });
    }
});
// Create charger (HOST only)
router.post('/', auth_middleware_1.authenticateToken, [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('chargerType').notEmpty().withMessage('Charger type is required'),
    (0, express_validator_1.body)('powerRating').isNumeric().withMessage('Power rating must be a number'),
    (0, express_validator_1.body)('pricePerHour').isNumeric().withMessage('Price per hour must be a number'),
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address is required'),
    (0, express_validator_1.body)('city').notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)('state').notEmpty().withMessage('State is required'),
    (0, express_validator_1.body)('pincode').notEmpty().withMessage('Pincode is required'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // Check if user is HOST
        if (req.user.role !== 'HOST') {
            return res.status(403).json({ error: 'Only hosts can add chargers' });
        }
        const chargerData = {
            ...req.body,
            hostId: req.user.userId,
            isAvailable: true,
            isApproved: false, // Requires admin approval
        };
        const charger = await Charger_model_1.default.create(chargerData);
        res.status(201).json({ message: 'Charger created successfully', charger });
    }
    catch (error) {
        console.error('Create charger error:', error);
        res.status(500).json({ error: 'Failed to create charger' });
    }
});
// Update charger (HOST only - own chargers)
router.put('/:id', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const charger = await Charger_model_1.default.findByPk(req.params.id);
        if (!charger) {
            return res.status(404).json({ error: 'Charger not found' });
        }
        // Check if user owns this charger
        if (charger.hostId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to edit this charger' });
        }
        await charger.update(req.body);
        res.json({ message: 'Charger updated successfully', charger });
    }
    catch (error) {
        console.error('Update charger error:', error);
        res.status(500).json({ error: 'Failed to update charger' });
    }
});
// Delete charger (HOST only - own chargers)
router.delete('/:id', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const charger = await Charger_model_1.default.findByPk(req.params.id);
        if (!charger) {
            return res.status(404).json({ error: 'Charger not found' });
        }
        // Check if user owns this charger
        if (charger.hostId !== req.user.userId) {
            return res.status(403).json({ error: 'Not authorized to delete this charger' });
        }
        await charger.destroy();
        res.json({ message: 'Charger deleted successfully' });
    }
    catch (error) {
        console.error('Delete charger error:', error);
        res.status(500).json({ error: 'Failed to delete charger' });
    }
});
// Get host's chargers
router.get('/host/my-chargers', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const chargers = await Charger_model_1.default.findAll({
            where: { hostId: req.user.userId }
        });
        res.json({ chargers });
    }
    catch (error) {
        console.error('Get host chargers error:', error);
        res.status(500).json({ error: 'Failed to fetch chargers' });
    }
});
exports.default = router;
