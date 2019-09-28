var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/', async function(req, res, next) {
	const members = await db.select().from('members');
	res.json(members);
});

router.get('/get/:id', function(req, res, next) {
	res.send('get specific member by id');
});

router.post('/edit/:id', function(req, res, next) {
	res.send('edit specific member by id');
});

router.post('/delete/:id', function(req, res, next) {
	res.send('delete specific member by id');
});


module.exports = router;
