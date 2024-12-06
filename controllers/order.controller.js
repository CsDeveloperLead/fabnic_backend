import Order from "../models/orders.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const createOrder = async (req, res) => {
  try {
    // Check if the necessary fields are present
    const client = JSON.parse(req.body.client); // parse the client object from the request body
    const products = JSON.parse(req.body.products); // parse the products array from the request body
    const { orderIssue, receivingDate, expectedDeliveryDate, paymentGiven, paymentStatus, orderStatus } = req.body;

    // Validate fields
    if (!client || !products || !receivingDate || !expectedDeliveryDate || paymentGiven === undefined || paymentStatus === undefined || orderStatus === undefined) {
      return res.status(400).json({ message: "Missing required fields in request body" });
    }

    // Upload product photos to Cloudinary
    const productPhotos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUpload = await uploadOnCloudinary(file.path)
        productPhotos.push(imageUpload.secure_url);
      }
    }

    // Calculate total cost of the order
    const totalCost = products.reduce((total, product) => total + (product.serviceCost || 0), 0);

    // Create a new order
    const newOrder = new Order({
      client,
      products: products.map((product, index) => ({
        ...product,
        photo: productPhotos[index] || product.photos, // Assign uploaded photos to product
      })),
      receivingDate,
      expectedDeliveryDate,
      paymentGiven,
      paymentStatus: paymentGiven >= totalCost ? "Full Paid" : "Partially Paid",
      orderStatus: orderStatus || "In Process",
      orderIssue
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: "Order created successfully!", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().populate('client').populate('products');

  if (!orders) {
    return res.status(404).json({ message: "No orders found" });
  }

  return res
    .status(200)
    .json(orders);

}

//just for testing
export const deleteAllOrders = async (req, res) => {
  const orders = await Order.deleteMany();

  return res.status(200).json({ message: "All orders deleted successfully" });

}
