"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const sequelize_1 = require("sequelize");
async function up(queryInterface) {
    await queryInterface.createTable('chargers', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        hostId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        chargerType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        powerRating: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        chargingSpeed: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        numPorts: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 1,
        },
        plugType: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        pricePerHour: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        pricePerKWh: {
            type: sequelize_1.DataTypes.FLOAT,
            defaultValue: 0,
        },
        peakHourMultiplier: {
            type: sequelize_1.DataTypes.FLOAT,
            defaultValue: 1.0,
        },
        address: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        city: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        pincode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        longitude: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        googleMapsUrl: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        landmark: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        instructions: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        amenities: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        images: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        primaryImage: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        availabilityHours: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        isAvailable: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isApproved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    });
    // Add index for location-based queries
    await queryInterface.addIndex('chargers', ['city', 'state']);
    await queryInterface.addIndex('chargers', ['isApproved', 'isAvailable']);
}
async function down(queryInterface) {
    await queryInterface.dropTable('chargers');
}
