// //get all user excpet the logged in user
// import Message from "../models/message.js";
// import User from "../models/User.js";
// import cloudinary from "../lib/cloudinary.js";
// import { io,userSocketMap } from "../server.js";

// export const getUserForSidebar=async (req, res) => {
//     try{
//         const userId = req.user._id; // Get the logged-in user's ID from the request object
//         // Find all users except the logged-in user
//         const filteredUsers=await User.find({ _id: { $ne: userId } }).select("-password");

//         //count number of messages for each user not seen
//         const unseenMessages={};

//         const promises = filteredUsers.map(async (user) => {
//             const messages = await Message.find({
//                senderId: user._id,
//                receiverId: userId,
//                 seen: false})
//             if(messages.length > 0) {
//                 unseenMessages[user._id] = messages.length; // Store the count of unseen messages
//             }

//         })
//         await Promise.all(promises);
//         res.status(200).json({
//             success: true,
//             users: filteredUsers,
//             unseenMessages: unseenMessages // Include the unseen messages count
//         });
//     }
//     catch (error) {
//         console.error("Error fetching users for sidebar:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }

// //get all message for selected user
// export const getMessages = async (req, res) => {
//     const { id:selectedUserId } = req.params; // Get the userId from the request parameters
//     const myId = req.user._id; // Get the logged-in user's ID from the request object

//     try {
//         // Find all messages between the logged-in user and the specified user
//         const messages = await Message.find({
//             $or: [
//                 { senderId: myId, receiverId: selectedUserId }, 
//                 { senderId: selectedUserId, receiverId: myId }
//             ]
//         }).sort({ createdAt: 1 }); // Sort messages by creation time
//         await Message.updateMany(
//             { senderId: selectedUserId, receiverId: myId, seen: false },
//             { $set: { seen: true } } // Mark messages as seen
//         );

//         res.status(200).json({
//             success: true,
//             messages: messages
//         });
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }


// // .api to mark messages as seen
// export const markMessagesAsSeen = async (req, res) => {
//     const { id } = req.params; // Get the userId from the request parameters
//     const myId = req.user._id; // Get the logged-in user's ID from the request object

//     try {
//         // Update messages to mark them as seen
//         await Message.findByIdAndUpdate(
//             id,
//             { seen: true }, // Set seen to true
//             { new: true } // Return the updated message
//         );

//         res.status(200).json({
//             success: true,
//             message: "Messages marked as seen"
//         });
//     } catch (error) {
//         console.error("Error marking messages as seen:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }



// //send message to selected user


// export const sendMessage=async (req,res)=>{

//     try{

//         const{text,image}=req.body;
//         const receiverId=req.params.id;
//         const senderId=req.user._id;

//         let imageUrl;
//         if(image){
//             const uploadResponse=await cloudinary.uploader.upload(image);
//             imageUrl=uploadResponse.secure_url;


//         }
//         const newMessage=await Message.create({
//             senderId,
//             receiverId,
//             text,
//             image:imageUrl
//         })

//         //emit to new meassage to receiver socket
//         const receiverSocketId=userSocketMap[receiverId];
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("newmessage",newMessage)
//         }
        
//         res.json({
//             success:true,
//             newMessage
//         });


//     }catch (error) {
//         console.error("Error marking messages as seen:", error);
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// }



import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// ✅ Get all users except the logged-in user and return unseen message count
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    res.status(200).json({
      success: true,
      users: filteredUsers,
      unseenMessages
    });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get all messages between logged-in user and selected user
export const getMessages = async (req, res) => {
  const { id: selectedUserId } = req.params;
  const myId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages from selected user as seen
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Mark individual message as seen by ID
export const markMessagesAsSeen = async (req, res) => {
  const { id } = req.params;
  const myId = req.user._id;

  try {
    await Message.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as seen"
    });
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Send a new message (text/image), and emit it via socket to receiver
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    // Emit message to the receiver's socket if connected
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newmessage", newMessage);
    }

    res.status(200).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
