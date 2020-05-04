const express = require('express')
const router = express.Router()
const fspromises = require('../helpers/fspromises');

const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});

router.get('/', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date);
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  const filedirectory = `./data/${email}/`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    
    const files = await fspromises.files(filedirectory);
    const dataFiles = JSON.parse(files);
    res.render('stats', {
      head_title: 'Histórico de días',
      page_title: 'Estadísticas',
      data,
      dataFiles
    })
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})

router.post('/date', async (req, res) => {
  const email = req.cookies.userEmail;
  const file = `./data/${email}/${req.body.month}.json`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    res.json(data)
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})


module.exports = router;