const Order = require('../models/Order');
const Product = require('../models/Product');

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        // Check stock and calculate total price
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
            }

            totalAmount += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress
        });

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get orders
exports.getOrders = async (req, res) => {
    try {
        let query = {};
        
        if (req.user.role !== 'admin') {
            query.user = req.user.id;
        }

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//get single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to access this order' });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: 'Order not found' 
            });
        }

        // only customer
        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'You can only cancel your own orders' 
            });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ 
                success: false,
                message: 'Only pending orders can be cancelled' 
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
}; 