const models = require('../../models');

function now(date) {
	const m = date.getMonth()+1;
	const d = date.getDate();
	const h = date.getHours();
	const i = date.getMinutes();
	const s = date.getSeconds();
	return date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d)+' '+(h>9?h:'0'+h)+':'+(i>9?i:'0'+i)+':'+(s>9?s:'0'+s);
}

const NOTFOUND = {
	message: 'Not Found',
	documentation_url: 'http://localhost:8000/request',
}


function getPatients(req, res) {
	console.log('getPatients called.')

	models.Patient.findAll({

	}).then(result => {
		res.json(result);
	})
}

function getPatientWithId(req, res) {
	let id = req.params.id || 0,
		result = {};

	res.json(result);
}


function register (req, res) {

	const kakaoid = req.body.kakaoid.toString().trim() || '';
	const phone = req.body.phone.toString().trim() || '';
	const username = req.body.name.toString().trim() || '';

	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	console.log(2);

	models.Patient.create({
		kakaoid: kakaoid,
		phone: phone,
		username: username
	}).then(patient => res.status(201).json(patient));

};

function medicineTime (req, res) {

	const kakaoid = req.body.kakaoid.toString().trim() || '';
	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	const slot = req.body.slot.toString().trim() || '';
	const time = req.body.medicine_time.toString().trim() || '';


	models.Medicine_time.findOne({
		where: {
			kakaoid: kakaoid,
			slot: slot
		}
	}).then(medicine_time => {
		if (!medicine_time) {
			models.Medicine_time.create({
				kakaoid: kakaoid,
				slot: slot,
				time: time
			}).then(medicine_time => res.status(201).json(medicine_time));
		} else {

			if (!slot.length) return res.status(400).json({error: 'Incorrenct'});
			if (!time.length) return res.status(400).json({error: 'Incorrenct'});

			medicine_time.time = time;
			medicine_time.slot = slot;

			medicine_time.save().then(_ => res.status(201).json(medicine_time));

			const rule = new schedule.RecurrenceRule();
			rule.hour = parseInt(time);
			rule.minute = 0;

			scheduler = req.app.get('scheduler');

			if (scheduler[kakaoid][slot]) scheduler[kakaoid][slot].cancel();

			models.User.findOne({
				where: {
					kakaoid: kakaoid
				}
			}).then(user => {
				scheduler[kakaoid][slot] = schedule.scheduleJob(rule, function(){

					axios.post('https://openapi.bablabs.com/v2/kakao-talks', {
						phone_number:user.phone,
						message:'sdf'
					}, {
						headers: { Authorization: '456789' }
					}).then(response => {
						console.log(response.data.url);
						console.log(response.data.explanation);
					}).catch(error => {
						console.log(error);
					});
				});
			});
		}
	});
};

function kakaoText (req, res) {

	const kakaoid = req.body.kakaoid.toString().trim() || '';
	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	const text = req.body.text.toString().trim() || '';
	const time = req.body.time.toString().trim() || '';

	models.TextDB.create({
		kakaoid: kakaoid,
		text: text,
		time: time
	}).then(patient => res.status(201).json(patient));


};

