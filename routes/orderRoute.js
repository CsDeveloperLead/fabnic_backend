import express from "express";
import multer from "multer";
import { createOrder } from "../controllers/orderController.js";

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder where the files should be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename with timestamp
  },
});

const upload = multer({ storage });

// Create the router
const router = express.Router();

// Create a new order (handle multipart/form-data with files)
router.post("/create", upload.array("productPhotos[]"), createOrder);

export default router;
