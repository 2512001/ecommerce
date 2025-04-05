const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
    let token;


    if (req.cookies.auth_token) {
        token = req.cookies.auth_token;
    }


    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};



const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Not authorized as admin'
        });
    }
    next();
};

const isCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({
            success: false,
            message: 'Only customers can perform this action'
        });
    }
    next();
};

module.exports = { protect, isAdmin, isCustomer };