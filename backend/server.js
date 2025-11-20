const express = require('express')
const app = express()
require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Server } = require("socket.io");
const http = require("http");



app.use(express.json())
app.use(cookieParser('anhsecre'))
app.use(cors({}))
app.use(express.static('uploads'))


const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
const chatRouter = require('./routes/chatRoutes')
const { error } = require('console')
const googleAuth = require('./middlewear/googleauth')
const { sendMessage } = require('./controllers/chatController')


app.use('/auth', userRouter)
app.use('/post', postRouter)
app.use('/chat', googleAuth, chatRouter)


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
})



io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log('user joined room', roomId, socket.id)
  });

  socket.on('chat', async (msg) => {
    await sendMessage(msg)
    io.to(msg.roomId).emit("chat", msg)
  })

  socket.on('friend-response', async (msg) => {
    io.to(msg?.user?.sender).emit("friend-response", msg?.user)
  })
  
  socket.on('friend-request', async (msg) => {
    io.to(msg.receiver).emit("friend-request", {msg})
  })

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});







server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

