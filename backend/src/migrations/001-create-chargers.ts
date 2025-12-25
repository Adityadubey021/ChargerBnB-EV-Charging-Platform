import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('chargers', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        hostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        chargerType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        powerRating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        chargingSpeed: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        numPorts: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        plugType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pricePerHour: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pricePerKWh: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        peakHourMultiplier: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        googleMapsUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        amenities: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        primaryImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        availabilityHours: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    // Add index for location-based queries
    await queryInterface.addIndex('chargers', ['city', 'state']);
    await queryInterface.addIndex('chargers', ['isApproved', 'isAvailable']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('chargers');
}
