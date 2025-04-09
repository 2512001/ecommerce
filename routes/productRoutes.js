const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes - accessible to all users
router.route('/')
    .get(getProducts);

router.route('/:id')
    .get(getProduct);

// Admin routes - only accessible to admin users
router.route('/')
    .post(protect, isAdmin, createProduct);

router.route('/:id')
    .put(protect, isAdmin, updateProduct)
    .delete(protect, isAdmin, deleteProduct);

module.exports = router; 