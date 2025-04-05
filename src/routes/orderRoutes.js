const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    cancelOrder
} = require('../controllers/orderController');
const { protect , isCustomer } = require('../middleware/auth');

router.route('/')
    .get(protect, getOrders)
    .post(protect, isCustomer , createOrder);

router.route('/:id')
    .get(protect, getOrder);

router.patch('/:id/cancel', protect, cancelOrder);

module.exports = router; 