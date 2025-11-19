const express = require('express')
const app = express()
require('./db')
const cors = require('cors')
const cookieParser = require('cookie-parser')


app.use(express.json())
app.use(cookieParser('anhsecre'))
app.use(cors({credentials: true}))

const port = 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')


app.use('/auth', userRouter)
app.use('/post', postRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

