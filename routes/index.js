const express = require('express')
const app = express()

const login = require('./login')
const user = require('./user')
const stats = require('./stats')


app.get('/', (req, res) => {
  res.render('main', {
    head_title: 'User Tracking'
  })
})

app.use('/login', login)
app.use('/user', user)
app.use('/stats', stats)

module.exports = app