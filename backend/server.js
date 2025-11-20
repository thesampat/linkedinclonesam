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

const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
const chatRouter = require('./routes/chatRoutes')
const { error } = require('console')
const googleAuth= require('./middlewear/googleauth')


app.use('/auth', userRouter)
app.use('/post', googleAuth ,postRouter)
app.use('/chat', chatRouter)


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL
    methods: ["GET", "POST"],
  },
})


io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

