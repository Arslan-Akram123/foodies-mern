const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        food: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Food' },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
    paymentResult: { id: String, status: String, update_time: String, email_address: String },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: { 
      type: String, 
      required: true, 
      enum: ['Pending', 'Cooking', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending' 
    },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);