import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Charger from '../models/postgres/Charger.model';
import { authenticateToken } from '../middleware/auth.middleware';
import { Op } from 'sequelize';

const router = Router();

// Get all chargers (with enhanced filters) - ONLY approved and available
router.get('/', async (req, res) => {
  try {
    const {
      city,
      state,
      chargerType,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
      search
    } = req.query;

    const where: any = {
      // ONLY show approved and available chargers to users
      isApproved: true,
      isAvailable: true
    };

    // Location filters
    if (city) where.city = city;
    if (state) where.state = state;

    // Charger type filter
    if (chargerType) where.chargerType = chargerType;

    // Price filters
    if (minPrice || maxPrice) {
      where.pricePerHour = {};
      if (minPrice) where.pricePerHour[Op.gte] = Number(minPrice);
      if (maxPrice) where.pricePerHour[Op.lte] = Number(maxPrice);
    }

    // Search filter (title, description, city)
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Rating filter would require joining with reviews table
    // For now, we'll handle this in a separate endpoint if needed

    const offset = (Number(page) - 1) * Number(limit);

    // Determine sort field and order
    const validSortFields = ['pricePerHour', 'createdAt', 'title', 'city'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'createdAt';
    const order: any = [[sortField, sortOrder === 'ASC' ? 'ASC' : 'DESC']];

    const { count, rows: chargers } = await Charger.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order,
      attributes: {
        exclude: ['hostId'] // Don't expose host ID to general users
      }
    });

    res.json({
      chargers,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    console.error('Get chargers error:', error);
    res.status(500).json({ error: 'Failed to fetch chargers' });
  }
});

// Get charger by ID
router.get('/:id', async (req, res) => {
  try {
    const charger = await Charger.findByPk(req.params.id);
    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }
    res.json({ charger });
  } catch (error: any) {
    console.error('Get charger error:', error);
    res.status(500).json({ error: 'Failed to fetch charger' });
  }
});

// Create charger (HOST only)
router.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('chargerType').notEmpty().withMessage('Charger type is required'),
    body('powerRating').isNumeric().withMessage('Power rating must be a number'),
    body('pricePerHour').isNumeric().withMessage('Price per hour must be a number'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('pincode').notEmpty().withMessage('Pincode is required'),
  ],
  async (req: any, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is HOST or ADMIN (admin can test)
      if (req.user.role !== 'HOST' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Only hosts can add chargers' });
      }

      const chargerData = {
        ...req.body,
        hostId: req.user.userId,
        isAvailable: true,
        isApproved: false, // Requires admin approval
      };

      const charger = await Charger.create(chargerData);
      res.status(201).json({ message: 'Charger created successfully', charger });
    } catch (error: any) {
      console.error('Create charger error:', error);
      res.status(500).json({ error: 'Failed to create charger' });
    }
  }
);

// Update charger (HOST only - own chargers)
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const charger = await Charger.findByPk(req.params.id);

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    // Check if user owns this charger or is admin
    if (charger.hostId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to edit this charger' });
    }

    await charger.update(req.body);
    res.json({ message: 'Charger updated successfully', charger });
  } catch (error: any) {
    console.error('Update charger error:', error);
    res.status(500).json({ error: 'Failed to update charger' });
  }
});

// Delete charger (HOST only - own chargers)
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const charger = await Charger.findByPk(req.params.id);

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    // Check if user owns this charger or is admin
    if (charger.hostId !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this charger' });
    }

    await charger.destroy();
    res.json({ message: 'Charger deleted successfully' });
  } catch (error: any) {
    console.error('Delete charger error:', error);
    res.status(500).json({ error: 'Failed to delete charger' });
  }
});

// Get host's chargers
router.get('/host/my-chargers', authenticateToken, async (req: any, res) => {
  try {
    const chargers = await Charger.findAll({
      where: { hostId: req.user.userId }
    });
    res.json({ chargers });
  } catch (error: any) {
    console.error('Get host chargers error:', error);
    res.status(500).json({ error: 'Failed to fetch chargers' });
  }
});

export default router;
