import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import Booking, { BookingStatus, PaymentStatus } from '../models/postgres/Booking.model';
import Charger from '../models/postgres/Charger.model';
import User from '../models/postgres/User.model';
import { Op } from 'sequelize';

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

/**
 * GET /api/bookings
 * Get user's bookings
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where: any = { userId: req.user!.userId };

    if (status) {
      where.status = status;
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      include: [
        {
          model: Charger,
          as: 'charger',
          attributes: ['id', 'title', 'address', 'city', 'pricePerHour', 'images', 'chargerType'],
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
            }
          ]
        }
      ],
      order: [['startTime', 'DESC']]
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
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/bookings/:id
 * Get booking details
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Charger,
          as: 'charger',
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
            }
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only allow user to see their own bookings
    if (booking.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/chargers/:id/availability
 * Check charger availability for a specific time range
 */
router.get('/chargers/:id/availability', async (req: Request, res: Response) => {
  try {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'Start time and end time are required' });
    }

    const charger = await Charger.findByPk(req.params.id);
    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    // Find conflicting bookings
    const conflictingBookings = await Booking.findAll({
      where: {
        chargerId: req.params.id,
        status: {
          [Op.in]: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
        },
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [new Date(startTime as string), new Date(endTime as string)]
            }
          },
          {
            endTime: {
              [Op.between]: [new Date(startTime as string), new Date(endTime as string)]
            }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: new Date(startTime as string) } },
              { endTime: { [Op.gte]: new Date(endTime as string) } }
            ]
          }
        ]
      }
    });

    const isAvailable = conflictingBookings.length === 0;

    res.json({
      isAvailable,
      conflictingBookings: conflictingBookings.map(b => ({
        startTime: b.startTime,
        endTime: b.endTime
      }))
    });
  } catch (error: any) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { chargerId, startTime, endTime, userNotes } = req.body;

    // Validate required fields
    if (!chargerId || !startTime || !endTime) {
      return res.status(400).json({ error: 'Charger ID, start time, and end time are required' });
    }

    // Get charger details
    const charger = await Charger.findByPk(chargerId);
    if (!charger) {
      return res.status(404).json({ error: 'Charger not found' });
    }

    if (!charger.isApproved || !charger.isAvailable) {
      return res.status(400).json({ error: 'Charger is not available for booking' });
    }

    // Check for conflicting bookings
    const start = new Date(startTime);
    const end = new Date(endTime);

    const conflictingBookings = await Booking.findAll({
      where: {
        chargerId,
        status: {
          [Op.in]: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
        },
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [start, end]
            }
          },
          {
            endTime: {
              [Op.between]: [start, end]
            }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: start } },
              { endTime: { [Op.gte]: end } }
            ]
          }
        ]
      }
    });

    if (conflictingBookings.length > 0) {
      return res.status(409).json({ error: 'Time slot is already booked' });
    }

    // Calculate total cost
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalCost = durationHours * Number(charger.pricePerHour);

    // Create booking
    const booking = await Booking.create({
      userId: req.user!.userId,
      chargerId,
      startTime: start,
      endTime: end,
      totalCost,
      userNotes,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING
    });

    // Fetch complete booking with associations
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Charger,
          as: 'charger',
          include: [
            {
              model: User,
              as: 'host',
              attributes: ['id', 'firstName', 'lastName', 'email']
            }
          ]
        }
      ]
    });

    res.status(201).json({ message: 'Booking created successfully', booking: createdBooking });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/bookings/:id
 * Update booking (user can only cancel)
 */
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only user who created booking can update it
    if (booking.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Users can only cancel their bookings
    if (status && status !== BookingStatus.CANCELLED) {
      return res.status(400).json({ error: 'Users can only cancel bookings' });
    }

    if (status === BookingStatus.CANCELLED) {
      booking.status = BookingStatus.CANCELLED;
      booking.cancellationReason = cancellationReason;
      await booking.save();
    }

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/bookings/:id
 * Cancel booking
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.userId !== req.user!.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Can only cancel pending or confirmed bookings
    if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status)) {
      return res.status(400).json({ error: 'Cannot cancel this booking' });
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = cancellationReason || 'Cancelled by user';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
