var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const db = require('../db');
const config = require('../config');

router.post('/login', function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;
	const login = db.select().from(user).where({'email': email, 'password': password});	
});

router.post('/logout', function(req, res, next) {
	res.render('LogOut user');
});

router.post('/register', async function(req, res, next) {
	const hashedPassword = bcrypt.hashSync(req.body.password, 8);
	const email = req.body.email;
	console.log('Params', email);
	
	const token = await jwt.sign({ id: email }, config.secret, {
       expiresIn: 86400 // expires in 24 hours
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
