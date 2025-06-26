import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length
    },
    profilePic: {
      type: String,
      default: "", // Default profile picture URL
    },
    bio: {
      type: String,
      // Default bio
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);


const User = mongoose.model("User", userSchema);
export default User;
