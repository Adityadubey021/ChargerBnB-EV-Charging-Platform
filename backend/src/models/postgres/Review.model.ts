import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/postgres';
import User from './User.model';
import Charger from './Charger.model';

interface ReviewAttributes {
    id: number;
    chargerId: number;
    userId: number;
    rating: number; // 1-5
    comment?: string;
    isVerified: boolean; // true if user actually used the charger
    bookingId?: number; // reference to booking that this review is for
    isApproved: boolean; // admin can moderate reviews
    createdAt?: Date;
    updatedAt?: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
    public id!: number;
    public chargerId!: number;
    public userId!: number;
    public rating!: number;
    public comment?: string;
    public isVerified!: boolean;
    public bookingId?: number;
    public isApproved!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        chargerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Charger, key: 'id' }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            comment: 'True if user actually booked/used this charger'
        },
        bookingId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Reference to booking (for future implementation)'
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            comment: 'Admin can reject abusive reviews'
        }
    },
    {
        sequelize,
        tableName: 'reviews',
        timestamps: true
    }
);

// Relationships
Review.belongsTo(Charger, { foreignKey: 'chargerId', as: 'charger' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Review;
