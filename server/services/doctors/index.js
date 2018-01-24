/**
 * Doctor API index
 *
 * @date 2017-12-28
 * @author 김지원
 * @updated 2018-01-10
 *
 */

'use strict';

const models = require('../../models');
const Op = require('sequelize').Op

function getPatientsRegistered(req, res){
	let doctorCode = req.params.doctor_code
	models.Patient.findAll({
		where: {
			doctor_code: doctorCode,
			registered: 1
		}
	}).then(patients => {
		if (!patients) {
			return res.status(404).json({error: 'No patient registered with doctor code: ' + doctorCode});
		}
		res.json(patients);
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

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
			registered: {[Op.notIn]: [1, 2]}
		}
	}).then(patients => {
		if (!patients) {
			return res.status(404).json({error: 'No unregistered patient associated with doctor code: ' + doctorCode});
		}
		return res.status(200).json(patients);
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

function getPatientInfo (req, res){

	let decoded = req.decoded

	models.Patient.findOne({
		where: {
			kakao_id: req.params.kakao_id,
			doctor_code: {[Op.ne]: null}
		}
	}).then(patient => {
		if (!patient){
			return res.status(403).json({success: false, message: 'No patient found with given kakao_id that has a value for doctor_code.'})
		}

		patient.medicine_side=''
		console.log('start')

		const p1 = new Promise(function(resolve, reject) {
			models.Mood_check.findAll({
				where: {
					kakao_id: patient.kakao_id
				}
			}).then(mood => {
				if(mood) patient.mood_check = mood;
				resolve()
			})
		})
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
				if(check) patient.medicine_check = check
				resolve()
			});
		});

		Promise.all([p1, p2]).then(function(value) {
			// if(patient.doctor_code !== decoded.doctor_code.toString()) {
			// 	res.status(403).json({ message: 'Permission Error. Patient and logged in doctor\'s Doctor Code does not match.' });
			// 	return;
			// }

			let patientinfo = {
				id: patient.id,
				name: patient.name,
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
			res.status(500).json({ message: 'Server Error. Reason:' + reason.toString()});
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

		if (!patient){
			return res.status(200).json({message: 'No patient found with given kakao_id.'})
		}

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
				// let datetimeConverted = new Date(datetime.replace(/-/g, '/'))
				// let jsDate = Date.parse(datetimeConverted);
				let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
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

			let weekAvg = round(average(weekMoodChecks))
			let weekSd = round(standardDeviation(weekMoodChecks))
			let monthAvg = round(average(monthMoodChecks))
			let monthSd = round(standardDeviation(monthMoodChecks))


			// ------------------- Medicine Check ------------------- //
			let totalWeekCount = 0;
			let totalMonthCount = 0;

			let takenWeekCount = 0;
			let takenMonthCount = 0;

			let recordDate = new Date().getTime();

			for (let iterationCount in patient.medicine_check){

				let medCheck = patient.medicine_check[iterationCount]['med_check']
				let datetime = patient.medicine_check[iterationCount]['time']

				let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
				let now = new Date().getTime();
				let timeDifferenceInDays = (now - jsDate) / 1000 / 60 / 60 /24

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
			let nextHospitalVisitDate = recordDate
				// + 1000*60*60*24*(Math.floor(Math.random()*3) + 1) // 레코드에 있는 데이트 + 랜덤 일 수.

			let patientinfo = {
				id: patient.id,
				name: patient.name,
				doctor_code: patient.doctor_code,
				kakao_id: patient.kakao_id,
				weekTakenRate: weekTakenRate,
				monthTakenRate: monthTakenRate,
				weekEmotionEmergencyCount: weekEmergencyMoodCount,
				monthEmotionEmergencyCount: monthEmergencyMoodCount,
				weekStandardDeviation: weekSd,
				monthStandardDeviation: monthSd,
				weekAverage: weekAvg,
				monthAverage: monthAvg,
				nextHospitalVisitDate: nextHospitalVisitDate
			}

			return res.status(200).json(patientinfo);
		}, function(reason) {
			return res.status(500).json({ message: 'Server Error. reason: ' + reason });
		});
	}).catch(function (err){
		console.log("Get patient info summary failed: err.status: " + err.status + '\t err.message: ' + err.message)
		return res.status(500).json({message: err.message})
	});
}

