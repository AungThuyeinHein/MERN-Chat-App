import express from "express";
import protectRoutes from "../middlewares/protectRoutes.js";
import { getUserForSidebar } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protectRoutes, getUserForSidebar);

export default router;
