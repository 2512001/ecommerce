const express = require('express');
const router = express.Router();
const {
    getAnalytics,
    getLowStockProducts,
    getRecentOrders,
} = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/auth');
const {aggregation } = require('../backend/pr');


router.get('/aggregation' , aggregation);


// All admin routes are protected and require admin role
router.use(protect, isAdmin);

router.get('/analytics', getAnalytics);
router.get('/low-stock', getLowStockProducts);
router.get('/recent-orders', getRecentOrders);

module.exports = router; 