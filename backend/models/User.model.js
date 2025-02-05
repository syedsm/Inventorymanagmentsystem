const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    profileImg: {
      type: String,
      default: "user.png", // Default profile image
    },

    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (value) {
          return this.authType !== "local" || (value && value.length >= 8);
        },
        message: "Password is required for local sign-up and must be at least 8 characters long",
      },
    },

    phone: {
      type: String,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },

    address: {
      country: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, match: [/^\d{5}$/, "Enter a valid ZIP code"] },
    },

    authType: {
      type: String,
      enum: ["local", "google", "fb"],
      default: "local",
    },

    authProviderId: {
      type: String, // Unique ID from Google/Facebook
      unique: true,
      sparse:true
    },

    role: {
      type: String,
      enum: ["admin", "user", "supplier", "staff"], // Added supplier and staff roles
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    supplierDetails: {
      companyName: { type: String, trim: true }, // Only for suppliers
      gstNumber: { type: String, trim: true },  // Optional GST number for suppliers
      // suppliedCategories: [String], // List of product categories supplier handles
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("User", UserSchema);
