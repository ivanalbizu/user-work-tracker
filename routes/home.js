const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('home', {
    head_title: 'Home user Tracking',
    page_title: 'Home',
  })
})


module.exports = router