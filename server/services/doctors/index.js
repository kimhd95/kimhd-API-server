/**
 * Doctor API index
 *
 * @date 2017-12-28
 * @author 김지원
 * @updated 2018-01-05
 *
 */

'use strict';

const models = require('../../models');
const _ = require('underscore');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

// Return all patients associated with given doctor code
function getPatients(req, res){
	let doctorCode = req.params.doctor_code
	models.Patient.findAll({
		where: {
			doctor_code: req.params.doctor_code
		}
	}).then(patients => {
		if (!patients) {
			return res.status(404).json({error: 'No patient associated with doctor code: ' + doctorCode});
		}
		res.json(patients);
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

// Return all patients associated with given doctor code
// && only those who have not already registered with a doctor (patient.registered != 1).
function getPatientsToAdd(req, res){
	let doctorCode = req.params.doctor_code
	models.Patient.findAll({
		where: {
			doctor_code: doctorCode,
			registered: {[Op.ne]: 1}
		}
	}).then(patients => {
		if (!patients) {
			return res.status(404).json({error: 'No unregistered patient associated with doctor code: ' + doctorCode});
		}
		res.status(200).json(patients);
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

function getPatientInfo (req, res){

	let decoded = req.decoded

	models.Patient.findOne({
		where: {
			kakao_id: req.params.kakao_id
		}
	}).then(patient => {

		console.log(patient.doctor_code);

		patient.medicine_side='';
		console.log('start');

		const p1 = new Promise(function(resolve, reject) {
			models.Mood_check.findAll({
				where: {
					kakao_id: patient.kakao_id
				}
			}).then(mood => {
				if(mood) patient.mood_check = mood;
				resolve();
			});
		});
		const p2 = new Promise(function(resolve, reject) {
			models.Medicine_check.findAll({
				where: {
					kakao_id: patient.kakao_id
				}
				// ,
				// order: [
				// 	// Will escape username and validate DESC against a list of valid direction parameters
				// 	['time', 'DESC']
				// ]
			}).then(check => {
				if(check) patient.medicine_check = check;
				resolve();
			});
		});

		Promise.all([p1, p2]).then(function(value) {
			if(patient.doctor_code !== decoded.doctor_code.toString()) {
				res.status(403).json({ message: 'Permission Error. Patient and logged in doctor\'s Doctor Code does not match.' });
				return;
			}

			var patientinfo = {
				id: patient.id,
				username: patient.username,
				doctor_code: patient.doctor_code,
				kakao_id: patient.kakao_id,
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

			console.log(patientinfo);
			res.status(200).json(patientinfo);
		}, function(reason) {
			res.status(500).json({ message: 'Server Error' });
		});
	}).catch(function (err){
		console.log("Get patient info summary failed: err.status: " + err.status + '\t err.message: ' + err.message)
		res.status(500).json({message: err.message})
	});
}

function getPatientInfoSummary (req, res){
	const patientKakaoId = req.params.kakao_id;

	models.Patient.findOne({
		where: {
			kakao_id: patientKakaoId
		}
	}).then(patient => {

		const p1 = new Promise(function(resolve, reject) {
			models.Mood_check.findAll({
				where: {
					kakao_id: patient.kakao_id
				}
			}).then(mood => {
				if(mood) patient.mood_check = mood;
				resolve();
			});
		});

		const p2 = new Promise(function(resolve, reject) {
			models.Medicine_check.findAll({
				where: {
					kakao_id: patient.kakao_id
				}
			}).then(check => {
				if(check) patient.medicine_check = check;
				resolve();
			});
		});

		Promise.all([p1, p2]).then(function(value) {
			let
				weekEmergencyMoodCount = 0,
				monthEmergencyMoodCount = 0,
				weekMoodChecks = [],
				monthMoodChecks = []



			for (let iterationCount in patient.mood_check){
				let moodCheck = patient.mood_check[iterationCount]['mood_check']
				let datetime = patient.mood_check[iterationCount]['time']

				// This code converts YYYY-MM-DD hh:mm:ss to YYYY/MM/DD hh:mm:ss that is easily parsed by Date constructor.
				let datetimeConverted = new Date(datetime.replace(/-/g, '/'))
				let jsDate = Date.parse(datetimeConverted);
				let now = new Date().getTime();
				let timeDifferenceInDays = (now - jsDate) / 1000 / 60 / 60 /24

				if (timeDifferenceInDays < 7) { // record within 7 days of query
					weekMoodChecks.push(moodCheck)
					if (moodCheck <= -3){
						weekEmergencyMoodCount += 1;
					}
				}
				if (timeDifferenceInDays < 30) { // record within 30 days of query
					monthMoodChecks.push(moodCheck)
					if (moodCheck <= -3) {
						monthEmergencyMoodCount += 1;
					}
				}
			}

			let weekAverage = _(weekMoodChecks).reduce(function(total, moodCheck) {
				return total + moodCheck;
			}) / weekMoodChecks.length;

			let weekSquaredDeviations = _(weekMoodChecks).reduce(function(total, moodCheck) {
				let deviation = moodCheck - weekAverage;
				let deviationSquared = deviation * deviation;
				return total + deviationSquared;
			}, 0);

			let weekStandardDeviation = Math.sqrt(weekSquaredDeviations / weekMoodChecks.length);

			let monthAverage = _(monthMoodChecks).reduce(function(total, moodCheck) {
				return total + moodCheck;
			}) / monthMoodChecks.length;

			let monthSquaredDeviations = _(monthMoodChecks).reduce(function(total, moodCheck) {
				let deviation = moodCheck - monthAverage;
				let deviationSquared = deviation * deviation;
				return total + deviationSquared;
			}, 0);

			let monthStandardDeviation = Math.sqrt(monthSquaredDeviations / monthMoodChecks.length);


			// ------------------- Medicine Check ------------------- //
			let totalWeekCount = 0;
			let totalMonthCount = 0;

			let takenWeekCount = 0;
			let takenMonthCount = 0;

			let recordDate = new Date().getTime();

			for (let iterationCount in patient.medicine_check){

				let medCheck = patient.medicine_check[iterationCount]['med_check']
				let datetime = patient.medicine_check[iterationCount]['time']

				// This code converts YYYY-MM-DD hh:mm:ss to YYYY/MM/DD hh:mm:ss that is easily parsed by Date constructor.
				let datetimeConverted = new Date(datetime.replace(/-/g, '/'))
				console.log('datetimeConverted: ' + datetimeConverted)

				let jsDate = Date.parse(datetimeConverted);
				recordDate = jsDate;
				console.log('jsDate: ' + jsDate)
				let now = new Date().getTime();
				console.log('now: ' + now)

				let timeDifferenceInDays = (now - jsDate) / 1000 / 60 / 60 /24
				console.log('timeDifferenceInDays: ' + timeDifferenceInDays)

				if (timeDifferenceInDays < 7) { // record within 7 days of query
					totalWeekCount += 1;
					if (medCheck === 1){
						takenWeekCount += 1;
					}
				}
				if (timeDifferenceInDays < 30) { // record within 30 days of query
					totalMonthCount += 1;
					if (medCheck === 1){
						takenMonthCount += 1;
					}
				}
			}

			// let medTakenRate = (medTakenCount/totalCount *100).toFixed(0);
			let weekTakenRate,
				monthTakenRate


			if (totalWeekCount > 0 ){
				weekTakenRate = (takenWeekCount / totalWeekCount * 100).toFixed((0));
			} else {
				weekTakenRate = 0;
			}

			if (totalMonthCount > 0){
				monthTakenRate = (takenMonthCount / totalMonthCount * 100).toFixed(0);
			} else {
				monthTakenRate = 0;
			}


			// let nextHospitalVisitDate = now + 1000*60*60*24*(Math.floor(Math.random()*3) + 1)
			let nextHospitalVisitDate = recordDate + 1000*60*60*24*(Math.floor(Math.random()*3) + 1) // 레코드에 있는 데이트 + 랜덤 일 수.

			let patientinfo = {
				id: patient.id,
				username: patient.username,
				doctor_code: patient.doctor_code,
				kakao_id: patient.kakao_id,
				weekTakenRate: weekTakenRate,
				monthTakenRate: monthTakenRate,
				weekEmotionEmergencyCount: weekEmergencyMoodCount,
				monthEmotionEmergencyCount: monthEmergencyMoodCount,
				weekStandardDeviation: weekStandardDeviation,
				monthStandardDeviation: monthStandardDeviation,
				weekAverage: weekAverage,
				monthAverage: monthAverage,
				nextHospitalVisitDate: nextHospitalVisitDate
			}

			res.status(200).json(patientinfo);
		}, function(reason) {
			res.status(500).json({ message: 'Server Error' });
		});
	}).catch(function (err){
		console.log("Get patient info summary failed: err.status: " + err.status + '\t err.message: ' + err.message)
		res.status(500).json({message: err.message})
	});
}

function addPatient (req, res) {

	let decoded = req.decoded
	console.log(decoded)

	if (decoded.email) {
		models.Patient.findOne({
			where: {
				doctor_code: decoded.doctor_code, // Patient 가 doctor_code 를 추가 했어야만 등록 가능하도록.
				registered: 0
			}
		}).then(patient => {
			console.log(patient);

			patient.registered = 1
			patient.save().then(_ => res.status(200).json(patient));
		});
	}
}

function getDoctors(req, res) {
	console.log('getDoctors called.')
	models.Doctor.findAll().then(result => {
		res.json(result);
	})
	.catch(function (err){
		res.status(500).json({
			success: false,
			message: 'Server Error getDoctors()'
		});	})
}

function getUserWithId(req, res) {
	let id = req.params.id || 0,
		result = {};
	res.json(result);
}

module.exports = {
	addPatient: addPatient,
	getDoctors: getDoctors,
	getUserWithId: getUserWithId,
	getPatients: getPatients,
	getPatientsToAdd: getPatientsToAdd,
	getPatientInfo: getPatientInfo,
	getPatientInfoSummary: getPatientInfoSummary,
};
