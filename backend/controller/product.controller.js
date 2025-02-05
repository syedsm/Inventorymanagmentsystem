const Product = require("../models/Product.model");

const addProduct = async (req, res) => {
    // console.log(req.body);
    try {
        const {
            category,
            ProductName,
            Price,
            Description,
            ExpirationDate,
            Weight,
            Status,
            Quantity,
            Brand,
        } = req.body;

        // Check if ProductName is provided
        if (!ProductName) {
            return res.status(400).json({ error: 'Product name is required' });
        }
        // Check for duplicate product name
        const existingProduct = await Product.findOne({ Productname: ProductName });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product name already exists' });
        }
        // Construct the product data dynamically based on category
        const productData = {
            Productname: ProductName,
            Category: category,
            Price: Price,
            Description: Description,
            Stockstatus: Status,
            Quantity: Quantity,
            Brand: Brand,
            Images: req.files ? req.files.map(file => file.filename) : [],
        };

        // Add category-specific fields
        if (category === 'groceries') {
            productData.Groceriesdetails = {
                weight: Weight,
                Expirationdate: new Date(ExpirationDate),
            };
        } else if (category === 'electronics') {
            productData.Electronicsdetails = {
                Warranty: req.body.Warranty
            };
        } else if (category === 'furniture') {
            productData.Furnituredetails = {
                Material: req.body.Material,
                Dimensions: req.body.Dimensions,
            };
        }
        else if (category === 'clothing') {
            productData.Clothingedetails = {
                Material: req.body.Material,
            };
        }

        // Save to the database
        const newProduct = new Product(productData);
        await newProduct.save();
        // console.log("Data Saved", newProduct);

        res.status(201).json({ message: 'Product added successfully!', product: newProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const fetchproduct = async (req, res) => {
    try {
        const record = await Product.find()
        res.status(201).json({ message: "Successfully fetched Data", data: record })
    } catch (error) {
        console.error(error.message);
        res.status(400).json(error.message)
    }

};

const singleproductfetch = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch the product by ID
        const record = await Product.findById(id);

        if (!record) {
            // If no product found, send a 404 response
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Send the product data
        res.status(200).json({
            success: true,
            data: record,
        });
    } catch (error) {
        console.error('Error fetching product:', error);

        // Handle invalid ID or other errors
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
};

const singleproductupdate = async (req, res) => {
    try {
        const productId = req.params.id;
        const productData = req.body;
        const files = req.files;

        console.log("Product ID:", productId);
        console.log("Data received:", productData);
        console.log("Images received:", files);

        // Prepare update object
        const updateData = { ...productData };

        // Handle images (if uploaded)
        if (files && files.length > 0) {
            updateData.Images = files.map(file => file.filename);
        }

        console.log("Updated Data:", updateData);

        // Find the product by ID and update
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updateData }, // Update only the fields provided
            { new: true } // Return the updated document
        );

        // Check if product exists
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const deleteproduct = async (req, res) => {
    // console.log("id recived", req.params.productId);
    try {
        await Product.findByIdAndDelete(req.params.productId)
        res.status(200).json({ message: "Successfully deleted" })
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ message: error.message })
    }
};

module.exports = {
    fetchproduct, addProduct, singleproductfetch, singleproductupdate, deleteproduct
}