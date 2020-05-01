const jwt = require('jsonwebtoken');

const jwtKey = process.env.JWT_SECRET || '8frs**t$b3r$8)-@+psi*56sdi46=wl(ec)(u$&tjy#io!62z2';

const checkToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) return res.redirect('/login');

  try {
    jwt.verify(token, jwtKey)
  } catch (error) {
    return res.redirect('/login');
  }

  next();
}

module.exports = {
  checkToken
}