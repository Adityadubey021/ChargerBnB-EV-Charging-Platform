import bcrypt from 'bcryptjs';
import sequelize from '../src/config/postgres';
import User from '../src/models/postgres/User.model';

async function seedAdminUser() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ where: { email: 'Admin@gmail.com' } });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash('Admin453t@', 10);

        const admin = await User.create({
            email: 'Admin@gmail.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            phoneNumber: '+91999999999',
            role: 'ADMIN',
            isActive: true,
            isVerified: true
        });

        console.log('✅ Admin user created successfully');
        console.log('Email: Admin@gmail.com');
        console.log('Password: Admin453t@');
        console.log('\n⚠️  IMPORTANT: Change this password immediately in production!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
}

seedAdminUser();
