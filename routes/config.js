const express = require('express')
const router = express.Router()
const fspromises = require('../helpers/fspromises');

const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});

router.get('/', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date);
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    res.render('config', {
      head_title: 'Área de personalización',
      page_title: 'Preferencias',
      data
    })
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})


router.post('/', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date);
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;

  try {
    console.log('req.body :>> ', req.body);
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    data.config.journal = req.body;

    await fspromises.writePromise(file, JSON.stringify(data, null, 2));
    res.json(data)
  } catch(error) {
    console.log('error save journal week :>> ', error);
  }
})

module.exports = router