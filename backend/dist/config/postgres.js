"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPostgres = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Use DATABASE_URL for production (Render), fallback to individual env vars
const sequelize = process.env.DATABASE_URL
    ? new sequelize_1.Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    })
    : new sequelize_1.Sequelize(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`, {
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    });
const connectPostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');
        // Sync models - alter adds new columns without dropping tables
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');
        return sequelize;
    }
    catch (error) {
        console.error('❌ PostgreSQL connection error:', error);
        throw error;
    }
};
exports.connectPostgres = connectPostgres;
exports.default = sequelize;
