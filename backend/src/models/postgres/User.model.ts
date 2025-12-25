import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/postgres';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  role: 'USER' | 'HOST' | 'ADMIN';
  isActive: boolean;
  isVerified: boolean;
  aadhaarNumber?: string;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  verificationDocumentUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName?: string;
  public phoneNumber!: string;
  public role!: 'USER' | 'HOST' | 'ADMIN';
  public isActive!: boolean;
  public isVerified!: boolean;
  public aadhaarNumber?: string;
  public panNumber?: string;
  public address?: string;
  public city?: string;
  public state?: string;
  public pincode?: string;
  public verificationDocumentUrl?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM('USER', 'HOST', 'ADMIN'),
      allowNull: false,
      defaultValue: 'USER'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    aadhaarNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    panNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true
    },
    verificationDocumentUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);

export default User;

