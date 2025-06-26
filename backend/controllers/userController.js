// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import cloudinary from "../lib/cloudinary.js";
// import { generateToken } from "../lib/utlis.js";
// dotenv.config();

// // Register a new user
// export const registerUser = async (req, res) => {
//   const { fullName, email, password, bio } = req.body;

//   try {
//     if (!fullName || !email || !password) {
//       return res.status(400).json({ message: "Please fill all the fields" });
//     }
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Create a new user
//     const newUser = await new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       bio: bio || "", // Default to empty string if bio is not provided
//     });
//     // Save the user to the database
//     await newUser.save();
//     // Generate a JWT token
//     const token = generateToken(newUser._id);
//     // Respond with the user data and token
//     return res.status(201).json({
//       _id: newUser._id,
//       fullName: newUser.fullName,
//       email: newUser.email,
//       profilePicture: newUser.profilePicture,
//       bio: newUser.bio,
//       token, // Include the token in the response
//     });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// // Login a user
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }
//     // Check if password is correct
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }
//     // Generate a JWT token
//     const token = generateToken(user._id);
//     // Respond with the user data and token
//     return res.status(200).json({
//       _id: user._id,
//       fullName: user.fullName,
//       email: user.email,
//       profilePicture: user.profilePicture,
//       bio: user.bio,
//       token, // Include the token in the response
//     });
//   } catch (error) {
//     console.error("Error logging in user:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// //controller to get user is authenthicated

// export const checkAuth = (req, res) => {
//   res.json({
//     success: true,
//     user: req.user,
//   });
// };


// //controller  to updatr user profile details

// export const updateUserProfile = async (req, res) => {
//   const { fullName, profilePic, bio } = req.body;
//   const userId = req.user._id;

//   try {
//     // Find the user by ID and update their profile
// let updatedUser;

//     if(!profilePic){
//        updatedUser=await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
//     }
//     else{
//       // If profilePic is provided, update the user's profile picture

//       const upload = await cloudinary.uploader.upload(profilePic);

//        updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { fullName, profilePic:upload.secure_url, bio },
//         { new: true } // Return the updated user
//       );
//     }
    

    

//     // Respond with the updated user data
//     return res.status(200).json({
//       _id: updatedUser._id,
//       fullName: updatedUser.fullName,
//       email: updatedUser.email,
     
//       bio: updatedUser.bio,
//     });
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }





import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utlis.js";
dotenv.config();

// Register a new user
export const registerUser = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      bio: bio || "",
    });

    await newUser.save();

    // Generate a JWT token
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      userData: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userData: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Check user authentication
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// Update user profile






export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bio, profilePic } = req.body;

    let updatedData = { fullName, bio };

    if (profilePic) {
      // Upload image base64 string to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pictures", // optional folder in your Cloudinary account
      });
      updatedData.profilePic = uploadResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// export const updateUserProfile = async (req, res) => {
//   const { fullName, bio, profilePic  } = req.body;
//   const userId = req.user._id;

//   try {
//     let updatedUser;

//     if (!profilePic) {
//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { fullName, bio },
//         { new: true }
//       );
//     } else {
//       const upload = await cloudinary.uploader.upload(profilePic);

//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { fullName, bio ,profilePic: upload.secure_url},
//         { new: true }
//       );
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: {
//         _id: updatedUser._id,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         profilePic:updatedUser.profilePic,
//         bio: updatedUser.bio,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updateUserProfile = async (req, res) => {
//   const { fullName, profilePic, bio } = req.body;
//   const userId = req.user._id;

//   try {
//     let updatedData = { fullName, bio };

//     if (profilePic) {
//       const upload = await cloudinary.uploader.upload(profilePic, {
//         folder: "profile_pictures", // optional: organize uploads
//         transformation: [{ width: 300, height: 300, crop: "thumb", gravity: "face" }]
//       });
//       updatedData.profilePicture = upload.secure_url;
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
//       new: true,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       user: {
//         _id: updatedUser._id,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         profilePicture: updatedUser.profilePicture,
//         bio: updatedUser.bio,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };



