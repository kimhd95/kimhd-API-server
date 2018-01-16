const models = require('../../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;


function updatePatient (req, res) {
	console.log('updatePatient called.')
	const kakao_id = req.body.kakao_id
	const name = req.body.name
	const fullname = req.body.fullname
	const email = req.body.email
	const doctor_code = req.body.doctor_code
	const phone = req.body.phone
	const sex = req.body.sex
	const birthday = req.body.birthday

	let param_name;
	let param_value;
	if (name){
		param_name = 'name'
		param_value = name
	} else if (fullname){
		param_name = 'fullname'
		param_value = fullname
	} else if (email) {
		param_name = 'email'
		param_value = email
	} else if (doctor_code) {
		param_name = 'doctor_code'
		param_value = doctor_code
	} else if (phone) {
		param_name = 'phone'
		param_value = phone
	} else if (sex) {
		param_name = 'sex'
		param_value = sex
	} else if (birthday) {
		param_name = 'birthday'
		param_value = birthday
	}

	if (param_value){
		sequelize.query('UPDATE users SET ' + param_name + ' = ' + param_value + ' WHERE kakao_id = ' + kakao_id)
	// }
	//
	//
	// if (param_value) {
	// 	models.Patient.findOne({
	// 		where: {
	// 			kakao_id: kakao_id
	// 		}
	// 	}).then(patient => {
	// 		if (!patient) {
	// 			return res.status(403).json({success: false, message: 'patient not found'})
	// 		}
	//
	//
	//
	// 		patient.(param_value) String(param_value).save().then(_ => {
	// 			console.log ('SUCCESS !!!!')
	// 		})
	//
	// 		if (name){
	// 			patient.name.save()
	// 		} else if (fullname){
	// 			param_value = fullname
	// 		} else if (email) {
	// 			param_value = email
	// 		} else if (doctor_code) {
	// 			param_value = doctor_code
	// 		} else if (phone) {
	// 			param_value = phone
	// 		} else if (sex) {
	// 			param_value = sex
	// 		} else if (birthday) {
	// 			param_value = birthday
	// 		}
	//
	//
	// 		patient.parameter.toString().save().then(_ => {
	// 			return res.status(200).json({success: true, message: _.message})
	// 		})
	// 	}).catch(function (err){
	// 		return res.status(403).json({success: false, message: 'update Patient failed. err: ' + err.message})
	// 	})
	}
}

module.exports = {
	updatePatient: updatePatient,

}
