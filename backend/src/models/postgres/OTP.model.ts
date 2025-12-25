import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/postgres';

interface OTPAttributes {
    id?: number;
    email: string;
    otp: string;
    expiresAt: Date;
    verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

class OTP extends Model<OTPAttributes> implements OTPAttributes {
    public id!: number;
    public email!: string;
    public otp!: string;
    public expiresAt!: Date;
    public verified!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OTP.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING(6),
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'otps',
        timestamps: true,
    }
);

export default OTP;
