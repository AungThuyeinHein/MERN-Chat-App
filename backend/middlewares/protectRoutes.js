import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ status: 401, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.ststus(401).json({
        ststus: 401,
        message: "Unauthorized - You have to login to your account",
      });
    }
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protection", error.message);
    res.status(500).json({ status: 500, message: "Something went wrong" });
  }
};

export default protectRoutes;
