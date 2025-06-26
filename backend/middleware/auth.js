// import jwt, { decode } from "jsonwebtoken";
// import dotenv from "dotenv";
// import User from "../models/User.js"; // Adjust the import path as necessary
// dotenv.config();

// //middleware to authenticate user
// export const authMiddleware =async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user=await User.findById(decoded.userId).select("-password") // Attach user info to request object

//     if(!user){
//         return res.status(404).json({ message: "User not found" });
//     }

//     req.user = user; // Attach user info to request object

//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// Middleware to authenticate user
export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and exclude password
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
// Middleware to check if user is authenticated