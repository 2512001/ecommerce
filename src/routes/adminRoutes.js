const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getLowStockProducts,
    getRecentOrders,
    getTopSellingProducts
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');

// All admin routes are protected and require admin role
router.use(protect, isAdmin);

router.get('/analytics', getAnalytics);
router.get('/analytics/top-products', getTopSellingProducts);
router.get('/low-stock', getLowStockProducts);
router.get('/recent-orders', getRecentOrders);

module.exports = router; 