function medicineCheck (req, res) {

	const kakaoid = req.body.kakaoid.toString().trim() || '';
	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	const med_check = req.body.med_taking.toString().trim() || '';
	const time = req.body.time.toString().trim() || '';

	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	console.log(2);

	models.Medicine_check.create({
		kakaoid: kakaoid,
		med_check: med_check,
		time: time
	}).then(medicine_check => res.status(201).json(medicine_check));



	// models.Medicine_check.create({
	// 	kakaoid: kakaoid,
	// 	med_check: med_check,
	// 	time: time
	// }).then(medicine_check => res.status(201).json(medicine_check));



	// models.Medicine_check.findAndCountAll({
	// 	kakaoid: kakaoid,
	// 	med_check: '1',
	// 	time: {
	// 		[Op.between]: [now(new Date(Date.now() - 30 * 24 * 3600 * 1000)), now(new Date())]
	// 	}
	// }).then(result => {
	//
	// 	Patient.update({
	// 		medicine_mouth: parseInt(result.count*10/3.0),
	// 	}, {
	// 		where: {
	// 			kakaoid: kakaoid,
	// 		}
	// 	});
	//
	// });
	//
	// models.Medicine_check.findAndCountAll({
	// 	kakaoid: kakaoid,
	// 	med_check: '1',
	// 	time: {
	// 		[Op.between]: [now(new Date(Date.now() - 7 * 24 * 3600 * 1000)), now(new Date())]
	// 	}
	// }).then(result => {
	//
	// 	Patient.update({
	// 		medicine_week: parseInt(result.count*100/7.0),
	// 	}, {
	// 		where: {
	// 			kakaoid: kakaoid,
	// 		}
	// 	});
	// });
}

function medicineSide (req, res) {

	const kakaoid = req.body.kakaoid.toString().trim() || '';
	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	const text = req.body.text.toString().trim() || '';
	const time = req.body.time.toString().trim() || '';

	models.Medicine_side.create({
		kakaoid: kakaoid,
		text: text,
		time: time
	}).then(medicine_side => res.status(201).json(medicine_side));

};

function medicineMiss (req, res) {
	const kakaoid = req.body.kakaoid.toString().trim() || '';
	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	const text = req.body.text.toString().trim() || '';
	const time = req.body.time.toString().trim() || '';

	models.Medicine_miss.create({
		kakaoid: kakaoid,
		med_check: text,
		time: time
	}).then(medicine_miss => res.status(201).json(medicine_miss));

};

function moodCheck (req, res) {
	const kakaoid = req.body.kakaoid.toString().trim() || '';
	if (!kakaoid) return res.status(400).json({error: 'Incorrect id'});

	const mood_check = req.body.value.toString().trim() || '';
	const time = req.body.time.toString().trim() || '';
	const type = req.body.type.toString().trim() || '';



	models.Mood_check.create({
		kakaoid: kakaoid,
		mood_check: mood_check,
		type: type,
		time: time
	}).then(mood_check => res.status(201).json(mood_check));


	// if(type=='mood') {
	// 	models.Mood_check.findAndCountAll({
	// 		kakaoid: kakaoid,
	// 		type: type,
	// 		mood_check: [3, -3],
	// 		time: {
	// 			[Op.between]: [now(new Date(Date.now() - 30 * 24 * 3600 * 1000)), now(new Date())]
	// 		}
	// 	}).then(result => {
	//
	// 		Patient.update({
	// 			emergency_mouth: parseInt(result.count*10/3.0),
	// 		}, {
	// 			where: {
	// 				kakaoid: kakaoid,
	// 			}
	// 		});
	// 	});
	//
	// 	models.Mood_check.findAndCountAll({
	// 		kakaoid: kakaoid,
	// 		type: type,
	// 		mood_check: [3, -3],
	// 		time: {
	// 			[Op.between]: [now(new Date(Date.now() - 7 * 24 * 3600 * 1000)), now(new Date())]
	// 		}
	// 	}).then(result => {
	//
	// 		Patient.update({
	// 			emergency_week: parseInt(result.count*100/7.0),
	// 		}, {
	// 			where: {
	// 				kakaoid: kakaoid,
	// 			}
	// 		});
	// 	});
	// }

}

function interviewTime (req, res) {
};

function interviewCheck (req, res) {
};

module.exports = {
	getPatients: getPatients,
	getPatientWithId: getPatientWithId,

	register: register,
	medicineTime: medicineTime,
	medicineCheck: medicineCheck,
	medicineMiss: medicineMiss,
	medicineSide: medicineSide,
	moodCheck: moodCheck,
	kakaoText: kakaoText,
	interviewTime: interviewTime,
	interviewCheck: interviewCheck
};
