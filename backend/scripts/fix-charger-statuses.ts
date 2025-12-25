import sequelize from './src/config/postgres';
import Charger from './src/models/postgres/Charger.model';

/**
 * Fix charger statuses in database
 * This script ensures all chargers have correct isApproved and isAvailable flags
 */
async function fixChargerStatuses() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Fix 1: Chargers that are not available should also not be approved
        // (Suspended/Rejected chargers)
        const [updatedCount1] = await Charger.update(
            { isApproved: false },
            {
                where: {
                    isAvailable: false,
                    isApproved: true
                }
            }
        );

        console.log(`✅ Fixed ${updatedCount1} chargers: Set isApproved=false for unavailable chargers`);

        // Fix 2: Get current stats
        const pending = await Charger.count({
            where: { isApproved: false, isAvailable: true }
        });

        const approved = await Charger.count({
            where: { isApproved: true, isAvailable: true }
        });

        const suspended = await Charger.count({
            where: { isAvailable: false }
        });

        console.log('\n📊 Current Charger Stats:');
        console.log(`   Pending: ${pending}`);
        console.log(`   Approved: ${approved}`);
        console.log(`   Suspended/Rejected: ${suspended}`);

        // List all chargers with their status
        const allChargers = await Charger.findAll({
            attributes: ['id', 'title', 'isApproved', 'isAvailable'],
            order: [['id', 'ASC']]
        });

        console.log('\n📋 All Chargers:');
        allChargers.forEach(c => {
            const status = c.isApproved && c.isAvailable ? 'APPROVED' :
                !c.isApproved && c.isAvailable ? 'PENDING' :
                    'SUSPENDED/REJECTED';
            console.log(`   ID ${c.id}: ${c.title} - ${status} (approved=${c.isApproved}, available=${c.isAvailable})`);
        });

        console.log('\n✅ Database cleanup complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixChargerStatuses();
