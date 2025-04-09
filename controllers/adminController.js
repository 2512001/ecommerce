const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');


// Private/Admin
exports.getAnalytics = async (req, res) => {
    try {
        //total revenue
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const totalOrders = await Order.countDocuments({ status: { $ne: 'cancelled' } });

        const totalCustomers = await User.countDocuments({ role: 'customer' });

        // Get top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            { $group: { _id: '$items.product', totalQuantity: { $sum: '$items.quantity' } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $project: { name: '$product.name', totalQuantity: 1 } }
        ]);

      

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                totalOrders,
                totalCustomers,
                topProducts,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Private/Admin
exports.getLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await Product.find({
            stock: { $lt: 10 } 
        }).select('name stock price');

        res.status(200).json({
            success: true,
            count: lowStockProducts.length,
            data: lowStockProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Private/Admin
exports.getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .populate('items.product' , 'name');

        res.status(200).json({
            success: true,
            data: recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @access  Private/Admin
exports.getTopSellingProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const topProducts = await Order.aggregate([
            // Remove or update this match filter if you have no paymentStatus field
            { $match: { paymentStatus: 'completed' } },

            // Break each item in items array into separate documents
            { $unwind: '$items' },

            // Group by product ID and calculate total quantity sold
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' }
                }
            },

            // Sort by quantity sold
            { $sort: { totalSold: -1 } },

            // Limit number of top products
            { $limit: limit },

            // Join with products collection to get product details
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },

            // Flatten product array (from lookup)
            { $unwind: '$product' },

            // Final shape of the output
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    name: '$product.name',
                    totalSold: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            topProducts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
