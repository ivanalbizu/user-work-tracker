const express = require('express')
const app = express()
const router = express.Router()
const path = require('path')

const user = require('./user')


app.get('/', (req, res) => {
  res.render('main', {
    head_title: 'User Tracking'
  })
})

app.use('/user', user)


module.exports = app