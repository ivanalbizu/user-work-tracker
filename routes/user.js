const express = require('express')
const router = express.Router()
const fspromises = require('../helpers/fspromises');

const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});

const startNewMonth = async (file, email) => {
  const exist = await fspromises.checkFileExists(file);
  if (!exist) {
    const read = await fspromises.readPromise(`./data/${email}/user-template.json`);
    const data = JSON.parse(read);
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));
  }
}

router.get('/', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date);
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    await startNewMonth(file, email);

    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    res.render('user', {
      head_title: data.name,
      page_title: 'Tracking',
      data
    })
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})

router.get('/dom', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date);
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    res.json(data)
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})


router.post('/start', async (req, res) => {
  const email = req.cookies.userEmail;
  const file = `./data/${email}/${(req.body.date).split('/')[2]}-${(req.body.date).split('/')[1]}.json`;

  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);

    data.tracking[req.body.date] = [];
    data.tracking[req.body.date].push({
      "type": "work",
      "time_start": req.body.time
    })
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));

    res.json(req.body)
  } catch(error) {
    console.log('error start :>> ', error);
  }
})

router.post('/play', async (req, res) => {
  const email = req.cookies.userEmail;
  const file = `./data/${email}/${(req.body.date).split('/')[2]}-${(req.body.date).split('/')[1]}.json`;

  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    const date = data?.tracking[req.body.date];
    
    data.tracking[req.body.date].push({
      "type": data?.tracking[req.body.date][date.length-1]?.type == 'work' ? 'break' : 'work',
      "time_start": data?.tracking[req.body.date][date.length-1]?.time_end
    })
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));

    res.json(req.body)
  } catch(error) {
    console.log('error play :>> ', error);
  }
})

router.post('/pause', async (req, res) => {
  const email = req.cookies.userEmail;
  const file = `./data/${email}/${(req.body.date).split('/')[2]}-${(req.body.date).split('/')[1]}.json`;

  try {
    const read = await fspromises.readPromise(file);
    const data = JSON.parse(read);
    const date = data?.tracking[req.body.date];

    data.tracking[req.body.date][date.length-1]["time_end"] = req.body.time;
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));
  
    res.json(data)
  } catch(error) {
    console.log('error pause :>> ', error);
  }
})


module.exports = router;