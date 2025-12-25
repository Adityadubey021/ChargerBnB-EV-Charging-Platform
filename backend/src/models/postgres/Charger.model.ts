import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/postgres';
import User from './User.model';

interface ChargerAttributes {
  id: number;
  hostId: number;
  title: string;
  description?: string;

  // Charger specifications
  chargerType: string; // 'Type-2', 'CCS', 'CHAdeMO', etc.
  powerRating: number; // in kW
  chargingSpeed: string; // 'Slow', 'Fast', 'Rapid'
  numPorts: number;
  plugType: string;

  // Pricing
  pricePerHour: number;
  pricePerKWh?: number;
  peakHourMultiplier?: number;

  // Location
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  landmark?: string;
  instructions?: string;

  // Amenities (stored as JSON)
  amenities?: {
    food?: boolean;
    foodCost?: number;
    restrooms?: boolean;
    wifi?: boolean;
    seating?: boolean;
    games?: boolean;
    gamesCost?: number;
    security?: boolean;
    available24x7?: boolean;
  };

  // Images
  images?: string[]; // Array of image URLs
  primaryImage?: string;

  // Availability
  availabilityHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  isAvailable: boolean;
  isApproved: boolean;
  availableSlots: number;

  createdAt?: Date;
  updatedAt?: Date;
}

interface ChargerCreationAttributes extends Optional<ChargerAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Charger extends Model<ChargerAttributes, ChargerCreationAttributes> implements ChargerAttributes {
  public id!: number;
  public hostId!: number;
  public title!: string;
  public description?: string;

  public chargerType!: string;
  public powerRating!: number;
  public chargingSpeed!: string;
  public numPorts!: number;
  public plugType!: string;

  public pricePerHour!: number;
  public pricePerKWh?: number;
  public peakHourMultiplier?: number;

  public address!: string;
  public city!: string;
  public state!: string;
  public pincode!: string;
  public latitude!: number;
  public longitude!: number;
  public googleMapsUrl?: string;
  public landmark?: string;
  public instructions?: string;

  public amenities?: any;
  public images?: string[];
  public primaryImage?: string;
  public availabilityHours?: any;

  public isAvailable!: boolean;
  public isApproved!: boolean;
  public availableSlots!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Charger.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: 'id' }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    chargerType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    powerRating: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    chargingSpeed: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numPorts: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    plugType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pricePerHour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    pricePerKWh: {
      type: DataTypes.DECIMAL(10, 2)
    },
    peakHourMultiplier: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 1.0
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false
    },
    googleMapsUrl: {
      type: DataTypes.TEXT
    },
    landmark: {
      type: DataTypes.STRING
    },
    instructions: {
      type: DataTypes.TEXT
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    primaryImage: {
      type: DataTypes.STRING
    },
    availabilityHours: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    availableSlots: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  },
  {
    sequelize,
    tableName: 'chargers',
    timestamps: true,
    hooks: {
      // Automatically enforce status consistency
      beforeSave: (charger: Charger) => {
        // Rule: If charger is not available (suspended/rejected), it cannot be approved
        if (!charger.isAvailable && charger.isApproved) {
          charger.isApproved = false;
          console.log(`🔧 Auto-corrected: Charger ${charger.id} set isApproved=false (isAvailable=false)`);
        }
      },
      beforeUpdate: (charger: Charger) => {
        // Rule: If charger is not available (suspended/rejected), it cannot be approved
        if (!charger.isAvailable && charger.isApproved) {
          charger.isApproved = false;
          console.log(`🔧 Auto-corrected: Charger ${charger.id} set isApproved=false (isAvailable=false)`);
        }
      }
    }
  }
);

Charger.belongsTo(User, { foreignKey: 'hostId', as: 'host' });

export default Charger;
