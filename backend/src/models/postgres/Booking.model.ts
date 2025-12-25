import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/postgres';
import User from './User.model';
import Charger from './Charger.model';

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    REFUNDED = 'REFUNDED',
    FAILED = 'FAILED'
}

interface BookingAttributes {
    id: number;
    userId: number;
    chargerId: number;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
    totalCost: number;
    paymentStatus: PaymentStatus;
    hostNotes?: string;
    userNotes?: string;
    cancellationReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    public id!: number;
    public userId!: number;
    public chargerId!: number;
    public startTime!: Date;
    public endTime!: Date;
    public status!: BookingStatus;
    public totalCost!: number;
    public paymentStatus!: PaymentStatus;
    public hostNotes?: string;
    public userNotes?: string;
    public cancellationReason?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations
    public readonly user?: User;
    public readonly charger?: Charger;
}

Booking.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        chargerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'chargers',
                key: 'id'
            }
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(BookingStatus)),
            defaultValue: BookingStatus.PENDING,
            allowNull: false
        },
        totalCost: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.ENUM(...Object.values(PaymentStatus)),
            defaultValue: PaymentStatus.PENDING,
            allowNull: false
        },
        hostNotes: {
            type: DataTypes.TEXT
        },
        userNotes: {
            type: DataTypes.TEXT
        },
        cancellationReason: {
            type: DataTypes.TEXT
        }
    },
    {
        sequelize,
        tableName: 'bookings',
        timestamps: true,
        hooks: {
            // Validate booking times
            beforeValidate: (booking: Booking) => {
                if (booking.endTime <= booking.startTime) {
                    throw new Error('End time must be after start time');
                }
                if (booking.startTime < new Date()) {
                    throw new Error('Cannot book in the past');
                }
            }
        }
    }
);

// Define associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Charger, { foreignKey: 'chargerId', as: 'charger' });

export default Booking;