function getPatientInfoAll (req, res){
	const patientKakaoId = req.params.kakao_id;

	let med_miss_reasons;

	models.Patient.findOne({
		where: {
			kakao_id: patientKakaoId
		}
	}).then(patient => {

		if (!patient){
			return res.status(200).json({message: 'No patient found with given kakao_id.'})
		}

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

		const p3 = new Promise(function(resolve, reject) {
			models.Medicine_check.findAll({
				where: {
					kakao_id: req.params.kakao_id,
					med_check: {[Op.ne]: 1}
				}
			}).then(med_checks => {
				if (med_checks) {
					med_miss_reasons = med_checks;
					resolve();
				}
				resolve();
			}).catch(function (err){
				return res.status(500).json(err)
			})
		});


		Promise.all([p1, p2, p3]).then(function(value) {
			let
				weekEmergencyMoodCount = 0,
				monthEmergencyMoodCount = 0,
				weekMoodChecks = [],
				monthMoodChecks = []

			// ---------- Mood Check ------------ //

			for (let iterationCount in patient.mood_check){
				let moodCheck = patient.mood_check[iterationCount]['mood_check']
				let datetime = patient.mood_check[iterationCount]['time']

				// This code converts YYYY-MM-DD hh:mm:ss to YYYY/MM/DD hh:mm:ss that is easily parsed by Date constructor.
				let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
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

			let weekAvg = round(average(weekMoodChecks))
			let weekSd = round(standardDeviation(weekMoodChecks))
			let monthAvg = round(average(monthMoodChecks))
			let monthSd = round(standardDeviation(monthMoodChecks))


			// ------------------- Medicine Check ------------------- //
			let totalWeekCount = 0;
			let totalMonthCount = 0;

			let takenWeekCount = 0;
			let takenMonthCount = 0;

			let recordDate = new Date().getTime();

			for (let iterationCount in patient.medicine_check){

				let medCheck = patient.medicine_check[iterationCount]['med_check']
				let datetime = patient.medicine_check[iterationCount]['time']

				let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
				let now = new Date().getTime();
				let timeDifferenceInDays = (now - jsDate) / 1000 / 60 / 60 /24

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

			let nextHospitalVisitDate = recordDate + 1000*60*60*24*(Math.floor(Math.random()*3) + 1) // 레코드에 있는 날짜 + 랜덤 일 수.

			let patientinfo = {
				id: patient.id,
				name: patient.name,
				doctor_code: patient.doctor_code,
				kakao_id: patient.kakao_id,
				weekTakenRate: weekTakenRate,
				monthTakenRate: monthTakenRate,
				weekEmotionEmergencyCount: weekEmergencyMoodCount,
				monthEmotionEmergencyCount: monthEmergencyMoodCount,
				weekStandardDeviation: weekSd,
				monthStandardDeviation: monthSd,
				weekAverage: weekAvg,
				monthAverage: monthAvg,
				nextHospitalVisitDate: nextHospitalVisitDate,
				med_check_reason: med_miss_reasons
			}

			return res.status(200).json(patientinfo);
		}, function(reason) {
			return res.status(500).json({ message: 'Server Error. reason: ' + reason });
		});
	}).catch(function (err){
		console.log("Get patient info summary failed: err.status: " + err.status + '\t err.message: ' + err.message)
		return res.status(500).json({message: err.message})
	});
}

function average (data){
	let sum = data.reduce(function(sum, value){
		return parseInt(sum) + parseInt(value);
	}, 0);

	let avg = sum / data.length;
	return avg;
}

function standardDeviation(values){
	let avg = average(values);

	let squareDiffs = values.map(function(value){
		let diff = value - avg;
		let sqrDiff = diff * diff;
		return sqrDiff;
	});

	let avgSquareDiff = average(squareDiffs);

	let stdDev = Math.sqrt(avgSquareDiff);
	return stdDev;
}

function round(num){
	return Math.round(parseInt(num) * 100) / 100
}


function getPatientMedMissReason(req, res){
	models.Medicine_check.findAll({
		where: {
			kakao_id: req.params.kakao_id,
			med_check: {[Op.ne]: 1}
		}
	}).then(med_checks => {
		if (!med_checks) {
			return res.status(404).json({error: 'No missed medicine checks associated with kakao_id: ' + req.params.kakao_id});
		}
		return res.status(200).json(med_checks);
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

function addPatient (req, res) {
	let decoded = req.decoded
	if (decoded.email) {
		models.Patient.findOne({
			where: {
				doctor_code: decoded.doctor_code, // Patient 가 doctor_code 를 추가 했어야만 등록 가능하도록.
				registered: 0
			}
		}).then(patient => {
			patient.registered = 1
			patient.save().then(_ => res.status(200).json(patient));
		});
	}
}

function registerPatient(req, res){
	let kakao_id = req.body.kakao_id
	models.Patient.update({
		registered: 1 // What to update
	}, {
		where: {kakao_id: kakao_id} // Condition
	}).then(result => {
		console.log('result: ' + result.toString())
		if (result[0] === 1){ // result[0] stores the number of affected rows.
			return res.status(200).json({success: true, message: 'Update complete. Result: ' + result.toString()})
		} else {
			return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given kakao_id. ' +
				'It is possible the patient is already registered. Result: ' + result.toString()})
		}
	}).catch(function (err){
		return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
	})
}

function declinePatient(req, res){
	let kakao_id = req.body.kakao_id
	models.Patient.update({
		registered: 2 // What to update
	}, {
		where: {kakao_id: kakao_id} // Condition
	}).then(result => {
		console.log('result: ' + result.toString())
		if (result[0] === 1){ // result[0] stores the number of affected rows.
			return res.status(200).json({success: true, message: 'Update complete. Result: ' + result.toString()})
		} else {
			return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given kakao_id. Result: ' + result.toString()})
		}
	}).catch(function (err){
		return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
	})
}

function changePatientVisit(req, res){
    let kakao_id = req.body.kakao_id
    models.Patient.update({
        registered: 1 // What to update
    }, {
        where: {kakao_id: kakao_id} // Condition
    }).then(result => {
        console.log('result: ' + result.toString())
        if (result[0] === 1){ // result[0] stores the number of affected rows.
            return res.status(200).json({success: true, message: 'Update complete. Result: ' + result.toString()})
        } else {
            return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given kakao_id.' +
				'Result: ' + result.toString()})
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
    })
}

function getMedicineCheck (req, res){

	const kakao_id = req.params.kakao_id
	const startTime = req.params.start
	const endTime = req.params.end

	models.Medicine_check.findAll({
		where: {
			kakao_id: req.params.kakao_id,
			time: {[Op.lt]: endTime,
				[Op.gt]: startTime},
		}
	}).then(med_checks => {
		if (!med_checks) {
			return res.status(404).json({error: 'No missed medicine checks associated with kakao_id: ' + req.params.kakao_id});
		}
		return res.status(200).json({success: true, medicine_checks: med_checks});
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

function getMoodCheck (req, res){
	const startTime = req.params.start
	const endTime = req.params.end

	models.Mood_check.findAll({
		where: {
			kakao_id: req.params.kakao_id,
			time: {[Op.lt]: endTime,
				[Op.gt]: startTime},
		}
	}).then(mood_checks => {
		if (!mood_checks) {
			return res.status(404).json({error: 'No missed mood checks associated with kakao_id: ' + req.params.kakao_id});
		}
		return res.status(200).json({success: true, mood_checks: mood_checks})
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

function getPatientMedicineTime (req, res){
	const kakao_id = req.params.kakao_id

	models.Medicine_time.findAll({
		where: {
			kakao_id: req.params.kakao_id,
		}
	}).then(med_times => {
		if (!med_times) {
			return res.status(404).json({error: 'No medicine times associated with kakao_id: ' + req.params.kakao_id});
		}
		return res.status(200).json({success: true, medicine_times: med_times});
	}).catch(function (err){
		return res.status(500).json(err)
	})
}

module.exports = {
	addPatient: addPatient,
	getPatients: getPatients,
	getPatientsToAdd: getPatientsToAdd,
	getPatientInfo: getPatientInfo,
	getPatientInfoSummary: getPatientInfoSummary,
	getPatientInfoAll: getPatientInfoAll,
	getPatientMedMissReason: getPatientMedMissReason,
	getPatientsRegistered: getPatientsRegistered,
	registerPatient: registerPatient,
	declinePatient: declinePatient,
	getMedicineCheck: getMedicineCheck,
	getMoodCheck: getMoodCheck,
	getPatientMedicineTime: getPatientMedicineTime,
    changePatientVisit: changePatientVisit,

};
