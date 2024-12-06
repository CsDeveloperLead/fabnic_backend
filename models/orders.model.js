import mongoose from "mongoose";

// Schema for individual products
const productSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    productId: { type: String },
    name: { type: String, required: true },
    serviceCost: { type: Number, required: true },
    status: { type: String, enum: ["In Process", "Completed", "Cancelled"], default: "In Process" },
    photo: { type: String },
    serviceType: { type: String },
    issue: { type: String }
  },
  { timestamps: true }
);

// Schema for the entire order
const orderSchema = new mongoose.Schema(
  {
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    products: [productSchema],
    orderIssue: { type: String },
    receivingDate: { type: Date, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    paymentGiven: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Not Paid", "Partially Paid", "Full Paid"], default: "Not Paid" },
    orderStatus: { type: String, enum: ["In Process", "Shipped", "Delivered", "Cancelled"], default: "In Process" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
