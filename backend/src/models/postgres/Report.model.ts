import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/postgres';
import User from './User.model';
import Charger from './Charger.model';

interface ReportAttributes {
    id: number;
    reporterId: number; // user who reported
    chargerId: number; // charger being reported
    hostId: number; // host being reported (denormalized for quick access)
    type: 'FRAUD' | 'SPAM' | 'BROKEN_CHARGER' | 'UNSAFE' | 'OTHER';
    description: string;
    status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
    adminComment?: string;
    resolvedBy?: number; // admin user id
    resolvedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ReportCreationAttributes extends Optional<ReportAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
    public id!: number;
    public reporterId!: number;
    public chargerId!: number;
    public hostId!: number;
    public type!: 'FRAUD' | 'SPAM' | 'BROKEN_CHARGER' | 'UNSAFE' | 'OTHER';
    public description!: string;
    public status!: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
    public adminComment?: string;
    public resolvedBy?: number;
    public resolvedAt?: Date;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Report.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        reporterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        chargerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: Charger, key: 'id' }
        },
        hostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: User, key: 'id' }
        },
        type: {
            type: DataTypes.ENUM('FRAUD', 'SPAM', 'BROKEN_CHARGER', 'UNSAFE', 'OTHER'),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'),
            defaultValue: 'OPEN',
            allowNull: false
        },
        adminComment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        resolvedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: { model: User, key: 'id' }
        },
        resolvedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        sequelize,
        tableName: 'reports',
        timestamps: true
    }
);

// Relationships
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
Report.belongsTo(Charger, { foreignKey: 'chargerId', as: 'charger' });
Report.belongsTo(User, { foreignKey: 'hostId', as: 'host' });
Report.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

export default Report;
