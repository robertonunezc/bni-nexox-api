const express = require('express');
const router = express.Router();
const db = require('../db');
const multer  = require('multer');
const upload = multer({ dest: './public/tmp/'});
const fs = require('fs');

/* GET users listing. */
router.get('/', async function(req, res, next) {
	const members = await db.select().from('members');
	return res.json({
		code: 200,
		msg: "All members",
		data:members
	});
});

router.get('/get/:id', async function(req, res, next) {
	const memberId = req.params.id;
	try {
		const member = await db.select().from('members').where('id', memberId);		
		return res.json({
			code: 200,
			msg: "Member",
			data:member
		});
	} catch(e) {
		// statements
		console.log('Error loading member', e);
		return res.json({
			code: 199,
			msg: "Error loading member"			
		});
	}	
});

router.post('/edit/:id', function(req, res, next) {
	res.send('edit specific member by id');
});

router.post('/add',upload.single('file'), async function(req, res, next) {
	const memberData = {
		owner: req.body.owner,
		company: req.body.company,
		phone: req.body.phone,
		email: req.body.email,
		digitalCard: req.body.digitalCardName,
	}
	
	await saveFile(req);

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

router.post('/delete/:id', function(req, res, next) {
	res.send('delete specific member by id');
});

async function saveFile(req){
	var tmp_path = req.file.path;
	var target_path = './public/images/tarjetas/' + req.file.originalname;
	var src = fs.createReadStream(tmp_path);
	var dest = fs.createWriteStream(target_path);
	src.pipe(dest);
}
module.exports = router;
