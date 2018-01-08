/**
 * Doctor API authentication part
 *
 * @date 2018-01-04
 * @author 김지원
 * @updated N/A
 *
 * Refer to https://www.npmjs.com/package/jsonwebtoken for jwt.
 */

'use strict';

const qs = require('qs');
const jwt = require('jsonwebtoken');
const models = require('../../models');

// Constants
const EnumRoleType = {
	ADMIN: 'admin',
	DEFAULT: 'guest',
	DEVELOPER: 'developer',
	DOCTOR: 'doctor'
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
	DOCTOR: {
		role: EnumRoleType.DOCTOR,
	},
}

function verifyToken (req, res, next){

	const cookie = req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
	// check header or url parameters or post parameters for token
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || cookies.token;
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
		// return an error if there is no token
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
}

function checkTokenVerified (req, res, next){
	// If this function can be reached, it means that the token has already been verified.
	// Thus, return success.
	return res.status(200).send({
		success: true
	})
}

// authenticate is not being used for now, but may be used for later.
function authenticate (req, res) {

	const email = req.body.email;
	const password = req.body.password;
	const secret = req.app.get('jwt_secret');

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
		}
	})
}

function doctorEmailDuplicateCheck (req, res){
	const email = req.body.email || '';
	if (!email.length) {
		return res.status(400).json({exists: null, message: 'Email not provided.'});
	}
	models.Doctor.findOne({
		where: {
			email: email
		}
	}).then(doctor => {
		console.log('email: ' + email)
		console.log('doctor.email: ' + doctor.email)
		if (doctor) {
			console.log("Email already exists: ")
			res.status(200).json({exists: true, message: 'Email already exists.'})
		} else {
			res.status(200).json({exists: false, message: 'Email is unique. Good to proceed.'})
		}
	}).catch(function (err){
		console.log('ERROR while checking duplicate email')
		res.status(500).json({exists: null, message: 'Internal server error. err: ' + err.message})
	})
}

function registerDoctor (req, res){

	console.log('registerDoctor Called');
	console.log('JSON.stringify(req.body): ' + JSON.stringify(req.body))

	const email = req.body.email || '';
	const password = req.body.password;
	const hospital = req.body.hospital
	const name = req.body.name
	const secret = req.app.get('jwt_secret');



	if (!email.length) {
		// return res.status(400).json({message: 'email.length: ' + email.length + ', email: ' + email + ', password: NOT ALLOWED' +  + ', hospital: ' + hospital + ', name: ' + name})
		return res.status(400).json({success: false, error: 'Email not given'});
	}

	// Validate Email Regex
	let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(email)){
		return res.status(400).json({success: false, error: 'Incorrect email'})
	}


	// Generate doctor_code
	let doctor_code = Math.floor(Math.random() * 999999) + 1
	console.log('doctor_code: ' + doctor_code)

	const p1 = new Promise(function(resolve, reject) {

		// create function for recursive call to avoid asynchronous problems
		function generateUniqueDoctorCode(doctor_code){
			models.Doctor.findOne({
				where: {
					doctor_code: doctor_code.toString()
				}
			}).then(doctor => {
				if (doctor) { // newly generated doctor_code already exists.
					console.log("doctor.doctor_code already exists: " + doctor.doctor_code)
					// Generate new doctor_code
					doctor_code = Math.floor(Math.random() * 999999) + 1
					generateUniqueDoctorCode(doctor_code)
				} else {
					console.log("doctor_code is unique: " + doctor_code)
					resolve(doctor_code)
				}
			}).catch(function (err){
				console.log('ERROR WHILE generateUniqueDoctorCode()')
				reject(err)
			})
		}

		doctor_code = generateUniqueDoctorCode(doctor_code)

	}).then(function (doctor_code){

		models.Doctor.create({
			email: email,
			password: password,
			doctor_code: doctor_code,
			hospital: hospital,
			name: name
		}).then(doctor => {
			console.log('AFTER CREATE DOCTOR IN DB.')
			res.status(201).json({success: true, message: 'Ok'});
			// jwt.sign({
			// 		id: doctor.id,
			// 		permissions: userPermission.DEVELOPER,
			// 		email: doctor.email,
			// 		doctor_code: doctor.doctor_code
			// 	},
			// 	secret,
			// 	{
			// 		expiresIn: '7d',
			// 		issuer: 'jellylab.io',
			// 		subject: 'doctor'
			// 	},
			// 	(err, token) => {
			// 		console.log(token);
			// 		console.log(err);
			// 		if (err) {
			// 			console.log('ERROR WHILE signing Json Web Token')
			// 			res.status(403).json({
			// 				message: error.message
			// 			});
			// 		}
			// 		res.cookie('token', token);
			// 		res.status(201).json({success: true, message: 'Ok'});
			// 	});
		}).catch(function (err) {
			// handle error;
			console.log('ERROR WHILE CREATING DOCTOR ROW IN DB')
			if (err) res.status(500).json({
				success: false,
				message: err.message,
				log: 'Error while creating doctor row in db. check uniqueness of parameters.'
			});
		});

	}).catch(function (err){
		res.status(500).json({
			success: false,
			message: err.message
		})
	})
}

function loginDoctor (req, res) {

	const email = req.body.email;
	const password = req.body.password;
	const secret = req.app.get('jwt_secret');
	if (!email) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.findOne({
		where: {
			email: email
		}
	}).then(doctor => {
		console.log('doctor.email: ' + doctor.email)
		console.log('doctor.password: ' + doctor.password)
		console.log('given email: ' + email)
		console.log('given password: ' + password)
		if (!doctor) {
			return res.status(403).json({success: true, message: 'No User'});
		}
		if (doctor.password === password) {
			jwt.sign({
					id: doctor.id,
					permissions: userPermission.DEVELOPER,
					email: doctor.email,
					doctor_code: doctor.doctor_code
				},
				secret, {
					expiresIn: '7d',
					issuer: 'jellylab.io',
					subject: 'userInfo'
				}, (err, token) => {
					console.log('err: ' + err, ', token: ' + token);
					if (err) res.status(403).json({
						success: false,
						message: error.message + ', err: ' + err.message
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
	}).catch(function (err){
		res.status(403).json({
			success: false,
			message: 'DB error. err: ' + err.message
		})
	});
}

function logoutDoctor (req, res) {
	res.clearCookie('token');
	res.status(200).end();
}


// TODO: getDoctor and updateDoctor are legacy code. need to update when needed.
function getDoctor (req, res) {
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

function updateDoctor (req, res) {
	const email = parseInt(req.params.email, 10);
	if (!id) return res.status(400).json({error: 'Incorrect id'});

	models.Doctor.findOne({
		where: {
			email: email
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

module.exports = {
	verifyToken: verifyToken,
	checkTokenVerified: checkTokenVerified,
	authenticate: authenticate,
	registerDoctor: registerDoctor,
	loginDoctor: loginDoctor,
	logoutDoctor: logoutDoctor,
	getUser: getDoctor,
	updateDoctor: updateDoctor,
	doctorEmailDuplicateCheck: doctorEmailDuplicateCheck,
};
