const express = require('express')
const app = express()
require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { Server } = require("socket.io");
const http = require("http");
const path = require('path')
const fs = require('fs')


app.use(express.json())
app.use(cookieParser('anhsecre'))
app.use(cors({}))
app.use(express.static('uploads'))


app.get("/uploads/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    });

    file.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4"
    });
    fs.createReadStream(filePath).pipe(res);
  }
});

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
app.use('/post', googleAuth ,postRouter)
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
    console.log('rooomm joined',roomId)
    socket.join(roomId);
  });

  socket.on('chat', async (msg) => {
    await sendMessage(msg)
    io.to(msg.roomId).emit("chat", msg)
  })

  socket.on('friend-response', async (msg) => {
    console.log(msg)
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

