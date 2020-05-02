const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('config', {
    head_title: 'Área de personalización',
    page_title: 'Preferencias',
  })
})


module.exports = router