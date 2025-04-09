require('dotenv').config();
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');



// // Load environment variables first
// const envPath = path.resolve(__dirname, '../.env');
// dotenv.config({ path: envPath });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const connectDB = require('./config/database');

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true, 
    credentials: true
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server Error'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 