const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    Productname: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    Category: {
      trim: true,
      type: String,
      required: true,
      enum: ['groceries', 'electronics', 'furniture', 'clothing'],
    },
    Price: {
      type: Number,
      required: true,
      min: 0,
    },
    Stockstatus: {
      type: String,
      required: true,
      enum: ['IN-STOCK', 'OUT-OF-STOCK'],
    },
    Quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    Description: {
      type: String,
      trim: true,
    },
    Images: {
      type: [String], // Array for image URLs
      validate: {
        validator: (array) => array.length <= 4,
        message: 'You can upload up to 4 images only.',
      },
    },
    Brand: {
      type: String,
      required: true,
      trim: true,
      min: 0,
    },
    Groceriesdetails: {
      weight: {
        type: Number,
        required: function () {
          return this.category === 'groceries';
        },
        min: 0,
      },
      Expirationdate: {
        type: Date,
        required: function () {
          return this.category === 'groceries';
        },
      },
    },
    Electronicsdetails: {
      brand: {
        type: String,
        required: function () {
          return this.category === 'electronics';
        },
      },
      Warranty: {
        type: Number,
        required: function () {
          return this.category === 'electronics';
        },
        min: 0,
      },
    },
    Furnituredetails: {
      Material: {
        type: String,
        required: function () {
          return this.category === 'furniture';
        },
      },
      Dimensions: {
        type: String, // e.g., "LxWxH"
        required: function () {
          return this.category === 'furniture';
        },
      },
    },
    Clothingedetails: {
      Material: {
        type: String,
        required: function () {
          return this.category === 'clothing';
        },
      },

    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
