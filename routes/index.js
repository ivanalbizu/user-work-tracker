const express = require('express')
const app = express()

const home = require('./home')
const login = require('./login')
const user = require('./user')
const stats = require('./stats')

app.use('/', home)
app.use('/login', login)
app.use('/user', user)
app.use('/stats', stats)

module.exports = app