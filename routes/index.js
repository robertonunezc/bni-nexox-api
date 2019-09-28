var express = require('express');
var router = express.Router();


router.post('/login', function(req, res, next) {
	res.render('Login user');
});

router.post('/logout', function(req, res, next) {
	res.render('LogOut user');
});

module.exports = router;
