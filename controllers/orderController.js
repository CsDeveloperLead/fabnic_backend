import Order from "../models/orders.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createOrder = async (req, res) => {
  try {
    // Check if the necessary fields are present
    const { client, products, receivingDate, expectedDeliveryDate, paymentGiven, paymentStatus, orderStatus } = req.body;

    // Validate fields
    if (!client || !products || !receivingDate || !expectedDeliveryDate || paymentGiven === undefined || paymentStatus === undefined || orderStatus === undefined) {
      return res.status(400).json({ message: "Missing required fields in request body" });
    }

    // Upload product photos to Cloudinary
    const productPhotos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, { folder: "order_photos" });
        productPhotos.push(result.secure_url);
        await fs.unlink(file.path); // Remove local file after uploading
      }
    }

    // Calculate total cost of the order
    const totalCost = products.reduce((total, product) => total + (product.serviceCost || 0), 0);

    // Create a new order
    const newOrder = new Order({
      client,
      products: products.map((product, index) => ({
        ...product,
        photos: productPhotos[index] || product.photos, // Assign uploaded photos to product
      })),
      receivingDate,
      expectedDeliveryDate,
      paymentGiven,
      paymentStatus: paymentGiven >= totalCost ? "Full Paid" : "Partially Paid",
      orderStatus: orderStatus || "In Process",
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: "Order created successfully!", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

export { createOrder };
