import express, { Request, Response } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import User from '../models/postgres/User.model';
import Charger from '../models/postgres/Charger.model';
import Review from '../models/postgres/Review.model';
import Report from '../models/postgres/Report.model';
import AdminAction from '../models/postgres/AdminAction.model';
import { Op } from 'sequelize';
import sequelize from '../config/postgres';

const router = express.Router();

// All admin routes require authentication and ADMIN role
router.use(authenticateToken);
router.use(authorizeRoles('ADMIN'));

// ============================================
// CHARGER MANAGEMENT (Host Requests)
// ============================================

/**
 * GET /api/admin/chargers
 * List all chargers with filters
 */
router.get('/chargers', async (req: Request, res: Response) => {
  try {
    const {
      status, // 'pending', 'approved', 'rejected' (using isApproved and isActive)
      search,
      page = 1,
      limit = 20,
      city,
      state
    } = req.query;

    const where: any = {};

    // Handle status filter
    if (status === 'pending') {
      where.isApproved = false;
      where.isAvailable = true;
    } else if (status === 'approved') {
      where.isApproved = true;
    } else if (status === 'suspended') {
      where.isAvailable = false;
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (city) where.city = city;
    if (state) where.state = state;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: chargers } = await Charger.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
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
    console.error('Error fetching chargers:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/chargers/:id
 * Get charger details
 */
router.get('/chargers/:id', async (req: Request, res: Response) => {
  try {
    const charger = await Charger.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'host',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'role', 'isActive', 'isVerified']
        }
      ]
    });

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    res.json(charger);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/chargers/:id/approve
 * Approve a charger
 */
router.post('/chargers/:id/approve', async (req: Request, res: Response) => {
  try {
    const { adminComment } = req.body;
    const charger = await Charger.findByPk(req.params.id);

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    charger.isApproved = true;
    charger.isAvailable = true;
    await charger.save();

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'APPROVE_CHARGER',
      targetTable: 'chargers',
      targetId: charger.id,
      reason: adminComment,
      metadata: { chargerId: charger.id, chargerTitle: charger.title }
    });

    // TODO: Send notification email to host

    res.json({ message: 'Charger approved successfully', charger });
  } catch (error: any) {
    console.error('Error approving charger:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/admin/chargers/:id/reject
 * Reject a charger
 */
router.post('/chargers/:id/reject', async (req: Request, res: Response) => {
  try {
    const { adminComment } = req.body;
    const charger = await Charger.findByPk(req.params.id);

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    charger.isApproved = false;
    charger.isAvailable = false;
    await charger.save();

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'REJECT_CHARGER',
      targetTable: 'chargers',
      targetId: charger.id,
      reason: adminComment || 'Charger rejected',
      metadata: { chargerId: charger.id, chargerTitle: charger.title }
    });

    // TODO: Send notification email to host

    res.json({ message: 'Charger rejected', charger });
  } catch (error: any) {
    console.error('Error rejecting charger:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/chargers/:id/suspend
 * Suspend a charger
 */
router.patch('/chargers/:id/suspend', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const charger = await Charger.findByPk(req.params.id);

    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    // When suspending, mark as both unavailable AND not approved
    charger.isAvailable = false;
    charger.isApproved = false;
    await charger.save();

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'SUSPEND_HOST',
      targetTable: 'chargers',
      targetId: charger.id,
      reason: reason || 'Suspended by admin',
      metadata: { chargerId: charger.id }
    });

    res.json({ message: 'Charger suspended', charger });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HOST MANAGEMENT
// ============================================

/**
 * GET /api/admin/hosts
 * Get all hosts
 */
router.get('/hosts', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where: any = { role: 'HOST' };

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'suspended') {
      where.isActive = false;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: hosts } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      hosts,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/hosts/:id/suspend
 * Suspend a host
 */
router.patch('/hosts/:id/suspend', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const host = await User.findByPk(req.params.id);

    if (!host || host.role !== 'HOST') {
      return res.status(404).json({ error: 'Host not found' });
    }

    host.isActive = false;
    await host.save();

    // Suspend all host's chargers
    await Charger.update(
      { isAvailable: false },
      { where: { hostId: host.id } }
    );

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'SUSPEND_HOST',
      targetTable: 'users',
      targetId: host.id,
      reason: reason || 'Host suspended',
      metadata: { hostEmail: host.email }
    });

    res.json({ message: 'Host suspended successfully', host });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/hosts/:id
 * Soft delete a host (set isActive = false)
 */
router.delete('/hosts/:id', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const host = await User.findByPk(req.params.id);

    if (!host) {
      return res.status(404).json({ error: 'Host not found' });
    }

    host.isActive = false;
    await host.save();

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'DELETE_HOST',
      targetTable: 'users',
      targetId: host.id,
      reason: reason || 'Host deleted',
      metadata: { hostEmail: host.email }
    });

    res.json({ message: 'Host deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// REPORTS MANAGEMENT
// ============================================

/**
 * GET /api/admin/reports
 * Get all reports
 */
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: reports } = await Report.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: User, as: 'host', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Charger, as: 'charger', attributes: ['id', 'title', 'city'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reports,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/admin/reports/:id
 * Update report status
 */
router.patch('/reports/:id', async (req: Request, res: Response) => {
  try {
    const { status, adminComment } = req.body;
    const report = await Report.findByPk(req.params.id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.status = status;
    report.adminComment = adminComment;
    report.resolvedBy = req.user!.userId;
    report.resolvedAt = new Date();
    await report.save();

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'RESOLVE_REPORT',
      targetTable: 'reports',
      targetId: report.id,
      reason: adminComment,
      metadata: { reportType: report.type, newStatus: status }
    });

    res.json({ message: 'Report updated successfully', report });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// REVIEWS MANAGEMENT
// ============================================

/**
 * GET /api/admin/reviews
 * Get all reviews
 */
router.get('/reviews', async (req: Request, res: Response) => {
  try {
    const { chargerId, minRating, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (chargerId) where.chargerId = chargerId;
    if (minRating) where.rating = { [Op.gte]: Number(minRating) };

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] },
        { model: Charger, as: 'charger', attributes: ['id', 'title', 'city'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reviews,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/admin/reviews/:id
 * Delete an abusive review
 */
router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await review.destroy();

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'DELETE_REVIEW',
      targetTable: 'reviews',
      targetId: Number(req.params.id),
      reason: reason || 'Review deleted',
      metadata: { reviewRating: review.rating }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ANALYTICS & STATS
// ============================================

/**
 * GET /api/admin/stats/summary
 * Get summary statistics
 */
router.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    // Count chargers by ACTUAL status:
    // Pending: Not approved yet AND available (waiting for approval)
    const pendingChargers = await Charger.count({
      where: {
        isApproved: false,
        isAvailable: true
      }
    });

    // Approved: Approved and available
    const approvedChargers = await Charger.count({
      where: {
        isApproved: true,
        isAvailable: true
      }
    });

    // Suspended/Rejected: Not available (admin suspended/rejected)
    const rejectedChargers = await Charger.count({
      where: {
        isAvailable: false
      }
    });

    // Total chargers
    const totalChargers = await Charger.count();

    // Active hosts
    const activeHosts = await User.count({ where: { role: 'HOST', isActive: true } });

    // Total hosts (including inactive)
    const totalHosts = await User.count({ where: { role: 'HOST' } });

    // Open reports
    const openReports = await Report.count({ where: { status: 'OPEN' } });

    // Calculate average rating
    const avgRating = await Review.findOne({
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      raw: true
    });

    res.json({
      pendingChargers,
      approvedChargers,
      rejectedChargers,
      totalChargers,
      activeHosts,
      totalHosts,
      openReports,
      avgRating: avgRating ? Number((avgRating as any).avgRating).toFixed(2) : 0
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/stats/requests-trend
 * Get charger requests trend over time (last 7 days by default)
 */
router.get('/stats/requests-trend', async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 7;

    // Get chargers from last N days, grouped by date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const trend = await Charger.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'requests'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN \"isApproved\" = true THEN 1 ELSE 0 END")), 'approved'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN \"isAvailable\" = false THEN 1 ELSE 0 END")), 'rejected']
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json({ trend });
  } catch (error: any) {
    console.error('Error fetching trend:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/stats/chargers-by-city
 * Get charger distribution by city
 */
router.get('/stats/chargers-by-city', async (req: Request, res: Response) => {
  try {
    const cityData = await Charger.findAll({
      attributes: [
        'city',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        city: {
          [Op.ne]: null // Exclude null cities
        }
      },
      group: ['city'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10, // Top 10 cities
      raw: true
    });

    res.json({ cityData });
  } catch (error: any) {
    console.error('Error fetching city data:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/admin/activity-log
 * Get admin activity log
 */
router.get('/activity-log', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: actions } = await AdminAction.findAndCountAll({
      limit: Number(limit),
      offset,
      include: [
        { model: User, as: 'admin', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      actions,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DATABASE MAINTENANCE
// ============================================

/**
 * POST /api/admin/fix-statuses
 * Fix charger status inconsistencies in database
 * Ensures isApproved and isAvailable are correctly mapped
 */
router.post('/fix-statuses', async (req: Request, res: Response) => {
  try {
    // Fix 1: Chargers that are not available should also not be approved
    const [updatedCount] = await Charger.update(
      { isApproved: false },
      {
        where: {
          isAvailable: false,
          isApproved: true
        }
      }
    );

    // Get updated stats
    const pending = await Charger.count({
      where: { isApproved: false, isAvailable: true }
    });

    const approved = await Charger.count({
      where: { isApproved: true, isAvailable: true }
    });

    const suspended = await Charger.count({
      where: { isAvailable: false }
    });

    // Log admin action
    await AdminAction.create({
      adminId: req.user!.userId,
      actionType: 'OTHER',
      targetTable: 'chargers',
      targetId: 0,
      reason: 'Fixed charger status inconsistencies',
      metadata: {
        fixedCount: updatedCount,
        stats: { pending, approved, suspended }
      }
    });

    res.json({
      message: 'Database statuses fixed successfully',
      fixedCount: updatedCount,
      currentStats: {
        pending,
        approved,
        suspended
      }
    });
  } catch (error: any) {
    console.error('Error fixing statuses:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
