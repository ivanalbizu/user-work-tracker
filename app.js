const express = require('express')
const path = require('path')
const app = express()
const port = 8080 || process.env.PORT
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { checkToken } = require('./helpers/auth')

let unless = function(middleware, ...paths) {
    return function(req, res, next) {
        const pathCheck = paths.some(path => path === req.path)
        pathCheck ? next() : middleware(req, res, next)
    }
}

app.use(morgan('tiny'))
app.use(cookieParser())
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname + '/public')))

app.use(unless(checkToken, "/login"))

app.use(require('./routes/index'))

app.listen(port, () => console.log("Listening .."))