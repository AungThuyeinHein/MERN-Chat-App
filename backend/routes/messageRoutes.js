import express from "express";
import protectRoutes from "../middlewares/protectRoutes.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:id", protectRoutes, getMessages);
router.post("/send/:id", protectRoutes, sendMessage);

export default router;
