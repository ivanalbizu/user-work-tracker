const express = require('express')
const router = express.Router()
const fspromises = require('../helpers/fspromises')
const request = require('../helpers/request')

const getDate = today => today.toLocaleDateString([], {day: '2-digit', month: '2-digit', year: 'numeric'})

const startNewMonth = async (file, email) => {
  const exist = await fspromises.checkFileExists(file)
  if (!exist) {
    const read = await fspromises.readPromise(`./data/${email}/user-template.json`)
    const data = await JSON.parse(read)
    await fspromises.writePromise(file, JSON.stringify(data, null, 2))
  }
}

router.get('/', async (req, res) => {
  const email = req.cookies.userEmail
  const today = getDate(new Date())
  const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`
  
  try {
    await startNewMonth(file, email)

    const read = await fspromises.readPromise(file)
    const data = await JSON.parse(read)
    res.render('user', {
      head_title: data.name,
      page_title: 'Tracking',
      data
    })
  } catch(error) {
    console.log('error get page:>> ', error)
  }
})

router.get('/tracks', async (req, res) => {
  try {
    const { data } = await request.getData(req, res)

    res.json(data)
  } catch(error) {
    console.log('error get page:>> ', error)
  }
})


router.post('/start', async (req, res) => {
  try {
    const { data, today, file } = await request.getData(req, res);

    data.tracking[today] = []
    const record = {
      "type": "work",
      "time_start": req.body.time,
      "time_end": "En curso"
    }
    data.tracking[today].push(record)
    await fspromises.writePromise(file, JSON.stringify(data, null, 2))

    res.json(data)
  } catch(error) {
    console.log('error start :>> ', error)
  }
})

router.post('/play', async (req, res) => {
  try {
    const { data, today, file } = await request.getData(req, res)
    const date = data.tracking[today]
    
    data.tracking[today][date.length-1]["time_end"] = req.body.time
    const record = {
      "type": "work",
      "time_start": req.body.time,
      "time_end": "En curso"
    }
    data.tracking[today].push(record);
    await fspromises.writePromise(file, JSON.stringify(data, null, 2))

    res.json(data)
  } catch(error) {
    console.log('error play :>> ', error)
  }
})

router.post('/pause', async (req, res) => {
  try {
    const { data, today, file } = await request.getData(req, res)
    const date = data.tracking[today]

    data.tracking[today][date.length-1]["time_end"] = req.body.time
    const record = {
      "type": "break",
      "time_start": data.tracking[today][date.length-1].time_end,
      "time_end": "En curso"
    }
    data.tracking[today].push(record)
    await fspromises.writePromise(file, JSON.stringify(data, null, 2))

    res.json(data)
  } catch(error) {
    console.log('error pause :>> ', error)
  }
})

router.post('/stop', async (req, res) => {
  try {
    const { data, today, file } = await request.getData(req, res)
    const date = data.tracking[today]

    data.tracking[today][date.length-1]["time_end"] = req.body.time
    await fspromises.writePromise(file, JSON.stringify(data, null, 2))

    res.json(data)
  } catch(error) {
    console.log('error stop :>> ', error)
  }
})

router.post('/close', async (req, res) => {
  try {
    const { data, today, file } = await request.getData(req, res)
    const date = data.tracking[today]

    if (data.tracking[today][date.length-1]["time_end"] == 'En curso') {
      data.tracking[today][date.length-1]["time_end"] = req.body.time
      await fspromises.writePromise(file, JSON.stringify(data, null, 2))
    }

    res.json(data)
  } catch(error) {
    console.log('error stop :>> ', error)
  }
})


module.exports = router;