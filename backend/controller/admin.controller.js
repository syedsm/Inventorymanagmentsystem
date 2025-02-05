const UserModel = require("../models/User.model")
const ProductModel = require("../models/Product.model")

const getUsers = async (req, res) => {
    // console.log(req.query);
    const { role, search } = req.query; // Extract query params
    try {
        // Build the dynamic query
        const query = {};
        if (role) query.role = role; // Add role filter if provided
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: "i" } }, // Case-insensitive email search
                { username: { $regex: search, $options: "i" } }, // Case-insensitive username search
            ];
        }

        // Fetch only required fields based on the role
        const projection = {
            password: 0, // Exclude sensitive data
            authProviderId: 0,
        };

        // Fetch users with the dynamic query and projection
        const users = await UserModel.find(query, projection);

        // Handle specific cases based on role
        if (role === "supplier") {
            // Optionally, return additional supplier details if needed
            users.forEach((user) => {
                if (user.role === "supplier") {
                    user.companyDetails = user.companyDetails || {};
                }
            });
        } else if (role === "staff") {
            // Optionally, include staff-specific fields if needed
            users.forEach((user) => {
                if (user.role === "staff") {
                    user.department = user.department || "N/A"; // Example of adding department
                }
            });
        }

        // Return users data with status
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching users.",
            error: error.message,
        });
    }
};

const companyapprove = async (req, res) => {
    console.log("approve", req.params.id)
    try {

        const status = await UserModel.findOneAndUpdate({ _id: req.params.id }, { isActive: "true" }, { new: true });
        const { isActive } = status
        res.status(200).json({
            message: "User approved successfully",
            data: isActive,
        });

    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

const companysuspend = async (req, res) => {
    console.log("suspend", req.params.id);
    try {
        const status = await UserModel.findOneAndUpdate({ _id: req.params.id }, { isActive: "false" }, { new: true });
        const { isActive } = status
        res.status(200).json({
            message: "User suspended successfully",
            data: isActive,
        });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

const supplierreject = async (req, res) => {
    console.log("Rejected", req.params.id);
    try {
        const id = await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "User rejected successfully",
            data: id,
        });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
}

const dashboarddata = async (req, res) => {
    try {

        const totleUsers = await UserModel.find({ role: "user" }).countDocuments();
        const totalstock = await ProductModel.find({ Stockstatus: "IN-STOCK" }).countDocuments();
        // Define categories
        const categories = ['groceries', 'electronics', 'furniture', 'clothing'];

        // Initialize result object
        const categoryStockLevels = {};

        // Loop through each category
        for (const category of categories) {
            // Count IN-STOCK and OUT-OF-STOCK products
            const inStock = await ProductModel.find({ Category: category, Stockstatus: "IN-STOCK" }).countDocuments();
            const outOfStock = await ProductModel.find({ Category: category, Stockstatus: "OUT-OF-STOCK" }).countDocuments();

            // Log the results
            console.log(`Category: ${category}, In-Stock: ${inStock}, Out-Of-Stock: ${outOfStock}`);

            // Store the results
            categoryStockLevels[category] = {

                inStock,
                outOfStock,
            };
        }

        // Send response
        res.status(200).json({
            message: "Data fetched successfully",
            categoryStockLevels,
            totalstock,
            totleUsers,
        });
    } catch (error) {
        // Handle errors
        console.error("Error fetching stock data:", error);
        res.status(500).json({
            message: "An error occurred while fetching the data",
            error: error.message,
        });
    }
};

module.exports = {
    getUsers, companyapprove, companysuspend, supplierreject, dashboarddata
}