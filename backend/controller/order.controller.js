const jwt = require('jsonwebtoken');
const Order = require('../models/Order.model');
const Product = require('../models/Product.model');
// const User = require('../models/User.model');

const Saveorder = async (req, res) => {
    // console.log("Order data received:", req.body);

    try {
        const decoded = jwt.decode(req.body.userId, process.env.JWT_SECRET);
        const userId = decoded.id;
        const {
            paymentMethod,
            items,
            status,
            amount,
            paymentId
        } = req.body;

        const { name, number, address } = req.body.userDetails; 

        const orderItems = []; // Initialize an empty array for the order items

        // Loop through each item and fetch product details
        for (const item of items) {
            // Fetch the product details using the productId
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`);
            }

            // Calculate the price and totalPrice for the item
            const price = product.Price;
            const totalPrice = price * item.quantity;

            // Push the order item into the array
            orderItems.push({
                productId: item.productId,  // Product ID from cart items
                quantity: item.quantity,    // Quantity from cart items
                price,                      // Price of the product from the Product model
                totalPrice                 // Total price (quantity * price)
            });
        }

     // Create a new Order instance with the data
        const newOrder = new Order({
            userId,          // Decoded userId
            phoneNumber: number,
            name,
            address,
            paymentMethod,
            items: orderItems, // Store items in the correct format
            status,             // Payment status (default: 'PENDING')
            totalAmount: amount, // Total amount from the payment response
            paymentId,          // PayPal payment ID or other payment reference
        });

        // // Save the new order to the database
        await newOrder.save();
        // console.log("Order saved successfully:", newOrder);

        // Send a success response with the saved order data
        res.status(201).json({
            message: "Order successfully saved",
            order: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to save the order",
            error: error.message,
        });
    }
};

const userorder = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const UserID = jwt.decode(token)
        const userId = UserID.id
        // console.log("UserID", userId);

        // Fetch orders for the user, and populate prodFuct details in the items array, and user address
        const orders = await Order.find({ userId })
            .populate({
                path: 'items.productId', // Populate product details in the items array
                select: 'Productname Price Description Images', // Specify the fields you want from the Product model
            })
            .populate({
                path: 'userId', // Populate userId to get user details (e.g., address)
                select: 'address name', // Select address field from user model
            })
            .lean() // Convert to plain JS objects
            .exec(); // Always use exec() for better performance

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Log the orders to check populated data
        // console.log("Fetched orders with populated details:", JSON.stringify(orders, null, 2));

        res.status(200).json(orders); // Send the fetched orders as a response
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
};

module.exports = {
    Saveorder, userorder
};
