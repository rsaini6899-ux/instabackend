const dotenv = require('dotenv')
dotenv.config()
const {app ,server} = require('./socket/socketIo')

//////////////////
// const http = require('http')
// const { Server } = require('socket.io')
// const Notification = require('./model/notification')
/////////////////

const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const express = require('express')
const { urlencoded } = express

// const app = express()

///////////////////////
// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173", // Frontend development server
//         methods: ["GET", "POST"]
//     }
// })

// module.exports.io = io

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Example: Save the userId when a user registers
//   socket.on('register', (userId) => {
//       socket.userId = userId; // Attach userId to the socket object
//       console.log(`User ${userId} registered with socket ID: ${socket.id}`);
//   });

//   socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//   });
// });

// module.exports.sendNotification = async (userId, message) => {
//   // Create and save the notification in the database
//   const notification = new Notification({ userId, message });
//   await notification.save();

//   // Check if the `io` instance is initialized
//   if (!io || !io.sockets) {
//       throw new Error('Socket.io is not initialized');
//   }

//   // Emit the notification to the specific user
//   for (const [id, socket] of io.sockets.sockets) {
//       if (socket.userId === userId.toString()) {
//           io.to(id).emit('newNotification', notification);
//           break;
//       }
//   }

//   return notification; // Return the created notification
// };
///////////////////////

const corsOptions = {
  origin: ['https://lovechatrp.netlify.app']
  credentials: true,              
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

const userRouter = require('./router/user')
const messageRouter = require('./router/message')
const postRouter = require('./router/post')
const notificationRouter = require("./router/notification")
const reportRouter = require('./router/report')

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    // app.listen(process.env.PORT, () => {
    //   console.log('Successfully connected to DB and listening on port 4001!!!')
    // })
    server.listen(4001, () => {
      console.log("Server listening on http://localhost:4001/api/message/")
  });
  })

app.use('/api/user', userRouter)
app.use('/api/message', messageRouter)
app.use('/api/post', postRouter)
// app.use('/api/notification', notificationRouter) 
app.use('/api/report', reportRouter)
