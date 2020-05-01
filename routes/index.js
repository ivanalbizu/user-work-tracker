const express = require('express')
const app = express()
const user = require('./user')
const login = require('./login')


app.get('/', (req, res) => {
  res.render('main', {
    head_title: 'User Tracking'
  })
})

app.use('/user', user)
app.use('/login', login)

module.exports = app