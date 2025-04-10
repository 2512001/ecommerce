const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;
        const query = { isActive: true };

        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const sortOptions = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 }
        };

        console.log(query);

        const products = await Product.find(query)
            .sort(sortOptions[sort] || { createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));


        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
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
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        product.isActive = false;
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product deactivated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAdminProducts = async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = {
            isActive: true,
            createdBy: req.user.id
        };

        if (category) query.category = category;
        if (search) query.$text = { $search: search };

        const sortOptions = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'newest': { createdAt: -1 },
            'oldest': { createdAt: 1 }
        };



        const products = await Product.find(query)
            .sort(sortOptions[sort] || { createdAt: -1 })
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