var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const db = require('../db');
const config = require('../config');

router.post('/login', async function (req, res, next) {
	const email = req.body.email;
	try {
		const user = await db.select('token', 'password').from('user').where('email', email);
		console.log('Login Response', user);
		if (user.length == 0) {
			return res.json({
				code: 199,
				msg: "Login Wrong",
				data: null
			});
		}
		const hashedPassword = bcrypt.compareSync(req.body.password, user[0].password);

		if (!hashedPassword) {
			return res.json({
				code: 199,
				msg: "Login Wrong",
				data: null
			});
		}
		return res.json({
			code: 200,
			msg: "Login OK",
			data: user[0].token
		});
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			code: 500,
			msg: "error accediendo a la BD"
		});
	}
});

router.post('/logout', function (req, res, next) {
	res.render('LogOut user');
});

router.post('/register', async function (req, res, next) {
	const hashedPassword = bcrypt.hashSync(req.body.password, 8);
	const email = req.body.email;
	console.log('Params', email);

	const token = await jwt.sign({ id: email }, config.secret, {
		expiresIn: "86400 days" // expires in 24 hours
	});
	const userData = {
		email: email,
		password: hashedPassword,
		token: token
	}
	const userId = await db('user')
		.insert(userData);
	console.log('User created', userId);
	return res.json({
		code: 200,
		msg: "User created",
		data: token
	});
});


module.exports = router;
