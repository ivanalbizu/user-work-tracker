const fspromises = require('./fspromises');

const getData = async (req, res) => {
  try {
    const today = req.body.date;
    const email = req.cookies.userEmail;
    const file = `./data/${email}/${today.split('/')[2]}-${today.split('/')[1]}.json`;
    const read = await fspromises.readPromise(file);
    const data = await JSON.parse(read);
    return { data, today, file };
  } catch (error) {
    console.log('Error al obtener los datos de usuario : ', error);
    throw (error)
  }
}

module.exports = {
  getData
}