'use strict';

const qs = require('qs');
const jwt = require('jsonwebtoken');
const models = require('../../models');
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;

const verify = (token, secret, callback) => {
	jwt.verify(token, secret, (err, decoded) => {

		if(err) return callback(err);
		return callback(decoded);
	});
}

function verifyToken (req, res, next){

	const cookie = req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'] || cookies.token;
	const secret = req.app.get('jwt_secret');

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
}

function authenticate (req, res) {

	const email = req.body.email;
	const password = req.body.password;
	const secret = req.app.get('jwt_secret');

	console.log('secret: ' + secret)
	console.log('body.email: ' + req.body.email)
	console.log('params.email: ' + req.params.email)
	console.log('body.password: ' + req.body.password)
	if (!email) return res.status(400).json({error: 'Incorrect id'});


	// find the user
	models.Doctor.findOne({
		where: {email: email}
	}).then(doctor => {
		if (!doctor){
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else {
			// if user is found and password is right
			if (doctor.password === password) {

				// create a token with only our given payload
				// we don't want to pass in the entire user since that has the password
				const payload = {
					_id: doctor._id,
					id: doctor.id,
					permissions: userPermission.DEVELOPER,
					email: doctor.email,
					doctor_code: doctor.doctor_code
					// put in object parameters in here.
					// admin: user.admin
				};

				jwt.sign(
					payload,
					secret,
					{
						expiresIn: '7d',
						issuer: 'jellylab.io',
						subject: 'userInfo'
					},
					(err, token) => {
						console.log(token);
						console.log(err);
						if (err) res.status(403).json({
							message: err.message
						});
						res.cookie('token', token);
						res.status(200).json({
							success: true,
							message: 'Ok',
							token: token
						});
					});
			} else {
				res.status(403).json({
					success: true,
					message: 'Password wrong'
				});
			}

			// var token = jwt.sign(payload, req.app.get('jwt-secret'), {
			// 	expiresInMinutes: 1440 // expires in 24 hours
			// });
			//
			// // return the information including token as JSON
			// res.json({
			// 	success: true,
			// 	message: 'Enjoy your token!',
			// 	token: token
			// });
		}
	})
}

function registerDoctor (req, res){
	passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	});
}


// TODO: Create a way to authenticate only Jellylab clients can use this method (perhaps with API Key).
function signup (req, res){
	const username = req.body.username;
	const password = req.body.password;
	const secret = req.app.get('jwt_secret');

	if (!username) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.create({

		// TODO: Fill in code with sequelize.

	}).then(doctor => {
		jwt.sign({
				_id: user._id,
				id: user.id,
				permissions: userPermission.DEVELOPER,
				username: user.username
			},
			secret, {
				expiresIn: '7d',
				issuer: 'jellylab.io',
				subject: 'userInfo'
			}, (err, token) => {
				console.log(token);
				console.log(err);
				if (err) res.status(403).json({
					message: error.message
				});
				res.cookie('token', token);
				res.status(200).json({success: true, message: 'Ok'});
			});
	})

}

function login (req, res) {

	const username = req.body.username;
	const password = req.body.password;

	const secret = req.app.get('jwt_secret');

	if (!username) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.findOne({
		where: {
			username: username
		}
	}).then(user => {
		if (!user) {
			return res.status(403).json({success: true, message: 'No User'});
		}
		if (user.password === password) {
			jwt.sign({
					_id: user._id,
					id: user.id,
					permissions: userPermission.DEVELOPER,
					username: user.username
				},
				secret, {
					expiresIn: '7d',
					issuer: 'jellylab.io',
					subject: 'userInfo'
				}, (err, token) => {
					console.log(token);
					console.log(err);
					if (err) res.status(403).json({
						message: error.message
					});
					res.cookie('token', token);
					res.status(200).json({success: true, message: 'Ok'});
				});
		} else {
			res.status(403).json({
				success: true,
				message: 'Password wrong'
			});
		}
	});
}

function logout (req, res) {
	res.clearCookie('token');
	res.status(200).end();
}

function show (req, res) {
	const id = parseInt(req.params.id, 10);
	if (!id) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.findOne({
		where: {
			id: id
		}
	}).then(user => {
		if (!user) {
			return res.status(404).json({error: 'No User'});
		}
		return res.json(user);
	});
}

function destroy (req, res) {
	const id = parseInt(req.params.id, 10);
	if (!id) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.destroy({
		where: {
			id: id
		}
	}).then(count => {
		if (!count) {
			return res.status(404).send({error: 'No user'});
		}
		res.status(204).send();
	});
}

