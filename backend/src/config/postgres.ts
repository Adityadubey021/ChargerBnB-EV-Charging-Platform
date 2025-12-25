import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL for production (Render), fallback to individual env vars
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
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
  : new Sequelize(
    `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
    {
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );

export const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');

    // Sync models - alter adds new columns without dropping tables
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    return sequelize;
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    throw error;
  }
};

export default sequelize;
