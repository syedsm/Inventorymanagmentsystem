const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    sparse: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'CANCELLED', 'REJECTED'],
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
