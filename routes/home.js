const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('main', {
    head_title: 'Home user Tracking',
    page_title: 'Home',
  })
})


module.exports = router