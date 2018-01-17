const models = require('../../models');
const Op = models.sequelize.Op;

function registerPatient (req, res) {
	let kakao_id
	if (req.body){
		kakao_id = req.body.kakao_id
	} else {
		return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, phone, name).'})
	}

	models.Patient.create({
		kakao_id: kakao_id,
		scenario: '3',
		state: 'init'
	}).then(patient => {
		return res.status(201).json({success: true, patient})
	}).catch(function (err){
		return res.status(500).json({success: false, error: err.message})
	});
}

function updatePatient (req, res) {
	console.log('updatePatient called.')
	let kakao_id

	if (req.body){
		kakao_id = req.body.kakao_id
		if (!kakao_id){
			return res.status(403).json({success: false, message: 'kakao_id not provided.'})
		}
	} else {
		return res.status(403).json({success: false, message: 'No input parameters received in body.'})
	}

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
		models.sequelize.query('UPDATE patients SET ' + param_name + " = '" + param_value + "' WHERE kakao_id = '" + kakao_id + "';").then(result => {
			if (result){
				return res.status(200).json({success: true, message: 'patient data updated. Result info: ' + result[0].info})
			} else {
				return res.status(403).json({success: false, message: 'patient update query failed.'})
			}
		}).catch(function (err){
			return res.status(403).json({success: false, message: 'Unknown error while querying patients table for update from ChatBot server. err: ' + err.message})
		})
	}
}


function getPatientInfo (req, res) {
	console.log('getPatientLog called.')
	const kakao_id = req.params.kakao_id

	if (kakao_id) {

		models.Patient.findOne({
			where: {
				kakao_id: kakao_id
			}
		}).then(patient => {
			if (!patient){
				return res.status(403).json({success: false, message: 'patient not found with kakao_id: ' + kakao_id})
			}
			models.PatientLog.findAll({
				where: {
					kakao_id: kakao_id
				}
			}).then(patientLog => {
				console.log(patientLog);
				return res.status(200).json({success: true, patient_info: patient, patient_log: patientLog})
			}).catch(function (err){
				return res.status(403).json({success: false, message: 'patient info found. But error occured while retrieving logs.', error: err.message})
			})
		}).catch(function (err){
			return res.status(403).json({success: false, message: err.message})
		})
	} else {
		return res.status(403).json({success: false, message: 'kakao_id not given.'})
	}
}

function createPatientLog (req, res){
	const kakao_id = req.body.kakao_id
	const scenario = req.body.scenario
	const state = req.body.state
	const content = req.body.content
	const date = req.body.date
	const type = req.body.type

	models.PatientLog.create({
		kakao_id: kakao_id,
		scenario: scenario,
		state: state,
		content: content,
		date: date,
		type: type
	}).then(patientLog => {

		models.Patient.update(
			{
				scenario: scenario,
				state: state
			},     // What to update
			{where: {
				kakao_id: kakao_id}
			})  // Condition
			.then(result => {
				return res.status(200).json({success: true, message: 'Patient Log and Patient both Update complete.', updateResult: result, patientLog: patientLog})
			}).catch(function (err){
				return res.status(403).json({success: false, message: 'Patient Log updated. However Patient Update failed. Error: ' + err.message, patientLog: patientLog})
			})

		// return res.status(201).json({success: true, patientLog})
	}).catch(function (err){
		return res.status(500).json({success: false, error: err.message})
	})


}


module.exports = {
	registerPatient: registerPatient,
	updatePatient: updatePatient,
	getPatientInfo: getPatientInfo,
	createPatientLog: createPatientLog,

}
