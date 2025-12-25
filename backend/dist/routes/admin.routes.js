"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_model_1 = __importDefault(require("../models/postgres/User.model"));
const Charger_model_1 = __importDefault(require("../models/postgres/Charger.model"));
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateToken);
router.use((0, auth_middleware_1.authorizeRoles)('ADMIN'));
router.get('/users', async (req, res) => {
    try {
        const users = await User_model_1.default.findAll({ attributes: { exclude: ['password'] } });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/hosts', async (req, res) => {
    try {
        const hosts = await User_model_1.default.findAll({
            where: { role: 'HOST' },
            attributes: { exclude: ['password'] }
        });
        res.json(hosts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/chargers/:id/approve', async (req, res) => {
    try {
        const charger = await Charger_model_1.default.findByPk(req.params.id);
        if (!charger) {
            return res.status(404).json({ error: 'Charger not found' });
        }
        charger.isApproved = true;
        await charger.save();
        res.json(charger);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
