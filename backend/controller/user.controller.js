const UserModel = require("../models/User.model")
const ProductModel = require('../models/Product.model')
const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

const fetchuser = async (req, res) => {
    const loginEmail = req.params.loginemail;
    // console.log("Login Email:", loginEmail);

    try {
        // Pass an object with the email field to findOne
        const data = await UserModel.findOne({ email: loginEmail });
        if (!data) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json({
            message: "Data retrieved successfully",
            apiData: data,
        });
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

const userupdate = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Uploaded File:', req.file);

        // Extract user ID from the request body
        const id = req.body.userid;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the existing user record
        const existingUser = await UserModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Determine the profile image
        const profileimg = req.file
            ? req.file.filename
            : existingUser.profileimg;

        // Parse the address field if it's a JSON string
        let address = req.body.address;
        try {
            address = JSON.parse(address);
        } catch (error) {
            console.error("Address parsing error:", error.message);
            // Keep the existing address if parsing fails
            address = existingUser.address;
        }

        // Update the user record
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            {
                username: req.body?.username || existingUser.username,
                phone: req.body?.phone || existingUser.phone,
                address: address,
                profileimg: profileimg,
            },
            { new: true } // Return the updated document
        );
        console.log("update", updatedUser);
        res.status(200).json({
            message: 'User updated successfully',
            apiData: updatedUser,
        });

    } catch (err) {
        console.error("Error updating user:", err.message);
        res.status(500).json({
            message: 'Error updating user data',
            error: err.message,
        });
    }
};

// const getAllUsers = async (req, res) => {
//     try {
//         // Fetch all users from the database
//         const users = await UserModel.find({}, { password: 0 }) // Exclude sensitive fields like password
//             .lean()
//             .exec();
//         console.log("fetchd data", users);
//         // Send response with all users
//         return res.status(200).json({
//             success: true,
//             message: "Users fetched successfully",
//             data: users,
//         });
//     } catch (error) {
//         console.error("Error fetching users:", error);

//         // Handle errors
//         return res.status(500).json({
//             success: false,
//             message: "Failed to fetch users",
//             error: error.message,
//         });
//     }
// };

const productfetch = async (req, res) => {
    try {
        // You can add query parameters here (e.g., limit, sort, etc.) if needed
        const products = await ProductModel.find(); // Find all products in the database

        // Check if no products were found
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Send the products data back as a JSON response
        return res.status(200).json({ products });
    } catch (err) {
        // Handle errors, such as database connection issues
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: 'Server error while fetching products' });
    }
};

const cartproducts = async (req, res) => {
    console.log(req.body)
    try {
        const { ids } = req.body
        const record = await ProductModel.find({ _id: { $in: ids } })
        console.log(record)
        res.json({
            status: 200,
            apiData: record,
            message: "Suucessfully Delivered"
        })
    } catch (error) {
        res.json({
            status: 400,
            message: error.message
        })
    }
}

const singleproductfetch = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const userbuy = async (req, res) => {
    try {
        console.log(req.body);
        const { ids } = req.body
        const record = await ProductModel.findOne({ _id: ids });
        // console.log("found record", record);

        if (record) {
            res.status(200).json({ success: true, record });
        } else {
            res.status(404).json({ success: false, message: "Record not found" });
        }
    } catch (error) {
        console.error("Error finding record", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const profile = async (req, res) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1];
        const UserID = jwt.decode(token)

        // console.log("UserID", UserID);

        // Query the database for user profile data using the userId
        const user = await User.findById(UserID.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Send back the user data (you can modify this to include only the relevant fields)
        res.status(200).json(user);
    } catch (error) {
        // console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'An error occurred while fetching profile data.' });
    }
};

module.exports = {
    userbuy,
    singleproductfetch,
    cartproducts,
    productfetch,
    // getAllUsers,
    fetchuser, userupdate, profile
}