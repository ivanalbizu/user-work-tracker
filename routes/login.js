require('./../config/database')
const express = require('express')
const router = express.Router()
const User = require('./../models/userModel')
const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_SECRET || '8frs**t$b3r$8)-@+psi*56sdi46=wl(ec)(u$&tjy#io!62z2'
const jwtExpirySeconds = 24 * 60 * 60 //86400 seconds (1 dia)

const view = (req, res) => {
	res.render('login', {
		head_title: 'Login APP',
	})
}

const login = async (req, res) => {
	const { user, pass } = req.body

	try {
		const userDB = await User.findOne({ name: user })
		if(!userDB) {
			res.cookie('token', {expires: Date.now()})
			return res.render('login', { 
				head_title: 'Usuario incorrecto',
				success: false,
				error: 'Usuario incorrecto'
			})
		} 

		const match = await bcrypt.compare(pass, userDB.pass)
		if(!match) {
			return res.render('login', { 
				head_title: 'Contraseña incorrecta',
				success: false,
				error: 'Contraseña incorrecta'
			})
		}

		const tokenOptions = {
			algorithm: 'HS256',
			expiresIn: jwtExpirySeconds
		}
		const cookieOptions = {
			expiresIn: jwtExpirySeconds,
			httpOnly: true
		}
		if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

		const token = jwt.sign({ user }, jwtKey, tokenOptions)

		res.cookie('token', token, cookieOptions)
		res.cookie('userEmail', user, cookieOptions)

		res.redirect('/')

	} catch (error) {
		res.json({'error': error})
	}
}


router.get('/', view)
router.post('/', login)

module.exports = router