function create (req, res) {
	const name = req.body.name.toString().trim() || '';
	if (!name.length) {
		return res.status(400).json({error: 'Incorrect name'});
	}

	models.Doctor.create({
		name: name
	}).then(user => res.status(201).json(user));
}

function update (req, res) {
	const id = parseInt(req.params.id, 10);
	if (!id) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.findOne({
		where: {
			id: id
		}
	}).then(user => {
		if (!user) {
			return res.status(404).json({error: 'No user'});
		}

//    if (user.password == req.body.password)
		let name = req.body.name || '';
		name = name.toString().trim();
		if (!name.length) {
			return res.status(400).json({error: 'Incorrect name'});
		}

		user.name = name;
		user.save().then(_ => res.json(user));
	});
}

function addPatient (req, res) {

	const cookie = req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });

	console.log('patientInfo');

	console.log(cookies);

	if (!cookies.token) {
		res.status(200).json({ message: 'Not Login' });
		return;
	}
	console.log(cookies);

	jwt.verify(cookies.token, req.app.get('jwt-secret'), (err, decoded) => {
		if(err) res.status(403).json({
			success: false,
			message: err.message
		});
		console.log(decoded);

		if (decoded.username) {
			models.Patient.findOne({
				where: {
					doctor_code: null
				}
			}).then(patient => {
				console.log(patient);

				patient.doctor_code = decoded.id;
				patient.save().then(_ => res.status(200).json(patient));
			});
		}
	});
}

function patientInfo (req, res) {

	const patientId = req.params.id;
	const cookie = req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
	const secret = req.app.get('jwt_secret');

	console.log('patientId: ' + patientId);
	console.log('cookie: ' + cookie);
	console.log('cookies.token: ' + cookies.token);

	if (!cookies.token) {
		res.status(200).json({ message: 'Not Login - no cookie token' });
		return;
	}

	jwt.verify(cookies.token, secret, (err, decoded) => {
		if(err) res.status(403).json({
			success: false,
			message: err.message
		});

		if (decoded.email) {
			console.log(decoded.email);

			models.Patient.findOne({
				where: {
					kakaoid: patientId
				}
			}).then(patient => {

				console.log(patient.doctor_code);
				console.log(decoded.id);

				patient.medicine_side='';
				console.log('start');

				const p1 = new Promise(function(resolve, reject) {
					models.Medicine_side.findOne({
						where: {
							kakaoid: patient.kakaoid
						},
						order: [
							// Will escape username and validate DESC against a list of valid direction parameters
							['time', 'DESC']
						]
					}).then(side => {
						console.log('11');
						if(side) patient.medicine_side = side.text;
						resolve();

					});
				});
				const p2 = new Promise(function(resolve, reject) {
					models.Medicine_miss.findOne({
						where: {
							kakaoid: patient.kakaoid
						}
					}).then(miss => {
						console.log('22');
						if(miss) patient.medicine_miss = miss.text;
						resolve();
					});
				});
				const p3 = new Promise(function(resolve, reject) {
					models.Mood_check.findAll({
						where: {
							kakaoid: patient.kakaoid
						}
					}).then(mood => {
						console.log('33');
						if(mood) patient.mood_check = mood;
						resolve();
					});
				});
				const p4 = new Promise(function(resolve, reject) {
					models.Medicine_check.findAll({
						where: {
							kakaoid: patient.kakaoid
						}
					}).then(check => {
						console.log('44');
						if(check) patient.medicine_check = check;
						resolve();
					});
				});

				Promise.all([p1, p2, p3, p4]).then(function(value) {
					if(patient.doctor_code !== decoded.doctor_code.toString()) {
						res.status(403).json({ message: 'Permission Error' });
						return;
					}

					var patientinfo = {
						id: patient.id,
						username: patient.username,
						doctor_code: patient.doctor_code,
						kakaoid: patient.kakaoid,
						phone: patient.phone,
						medicine_week: patient.medicine_week,
						medicine_mouth: patient.medicine_mouth,
						emergency_mouth: patient.emergency_mouth,
						emergency_week: patient.emergency_week,
						medicine_side: patient.medicine_side,
						medicine_miss: patient.medicine_miss,
						mood_check: patient.mood_check,
						medicine_check: patient.medicine_check,
						next_time: patient.next_time,
					}

					/*
					var patientinfo = {
						id: patient.id,
						username: patient.username,
						fullname: patient.fullname,
						patient_email:patient.patient_email,
						patient_password:patient.patient_password,
						kakaoid: patient.kakaoid,
						doctor_code: patient.doctor_code,
						registered: patient.registered,
						phone: patient.phone,
						sex: patient.sex,
						birthday: patient.birthday,
						createdAt: patient.createdAt,
						updatedAt: patient.updatedAt
					}
					 */

					console.log(patientinfo);
					res.status(200).json(patientinfo);
				}, function(reason) {
					res.status(500).json({ message: 'Server Error' });
				});
			});
		} else {
			res.status(200).json({ message: 'Not Login' });
		}
	} );
}

