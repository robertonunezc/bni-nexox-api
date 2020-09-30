const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const upload = multer({ dest: './public/tmp/' });
const fs = require('fs');
const middlewares = require('../middlewares/auth');
const userMiddlewares = require('../middlewares/users');
/* GET users listing. */
router.get('/', middlewares.validJWTNeeded, async function (req, res, next) {
	const ownerUser = await userMiddlewares.getOwnerUser(req.headers['authorization']);
	const members = await db.select().from('members').where('ownerUser', ownerUser);
	return res.json({
		code: 200,
		msg: "All members",
		data: members
	});
});

router.get('/get/:id', middlewares.validJWTNeeded, middlewares.validJWTNeeded, async function (req, res, next) {
	const memberId = req.params.id;
	try {
		const member = await db.select().from('members').where('id', memberId);
		return res.json({
			code: 200,
			msg: "Member",
			data: member
		});
	} catch (e) {
		// statements
		console.log('Error loading member', e);
		return res.json({
			code: 199,
			msg: "Error loading member"
		});
	}
});

router.post('/edit/:id', middlewares.validJWTNeeded, middlewares.validJWTNeeded, function (req, res, next) {
	res.send('edit specific member by id');
});

router.post('/add', middlewares.validJWTNeeded, [upload.single('file'), middlewares.validJWTNeeded], async function (req, res, next) {
	const memberData = {
		owner: req.body.owner,
		company: req.body.company,
		phone: req.body.phone,
		email: req.body.email,
		digitalCard: req.body.digitalCardName,
		ownerUser: req.body.ownerUser
	}
	try {
		//saveFile(req);

	} catch (error) {
		console.log('Error saving file', error)
	}

	console.log('Member Data')
	try {
		const memberId = await db('members').insert(memberData);
		memberData.id = memberId;
		return res.status(200).json({
			code: 200,
			msg: "Member created",
			data: memberData
		});
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			code: 199,
			msg: error
		});
	}

});

router.get('/delete/:id', middlewares.validJWTNeeded, middlewares.validJWTNeeded, async function (req, res, next) {
	const memberId = req.params.id;
	try {
		await db('members').where('id', memberId).del();
		const members = await db.select().from('members');

		return res.json({
			code: 200,
			msg: "Member Deleted",
			data: members
		});
	} catch (e) {
		// statements
		console.log('Error deleting member', e);
		return res.json({
			code: 199,
			msg: "Error deleting member"
		});
	}
});

async function saveFile(req) {
	var tmp_path = req.file.path;
	var target_path = './public/images/tarjetas/' + req.file.originalname;
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
}

module.exports = router;
