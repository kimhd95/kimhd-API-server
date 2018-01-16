/**
 * Doctor API authentication part
 *
 * @date 2018-01-04
 * @author 김지원
 * @updated 2018-01-15
 * @updated_by 김지원
 * @update_log verifyToken & checkTokenVerified updated.
 *
 * Refer to https://www.npmjs.com/package/jsonwebtoken for jwt.
 */

'use strict';

const qs = require('qs');
const jwt = require('jsonwebtoken');
const models = require('../../models');
const config = require('../../../configs')

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

// verifyToken is mainly used for initial authentication purposes.
// For example, to determine whether the browser is already "logged in" or not.
// For general authentication purposes, calling the APIs directly will suffice.
// This is because "checkTokenVerified" is called as a middleware for APIs that need authentication.
function verifyToken (req, res, next){
	const cookie = req.cookies || req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || cookies.token;
	const secret = req.app.get('jwt_secret');

	console.log('cookie: ' + cookie)
	console.log('token: ' + token)

	// decode token
	if (token) {
		console.log('token given.')

		// verifies secret and checks exp
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				return res.status(200).json({success: true, message: 'Token verified.', doctor_code: decoded.doctor_code, redirect: '/login'})
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
	const cookie = req.cookies || req.headers.cookie || '';
	const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || cookies.token;
	const secret = config.jwt_secret;
	// const secret = req.app.get('jwt_secret');

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, secret, function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save decoded token payload to request for use in other routes
				console.log('Token verified')
				req.decoded = decoded;
				next()
			}
		});
	} else {
		// return an error if there is no token
		return res.status(403).send({
			success: false,
			message: 'API call not allowed. No token provided.'
		});
	}
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
	const email = req.body.email.toString() || '';
	if (!email.length) {
		return res.status(400).json({exists: null, message: 'Email not provided.'});
	}
	models.Doctor.findOne({
		where: {
			email: email
		}
	}).then(doctor => {
		console.log('email: ' + email)
		if (doctor){console.log('doctor.email: ' + doctor.email)} else {
			console.log('No doctor found with given email.')
		}
		if (doctor) {
			console.log("Email already exists: ")
			res.status(200).json({exists: true, message: 'Email already exists.'})
		} else {
			res.status(200).json({exists: false, message: 'Email is unique. Good to proceed.'})
		}
	}).catch(function (err){
		console.log('ERROR while checking duplicate email')
		res.status(500).json({exists: null, message: 'Internal server DB error. err: ' + err.message, devLog: 'email given: ' + email})
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

	// Check if email arrived
	if (!email.length) {
		// return res.status(400).json({message: 'email.length: ' + email.length + ', email: ' + email + ', password: NOT ALLOWED' +  + ', hospital: ' + hospital + ', name: ' + name})
		return res.status(400).json({success: false, error: 'Email not given'});
	}

	// Validate Email Regex
	let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(email)){
		return res.status(400).json({success: false, error: 'Incorrect email'})
	}

	// Check if password arrived
	if (!password.length) {
		return res.status(400).json({success: false, error: 'Password not given'});
	}

	// Check if password > 6 alphanumeric
	if(! password.length >=6 ){
		return res.status(400).json({success: false, error: 'Password needs to be longer than 6 alphanumeric characters.'});
	}

	// Check if password > 6 alphanumeric
	let letter = /[a-zA-Z]/;
	let number = /[0-9]/;
	let valid = number.test(password) && letter.test(password); //match a letter _and_ a number
	if (!valid){
		return res.status(400).json({success: false, message: 'Password requires at least one character and one digit.'})
	}

	// let pwre = /[A-Z0-9a-z!?^%*_~@#$]/g;
	// if(! pwre.test(password) ){
	// 	return res.status(400).json({success: false, error: 'Password needs to be longer than 6 alphanumeric characters.'});
	// }


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
	console.log('loginDoctor called')
	console.log('Cookies: ', req.cookies)

	const email = req.body.email;
	const password = req.body.password;
	const secret = req.app.get('jwt_secret');
	if (!email){
		console.log('Email not given.')
		return res.status(400).json({success: false, message: 'Email not given.'});
	}

	models.Doctor.findOne({
		where: {
			email: email
		}
	}).then(doctor => {
		if (!doctor) {
			return res.status(403).json({success: false, message: 'No User'});
		}
		if (doctor.password === password) {
			console.log('doctor.email: ' + doctor.email)
			console.log('doctor.password: ' + doctor.password)
			console.log('given email: ' + email)
			console.log('given password: ' + password)
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
					if (err) {
						console.log('err.message: ' + err.message);
						return res.status(403).json({
							success: false,
							message: err.message
						});
					}
					// Refer to https://stackoverflow.com/questions/1062963/how-do-browser-cookie-domains-work/30676300#30676300 for cookie settings.
					// And https://stackoverflow.com/questions/1134290/cookies-on-localhost-with-explicit-domain for localhost config.
					console.log('req.header.origin = ' + req.header('origin'))

					if (req.header('origin') === undefined){
                        console.log('req origin is undefined. Probably from postman.')
                        if (req.secure) {
                            console.log('req is secure')
                            res.cookie('token', token, {domain: 'localhost', maxAge: 1000 * 60 * 15, secure: true})
                        } else {
                            console.log('req is NOT secure')
                            res.cookie('token', token, {domain: 'localhost', maxAge: 1000 * 60 * 15, secure: false})
                        }
					} else if (req.header('origin').includes('localhost')) {
						console.log('req origin includes localhost OR it is from postman.')
						if (req.secure) {
							console.log('req is secure')
							res.cookie('token', token, {domain: 'localhost', maxAge: 1000 * 60 * 15, secure: true})
						} else {
							console.log('req is NOT secure')
							res.cookie('token', token, {domain: 'localhost', maxAge: 1000 * 60 * 15, secure: false})
						}
					} else {
						console.log('req origin does NOT include localhost')
						if (req.secure) {
							res.cookie('token', token, {domain: '.jellylab.io', maxAge: 1000 * 60 * 15, secure: true})
						} else {
							res.cookie('token', token, {domain: '.jellylab.io', maxAge: 1000 * 60 * 15, secure: false})
						}
					}
					res.header('test', 'testCookieValue: cookieValue');
					res.header('Access-Control-Allow-Credentials', 'true');
					return res.status(200).json({success: true, message: 'Ok', token: token});
				});
		} else {
			return res.status(403).json({
				success: false,
				message: 'Password wrong'
			});
		}
	}).catch(function (err){
		console.log('err.message: ' + err.message);
		return res.status(403).json({
			success: false,
			message: 'DB error. err: ' + err.message
		})
	});
}

