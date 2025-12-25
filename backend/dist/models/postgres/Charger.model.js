"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../../config/postgres"));
const User_model_1 = __importDefault(require("./User.model"));
class Charger extends sequelize_1.Model {
}
Charger.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    hostId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: User_model_1.default, key: 'id' }
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT
    },
    chargerType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    powerRating: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    chargingSpeed: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    numPorts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1
    },
    plugType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    pricePerHour: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    pricePerKWh: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2)
    },
    peakHourMultiplier: {
        type: sequelize_1.DataTypes.DECIMAL(3, 2),
        defaultValue: 1.0
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: false
    },
    googleMapsUrl: {
        type: sequelize_1.DataTypes.TEXT
    },
    landmark: {
        type: sequelize_1.DataTypes.STRING
    },
    instructions: {
        type: sequelize_1.DataTypes.TEXT
    },
    amenities: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {}
    },
    images: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: []
    },
    primaryImage: {
        type: sequelize_1.DataTypes.STRING
    },
    availabilityHours: {
        type: sequelize_1.DataTypes.JSONB,
        defaultValue: {}
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    isApproved: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    availableSlots: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1
    }
}, {
    sequelize: postgres_1.default,
    tableName: 'chargers',
    timestamps: true
});
Charger.belongsTo(User_model_1.default, { foreignKey: 'hostId', as: 'host' });
exports.default = Charger;
