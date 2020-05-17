const express = require('express')
const path = require('path')
const app = express()
const port = 8080 || process.env.PORT
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { checkToken } = require('./helpers/auth')
const ioServer = require('socket.io')


//app.use(morgan('tiny'))
app.use(cookieParser())
app.use(bodyParser.json({
  limit: '10mb',
  extended: true
}))
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
}))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname + '/public')))

const server = app.listen(port, () => console.log("Listening .."))

const io = new ioServer(server)

const getCookie = (req, name) => {
  var match = req.headers.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  if (match) return match[2]
}

// This required 'io' instant and 'getCookie' method
const unless = (middleware, ...paths) => {
  return (req, res, next) => {
    const pathCheck = paths.some(path => path === req.path)
    io.engine.generateId = () => getCookie(req, 'userEmail')
    pathCheck ? next() : middleware(req, res, next)
  }
}
// This required 'unless' middleware 
app.use(unless(checkToken, "/login"))
app.use(require('./routes/index'))

let clients = []

io.on('connection', socket => {
  // Add user connected from array
  clients.push(socket.id)
  console.log('clients on connection :>> ', clients)

  socket.on('disconnect', () => {
    // Delete user connected from array
    clients.splice(clients.indexOf(socket.id), 1)
    // Check if exist user after 5s by Navigation over other pages
    setTimeout(function () {
      if (clients.includes(socket.id)) {
        console.log('PRESENTEEE >>', socket.id)
      } else {
        console.log('se fue el chiquilllo!!! >>', socket.id)
      }
      console.log('clients Disconnected after 5 secs :>> ', clients)
    }, 5000)
  })
  
  socket.on('error', error => {
    console.log("Socket.IO Error")
    console.log(error.stack)
  })
})