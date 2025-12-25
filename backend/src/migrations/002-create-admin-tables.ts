import { QueryInterface, DataTypes } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        // Create reviews table
        await queryInterface.createTable('reviews', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            chargerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'chargers', key: 'id' },
                onDelete: 'CASCADE'
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE'
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            bookingId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            isApproved: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Create reports table
        await queryInterface.createTable('reports', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            reporterId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE'
            },
            chargerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'chargers', key: 'id' },
                onDelete: 'CASCADE'
            },
            hostId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE'
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
                references: { model: 'users', key: 'id' }
            },
            resolvedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Create admin_actions table
        await queryInterface.createTable('admin_actions', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            adminId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE'
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
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        });

        // Add indexes for performance
        await queryInterface.addIndex('reviews', ['chargerId']);
        await queryInterface.addIndex('reviews', ['userId']);
        await queryInterface.addIndex('reports', ['status']);
        await queryInterface.addIndex('reports', ['hostId']);
        await queryInterface.addIndex('admin_actions', ['adminId']);
        await queryInterface.addIndex('admin_actions', ['targetTable', 'targetId']);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('admin_actions');
        await queryInterface.dropTable('reports');
        await queryInterface.dropTable('reviews');
    }
};
