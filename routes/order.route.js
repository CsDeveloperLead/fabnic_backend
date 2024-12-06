import express from "express";
import { createOrder, deleteAllOrders, getOrders } from "../controllers/order.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

// Create the router
const router = express.Router();

// Create a new order (handle multipart/form-data with files)
router.post("/create", upload.any(), createOrder);

router.get("/get-orders", getOrders);

//just for testing
router.delete("/delete-orders", deleteAllOrders);

export default router;
