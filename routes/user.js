const express = require('express')
const router = express.Router()
const fspromises = require('../helpers/fspromises');

const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'});

const startNewMonth = async (file, email) => {
  const exist = await fspromises.checkFileExists(file);
  if (!exist) {
    const read = await fspromises.readPromise(`./data/${email}/user-template.json`);
    const data = await JSON.parse(read);
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));
  }
}

router.get('/', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date());
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    await startNewMonth(file, email);

    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);
    res.render('user', {
      head_title: data.name,
      page_title: 'Tracking',
      data
    })
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})

router.get('/tracks', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = getDate(new Date(req.body.date));
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);
    res.json(data)
  } catch(error) {
    console.log('error get page:>> ', error);
  }
})


router.post('/start', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = req.body.date;
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;

  try {
    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);

    data.tracking[req.body.date] = []
    const record = {
      "type": "work",
      "time_start": req.body.time,
      "time_end": "En curso"
    }
    data.tracking[req.body.date].push(record)
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));

    res.json(data)
  } catch(error) {
    console.log('error start :>> ', error);
  }
})

router.post('/play', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = req.body.date;
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;

  try {
    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);
    const date = data.tracking[req.body.date];
    
    data.tracking[req.body.date][date.length-1]["time_end"] = req.body.time;
    const record = {
      "type": "work",
      "time_start": req.body.time,
      "time_end": "En curso"
    }
    data.tracking[req.body.date].push(record);
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));

    res.json(data)
  } catch(error) {
    console.log('error play :>> ', error);
  }
})

router.post('/pause', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = req.body.date;
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);
    const date = data.tracking[req.body.date];

    data.tracking[req.body.date][date.length-1]["time_end"] = req.body.time;
    const record = {
      "type": "break",
      "time_start": data.tracking[req.body.date][date.length-1].time_end,
      "time_end": "En curso"
    }
    data.tracking[req.body.date].push(record)
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));

    res.json(data)
  } catch(error) {
    console.log('error pause :>> ', error);
  }
})

router.post('/stop', async (req, res) => {
  const email = req.cookies.userEmail;
  const today = req.body.date;
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
  
  try {
    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);
    const date = data.tracking[req.body.date];

    data.tracking[req.body.date][date.length-1]["time_end"] = req.body.time;
    await fspromises.writePromise(file, JSON.stringify(data, null, 2));

    res.json(data)
  } catch(error) {
    console.log('error stop :>> ', error);
  }
})


module.exports = router;