function logoutDoctor (req, res) {
	res.clearCookie('token');
	return res.status(200).end();
}

function updatePassword (req, res) {
	const email = req.body.email
	const curPassword = req.body.password_current
	const newPassword = req.body.password_new
	if (!email) return res.status(400).json({success: false, message: 'email not provided.'});

	models.Doctor.findOne({
		where: {
			email: email
		}
	}).then(doctor => {
		if (!doctor) {
			return res.status(404).json({error: 'No user with given email address.'});
		}

   if (doctor.password === curPassword){
			doctor.password = newPassword
	   doctor.save().then(_ => {
		   return res.status(200).json({success: true, message: 'Password successfully updated.'})
	   })
   } else {
			return res.status(403).json({success: false, message: 'Given current password is wrong.'})
   }
	});
}

function deleteDoctor (req, res) {
	const email = req.body.email
	const password = req.body.password
	if (!email) return res.status(400).json({success: false, message: 'Email not provided.'})

	models.Doctor.find({
		where: {
			email: email
		}
	}).then(doctor => {
		console.log('doctor with given email found')
		if (!doctor){
			return res.status(403).json({success: false, message: 'No doctor account with given email address found'})
		} else {
			if (doctor.password !== password){
				return res.status(403).json({success: false, message: 'The given password does not match with the account password.'})
			} else {
				models.Doctor.destroy({
					where: {
						email: email,
						password: password
					}
				}).then(result => {
					console.log('Doctor.destroy result: ' + result)

					if (result === 0){
						return res.status(403).json({success: false, message: 'Doctor email and password match. But somehow the delete failed.'})
					} else {
						return res.status(200).json({success: true, message: 'Doctor account successfully deleted.'})
					}

				}).catch(function (err){
					return res.status(403).json({success: false, message: 'Unknown inner catch error on Doctor.destroy. err: ' + err.message})
				})
			}
		}
	}).catch(function (err){
		return res.status(403).json({success: false, message: 'Unknown outer catch error. err: ' + err.message})
	})
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
	updatePassword: updatePassword,
	deleteDoctor: deleteDoctor,
};
