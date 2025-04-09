const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log(`Database connected`);
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB; 