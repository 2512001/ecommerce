const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = { isActive: true };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        // Sort functionality
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .populate('createdBy', 'name email role')
            .select('-__v');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('createdBy', 'name email role');
            
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new product
// @route   POST /api/products/admin/create
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        // Add the admin's ID to the product data
        const productData = {
            ...req.body,
            createdBy: req.user.id
        };

        const product = await Product.create(productData);
        
        // Populate the createdBy field with user details
        await product.populate('createdBy', 'name email role');
        
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/admin/update/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {

        // First find the product and check if admin owns it
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or you do not have permission to update it'
            });
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('createdBy', 'name email role');

        res.status(200).json({
            success: true,
            data: updatedProduct
        }); 

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/admin/delete/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        // First find the product and check if admin owns it
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or you do not have permission to delete it'
            });
        }

        // Instead of deleting, we'll set isActive to false
        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products created by admin
// @route   GET /api/products/admin/products
// @access  Private/Admin
exports.getAdminProducts = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = { 
            isActive: true,
            createdBy: req.user.id 
        };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        // Sort functionality
        let sortOption = { createdAt: -1 };
        if (sort === 'price_asc') {
            sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
            sortOption = { price: -1 };
        }

        const products = await Product.find(query)
            .sort(sortOption)
            .populate('createdBy', 'name email role')
            .select('-__v');

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product created by admin
// @route   GET /api/products/admin/products/:id
// @access  Private/Admin
exports.getAdminProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
            isActive: true
        }).populate('createdBy', 'name email role');
            
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product created by admin
// @route   PUT /api/products/admin/products/:id
// @access  Private/Admin
exports.updateAdminProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('createdBy', 'name email role');

        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product created by admin
// @route   DELETE /api/products/admin/products/:id
// @access  Private/Admin
exports.deleteAdminProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Instead of deleting, we'll set isActive to false
        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 