function user (req, res) {
	const cookie = req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
	const response = {};
	const user = {};

	if (!cookies.token) {
		res.status(200).json({ message: 'Not Login' });
		return;
	}

	jwt.verify(cookies.token, req.app.get('jwt-secret'), (err, decoded) => {
		if(err) res.status(403).json({
			success: false,
			message: err.message
		});

		if (decoded.username) {
			user.permissions = decoded.permissions;
			user.username = decoded.username;
			user.id = decoded.id;
		}
	});

	response.user = user;
	res.json(response);
}

const EnumRoleType = {
	ADMIN: 'admin',
	DEFAULT: 'guest',
	DEVELOPER: 'developer',
}

const userPermission = {
	DEFAULT: {
		visit: ['dashboard', 'patients', 'add patient'],
		role: EnumRoleType.DEFAULT,
	},
	ADMIN: {
		role: EnumRoleType.ADMIN,
	},
	DEVELOPER: {
		role: EnumRoleType.DEVELOPER,
	},
}

function dashboard (req, res) {

	return verify(req.cookies.token, req.app.get('jwt-secret'), (doctor) => {
		if (!doctor || !doctor.id) return res.status(403).json({error: 'Incorrect id'});

		let find = {};
		if (doctor.id !=='0') {
			find = {doctor_code: doctor.id};
		}

		models.Patient.findAll({
			where: find
		}).then(patients => {

			if (!patients.length) {
				return res.status(200).json({error: 'No user'});
			}

			dashboard = [];

			patients.forEach(function (patient) {
				dashboard.push({
					id: patient.id,
					username: patient.username,
					doctor_code: patient.doctor_code,
					kakaoid: patient.kakaoid,
					phone: patient.phone,
					medicine_week: patient.medicine_week,
					medicine_mouth: patient.medicine_mouth,
					emergency_mouth: patient.emergency_mouth,
					emergency_week: patient.emergency_week,
					next_time: patient.next_time,
				});
			});
			console.log(dashboard);
			return res.status(200).json({patients: dashboard});
		});
	});

}

function menus (req, res) {

	return verify(req.cookies.token, req.app.get('jwt-secret'),(doctor) => {
		if (!doctor || !doctor.id) return res.status(403).json({error: 'Incorrect id'});

		let find = {};
		if (doctor.id !=='0') {
			find = {doctor_code: doctor.id};
		}

		models.Patient.findAll({
			where: find
		}).then(patients => {

			let menu = [
				{
					id: 'dashboard',
					icon: 'laptop',
					name: 'Dashboard',
					route: '/dashboard',
				},
				{
					id: 'patients',
					icon: 'user',
					name: 'Patients',
				},
				{
					id: 'add patient',
					mpid: 'patients',
					bpid: 'patients',
					icon: 'plus',
					name: 'Add Patients',
					onclick: '/user/addpatients',
				}
			];

			patients.forEach(patient => {
				menu.push({
					id: patient.id,
					mpid: 'patients',
					bpid: 'patients',
					icon: 'user',
					name: patient.username,
					route: '/patient/'.concat(patient.id),
				});
			});
			return res.status(201).json(menu);
		});
	});
}

function getDoctors(req, res) {
	console.log('getDoctors called.')
	models.Doctor.findAll({

	}).then(result => {
		res.json(result);
	})
	res.json();
}

function getUserWithId(req, res) {
	let id = req.params.id || 0,
		result = {};
	res.json(result);
}

module.exports = {
	verifyToken: verifyToken,
	authenticate: authenticate,
	registerDoctor: registerDoctor,
	login: login,
	logout: logout,
	show: show,
	destroy: destroy,
	create: create,
	update: update,
	addPatient: addPatient,
	user: user,
	dashboard: dashboard,
	menus: menus,
	getDoctors: getDoctors,
	getUserWithId: getUserWithId,
	patientInfo: patientInfo,
};
