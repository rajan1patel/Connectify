import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
   senderId:{
    type:mongoose.Schema.Types.ObjectId, ref:"User", required:true
   },
   receiverId:{
    type:mongoose.Schema.Types.ObjectId, ref:"User", required:true
   },
   text:{
    type: String
   },
   image:{
    type: String,
   
   },
   seen:{
    type: Boolean,
    default: false, // Default value for seen status
   }


  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);


const Message = mongoose.model("Message", messageSchema);
export default Message;
