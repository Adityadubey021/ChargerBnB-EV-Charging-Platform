import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/postgres';
import User from './User.model';

interface AdminActionAttributes {
    id: number;
    adminId: number;
    actionType: 'APPROVE_CHARGER' | 'REJECT_CHARGER' | 'SUSPEND_HOST' | 'DELETE_HOST' | 'RESOLVE_REPORT' | 'DELETE_REVIEW' | 'OTHER';
    targetTable: string; // 'chargers', 'users', 'reports', etc.
    targetId: number; // ID of the affected record
    metadata?: any; // JSON object with additional details
    reason?: string; // Admin's reason for action
    createdAt?: Date;
}

interface AdminActionCreationAttributes extends Optional<AdminActionAttributes, 'id' | 'createdAt'> { }

class AdminAction extends Model<AdminActionAttributes, AdminActionCreationAttributes> implements AdminActionAttributes {
    public id!: number;
    public adminId!: number;
    public actionType!: 'APPROVE_CHARGER' | 'REJECT_CHARGER' | 'SUSPEND_HOST' | 'DELETE_HOST' | 'RESOLVE_REPORT' | 'DELETE_REVIEW' | 'OTHER';
    public targetTable!: string;
    public targetId!: number;
    public metadata?: any;
    public reason?: string;
    public readonly createdAt!: Date;
}

AdminAction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        actionType: {
            type: DataTypes.ENUM(
                'APPROVE_CHARGER',
                'REJECT_CHARGER',
                'SUSPEND_HOST',
                'DELETE_HOST',
                'RESOLVE_REPORT',
                'DELETE_REVIEW',
                'OTHER'
            ),
            allowNull: false
        },
        targetTable: {
            type: DataTypes.STRING,
            allowNull: false
        },
        targetId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            defaultValue: {}
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'admin_actions',
        timestamps: true,
        updatedAt: false // Only track creation, not updates
    }
);

// Relationships
AdminAction.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

export default AdminAction;
