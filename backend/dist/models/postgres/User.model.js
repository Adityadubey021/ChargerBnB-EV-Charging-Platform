"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const postgres_1 = __importDefault(require("../../config/postgres"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('USER', 'HOST', 'ADMIN'),
        allowNull: false,
        defaultValue: 'USER'
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    aadhaarNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    panNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    verificationDocumentUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: postgres_1.default,
    tableName: 'users',
    timestamps: true
});
exports.default = User;
