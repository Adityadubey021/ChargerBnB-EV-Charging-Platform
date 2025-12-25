import express, { Request, Response } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import Booking, { BookingStatus } from '../models/postgres/Booking.model';
import Charger from '../models/postgres/Charger.model';
import User from '../models/postgres/User.model';
import { Op } from 'sequelize';

const router = express.Router();

// All host routes require authentication and HOST role
router.use(authenticateToken);
router.use(authorizeRoles('HOST'));

/**
 * GET /api/host/bookings
 * Get all bookings for host's chargers
 */
router.get('/bookings', async (req: Request, res: Response) => {
    try {
        const { status, chargerId, page = 1, limit = 20 } = req.query;

        // Get host's chargers
        const hostChargers = await Charger.findAll({
            where: { hostId: req.user!.userId },
            attributes: ['id']
        });

        const chargerIds = hostChargers.map(c => c.id);

        if (chargerIds.length === 0) {
            return res.json({
                bookings: [],
                pagination: { total: 0, page: 1, limit: Number(limit), totalPages: 0 }
            });
        }

        const where: any = {
            chargerId: { [Op.in]: chargerIds }
        };

        if (status) {
            where.status = status;
        }

        if (chargerId) {
            where.chargerId = chargerId;
        }

        const offset = (Number(page) - 1) * Number(limit);

        const { count, rows: bookings } = await Booking.findAndCountAll({
            where,
            limit: Number(limit),
            offset,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
                },
                {
                    model: Charger,
                    as: 'charger',
                    attributes: ['id', 'title', 'address', 'city', 'chargerType', 'pricePerHour']
                }
            ],
            order: [['startTime', 'ASC']]
        });

        res.json({
            bookings,
            pagination: {
                total: count,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(count / Number(limit))
            }
        });
    } catch (error: any) {
        console.error('Error fetching host bookings:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/host/bookings/:id/accept
 * Accept a booking request
 */
router.patch('/bookings/:id/accept', async (req: Request, res: Response) => {
    try {
        const { hostNotes } = req.body;
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                {
                    model: Charger,
                    as: 'charger'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify this booking belongs to host's charger
        if (booking.charger?.hostId !== req.user!.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (booking.status !== BookingStatus.PENDING) {
            return res.status(400).json({ error: 'Only pending bookings can be accepted' });
        }

        booking.status = BookingStatus.CONFIRMED;
        booking.hostNotes = hostNotes;
        await booking.save();

        res.json({ message: 'Booking accepted successfully', booking });
    } catch (error: any) {
        console.error('Error accepting booking:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/host/bookings/:id/reject
 * Reject a booking request
 */
router.patch('/bookings/:id/reject', async (req: Request, res: Response) => {
    try {
        const { hostNotes } = req.body;
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                {
                    model: Charger,
                    as: 'charger'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Verify this booking belongs to host's charger
        if (booking.charger?.hostId !== req.user!.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (booking.status !== BookingStatus.PENDING) {
            return res.status(400).json({ error: 'Only pending bookings can be rejected' });
        }

        booking.status = BookingStatus.REJECTED;
        booking.hostNotes = hostNotes;
        await booking.save();

        res.json({ message: 'Booking rejected', booking });
    } catch (error: any) {
        console.error('Error rejecting booking:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * PATCH /api/host/bookings/:id/complete
 * Mark booking as completed
 */
router.patch('/bookings/:id/complete', async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                {
                    model: Charger,
                    as: 'charger'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (booking.charger?.hostId !== req.user!.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            return res.status(400).json({ error: 'Only confirmed bookings can be marked as completed' });
        }

        booking.status = BookingStatus.COMPLETED;
        await booking.save();

        res.json({ message: 'Booking marked as completed', booking });
    } catch (error: any) {
        console.error('Error completing booking:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
