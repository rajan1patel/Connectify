
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './lib/db.js';
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';



const app = express();
//for scoket.io we use http module
const server=http.createServer(app);

//initalize socket.io.server
export const io=new Server(server,{
  cors:{origin:"*"}
})

//store online user
export const userSocketMap={};  //{user id:socketid}



io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;

    // Notify all clients about updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);

    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
    }

    // Notify all clients again
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});



//middlewares
app.use(cors());    
app.use(express.json({ limit: '4mb' }));

// app.use(express.urlencoded({ extended: true }));


//checkeing server is running
app.use('/api/statues', (req, res) => {
  res.send('Statues API is working!');
});

app.use('/api/auth', userRouter);
app.use("/api/messages",messageRouter)

await connectDB();

if(process.env.NODE_ENV!=='production'){
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}

export default server;

