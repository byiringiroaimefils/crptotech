const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user who placed the order
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true, // snapshot of product price at purchase time
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, default: "Rwanda" },
      district: { type: String, required: true },
      city: { type: String, required: true },
    },

    shippingMethod: {
      type: String,
      enum: ["Standard", "Express", "Pickup"],
      default: "Standard",
    },

    paymentMethod: {
      type: String,
      enum: ["Card", "Mobile Money", "PayPal", "Cash on Delivery"],
      required: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "delivered",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Order", orderSchema);
