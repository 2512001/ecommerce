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

        // Get sales by month
        const salesByMonth = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    total: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                totalOrders,
                totalCustomers,
                topProducts,
                salesByMonth
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


// @access  Private/Admin
exports.getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('user', 'name email')
            .populate('items.product', 'name');

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
        const { limit = 10, timeRange = 'all' } = req.query;
        
        // Set date range based on timeRange parameter
        let dateFilter = {};
        if (timeRange === 'week') {
            dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
        } else if (timeRange === 'month') {
            dateFilter = { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
        } else if (timeRange === 'year') {
            dateFilter = { createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
        }

        const topProducts = await Order.aggregate([
            { $match: { ...dateFilter, paymentStatus: 'completed' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    name: '$productDetails.name',
                    category: '$productDetails.category',
                    totalQuantity: 1,
                    totalRevenue: 1,
                    orderCount: 1,
                    averageOrderValue: { $divide: ['$totalRevenue', '$orderCount'] }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: parseInt(limit) }
        ]);

        // Get total sales for percentage calculation
        const totalSales = await Order.aggregate([
            { $match: { ...dateFilter, paymentStatus: 'completed' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            }
        ]);

        const totalRevenue = totalSales[0]?.total || 0;

        // Add percentage contribution to total sales
        const productsWithPercentage = topProducts.map(product => ({
            ...product,
            percentageOfTotalSales: totalRevenue > 0 ? 
                ((product.totalRevenue / totalRevenue) * 100).toFixed(2) : 0
        }));

        res.status(200).json({
            success: true,
            data: {
                products: productsWithPercentage,
                timeRange,
                totalRevenue,
                totalProducts: topProducts.length
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 