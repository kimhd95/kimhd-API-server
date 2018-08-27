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
const Op = require('sequelize').Op;
const moment = require('moment');
var logger = require('../../config/winston');

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


        patients.forEach((patient) => {


            // TODO : 변환 기능은 다른 API에서도 중복적으로 사용되므로 추후 리팩토링 필요
            // 성별 변환
            if (patient.sex == '남성'){
                patient.sex = 'M';
            } else if(patient.sex == '여성') {
                patient.sex = 'F';
            }

            // 나이 변환
            let now_b = new Date();
            let nowyear = now_b.getFullYear();
            let nowmonth = now_b.getMonth() + 1;
            let nowdate = now_b.getDate();
            let nowymd = nowyear*10000 + nowmonth*100 + nowdate;
            let birth;
            if (patient.birthday > 300000) { //1900년대생들
                birth = patient.birthday + 19000000;
            } else{
                birth = patient.birthday + 20000000;
            }
            let age1 = nowymd - birth;
            let age = (age1 - (age1%10000))/10000;

            patient.birthday = age;
        });

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
            //kakao_id: req.params.kakao_id,
            encrypted_kakao_id: req.params.encrypted_kakao_id,
            doctor_code: {[Op.ne]: null},
        }
    }).then(patient => {
        if (!patient){
            return res.status(403).json({success: false, message: 'No patient found with given encrypted kakao_id that has a value for doctor_code.'})
        }

        patient.comment_text==''
        console.log('start')

        const p1 = new Promise(function(resolve, reject) {
            models.Mood_check.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    encrypted_kakao_id: patient.encrypted_kakao_id
                }
            }).then(mood => {
                if(mood) patient.mood_check = mood;
                resolve()
            })
        })
        const p2 = new Promise(function(resolve, reject) {
            models.Medicine_check.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    encrypted_kakao_id: patient.encrypted_kakao_id,
                }
                // 필요할 경우 시간 Descending order 로 데이터 회수 가능.
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

        const p3 = new Promise(function(resolve, reject) {
            models.Patient_image.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    encrypted_kakao_id: patient.encrypted_kakao_id
                }
            }).then(image => {
                if(image) patient.patient_image = image;
                resolve()
            })
        });

        Promise.all([p1, p2, p3]).then(function(value) {
            // 환자의 닥터코드와 해당 API 콜을 하는 클라이언트에 로그인을 한 닥터의 닥터코드가 일치하는지 확인하는 코드.
            // if(patient.doctor_code !== decoded.doctor_code.toString()) {
            // 	res.status(403).json({ message: 'Permission Error. Patient and logged in doctor\'s Doctor Code does not match.' });
            // 	return;
            // }
            let now_b = new Date();
            let nowyear = now_b.getFullYear();
            let nowmonth = now_b.getMonth() + 1;
            let nowdate = now_b.getDate();
            let nowymd = nowyear*10000 + nowmonth*100 + nowdate;
            let birth;
            if (patient.birthday > 300000) { //1900년대생들
                birth = patient.birthday + 19000000;
            } else{
                birth = patient.birthday + 20000000;
            }
            let age1 = nowymd - birth;
            let age = (age1 - (age1%10000))/10000;
            console.log(patient.birthday, now_b, nowyear, nowmonth, nowdate, nowymd, birth, age1, age);

            let sex;
            if (patient.sex == '남성'){
                sex = 'M';
            } else if (patient.sex == '여성') {
                sex = 'F';
            }

            let patientinfo = {
                id: patient.id,
                name: patient.name,
                patient_code: patient.patient_code,
                doctor_code: patient.doctor_code,
                birthday: age,
                sex: sex,
                kakao_id: patient.kakao_id,
                encrypted_kakao_id: patient.encrypted_kakao_id,
                phone: patient.phone,
                medicine_week: patient.medicine_week,
                medicine_mouth: patient.medicine_mouth,
                emergency_mouth: patient.emergency_mouth,
                emergency_week: patient.emergency_week,
                //medicine_side: patient.medicine_side,
                //medicine_miss: patient.medicine_miss,
                mood_check: patient.mood_check,
                patient_image: patient.patient_image,
                //medicine_check: patient.medicine_check,
                comment_type: patient.comment_type,
                comment_text: patient.comment_text,
                next_hospital_visit_date: patient.next_hospital_visit_date,
            }

            console.log(patientinfo);
            res.status(200).json(patientinfo);
        }, function(reason) {
            res.status(500).json({ message: 'Server Error. Reason:' + reason.toString()});
        });
    }).catch(function (err){
        console.log("Get patient info failed: err.status: " + err.status + '\t err.message: ' + err.message)
        res.status(500).json({message: err.message})
    });
}

function getPatientInfoSummary (req, res){

    // TODO : 불필요한 계산식은 삭제할 필요 있음
    // TODO : 정신과 명칭 리팩토링 필요

    //const patientKakaoId = req.params.kakao_id;
    const patientEncryptedKakaoid = req.params.encrypted_kakao_id;
    models.Patient.findOne({
        where: {
            encrypted_kakao_id: patientEncryptedKakaoid
        }
    }).then(patient => {
        if (!patient){
            return res.status(200).json({message: 'No patient found with given encrypted kakao_id.'})
        }

        const p1 = new Promise(function(resolve, reject) {
            models.Mood_check.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    type: 'itchy',
                    encrypted_kakao_id: patient.encrypted_kakao_id
                }
            }).then(mood => {
                if(mood) patient.mood_check = mood;
                resolve();
            });
        });

        const p2 = new Promise(function(resolve, reject) {
            models.Medicine_check.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    encrypted_kakao_id: patient.encrypted_kakao_id
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
                weekMoodChecksPrev = [],
                monthMoodChecks = [],
                monthMoodChecksPrev = [];



            for (let iterationCount in patient.mood_check){
                let moodCheck = patient.mood_check[iterationCount]['mood_check']
                let datetime = patient.mood_check[iterationCount]['time']

                // This code converts YYYY-MM-DD hh:mm:ss to YYYY/MM/DD hh:mm:ss that is easily parsed by Date constructor.
                //let datetimeConverted = new Date(datetime.replace(/-/g, '/'))
                //let jsDate = Date.parse(datetimeConverted);
                let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
                let nextDay = new Date();
                nextDay.setHours(23, 59, 59, 999);
                let nextDaytime = nextDay.getTime();

                let timeDifferenceInDays = (nextDaytime - jsDate) / 1000 / 60 / 60 /24

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    weekMoodChecks.push(moodCheck)
                    if (moodCheck <= -3){
                        weekEmergencyMoodCount += 1;
                    }
                }

                if ((7 <= timeDifferenceInDays) && (timeDifferenceInDays < 14)) { // 전 주의 가려움 기록
                    weekMoodChecksPrev.push(moodCheck);
                }

                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    monthMoodChecks.push(moodCheck)
                    if (moodCheck <= -3) {
                        monthEmergencyMoodCount += 1;
                    }
                }

                if ((30 <= timeDifferenceInDays) && (timeDifferenceInDays < 60)) { // 전 월의 가려움 기록
                    monthMoodChecksPrev.push(moodCheck);
                }
            }

            let weekAvg = average(weekMoodChecks).toFixed(1);
            let weekAvgPrev = average(weekMoodChecksPrev).toFixed(1);
            let weekAvgChange, weekAvgChangeDirection;
            let weekSd = standardDeviation(weekMoodChecks).toFixed(1);
            let monthAvg = average(monthMoodChecks).toFixed(1);
            let monthAvgPrev = average(monthMoodChecksPrev).toFixed(1);
            let monthAvgChange, monthAvgChangeDirection;
            let monthSd = standardDeviation(monthMoodChecks).toFixed(1);
            if (isNaN(weekAvg)) weekAvg = '-';
            if (isNaN(weekAvgPrev)) weekAvgPrev = null;
            if (isNaN(weekSd)) weekSd = null;
            if (isNaN(monthAvg)) monthAvg = '-';
            if (isNaN(monthAvgPrev)) monthAvgPrev = null;
            if (isNaN(monthSd)) monthSd = null;
            // ------------------- Medicine Check ------------------- //
            let totalWeekCount = 0;
            let totalMonthCount = 0;

            let takenWeekCount = 0;
            let takenMonthCount = 0;
            let moistWeekCount = 0;
            let moistMonthCount = 0;
            let protopicWeekCount = 0;
            let protopicMonthCount = 0;
            let steroidWeekCount = 0;
            let steroidMonthCount = 0;
            let steroidWeekCountPrev = 0;
            let steroidMonthCountPrev = 0;

            let steroidWeekChange;
            let steroidWeekChangeDirection;
            let steroidMonthChange;
            let steroidMonthChangeDirection;

            //let recordDate = new Date().getTime();

            for (let iterationCount in patient.medicine_check){

                let medCheck = patient.medicine_check[iterationCount]['med_check']
                let datetime = patient.medicine_check[iterationCount]['date']
                let slot = patient.medicine_check[iterationCount]['slot']

                let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
                let nextDay = new Date();
                nextDay.setHours(23, 59, 59, 999);
                let nextDaytime = nextDay.getTime();

                let timeDifferenceInDays = (nextDaytime - jsDate) / 1000 / 60 / 60 /24

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if (medCheck >= 1){
                        takenWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if (medCheck >= 1){
                        takenMonthCount += medCheck;
                    }
                }

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if ((medCheck >= 1) && (slot === 0)){
                        moistWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if ((medCheck >= 1) && (slot === 0)){
                        moistMonthCount += medCheck;
                    }
                }

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if ((medCheck >= 1) && (slot === 1)){
                        protopicWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if ((medCheck >= 1) && (slot === 1)){
                        protopicMonthCount += medCheck;
                    }
                }

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidMonthCount += medCheck;
                    }
                }

                if ((7 <= timeDifferenceInDays) && (timeDifferenceInDays < 14)) { // record query within last week
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidWeekCountPrev += medCheck;
                    }
                }

                if ((30 <= timeDifferenceInDays) && (timeDifferenceInDays < 60)) { // record query within last month
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidMonthCountPrev += medCheck;
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

            // 스테로이드 사용횟수 증감률 계산
            if (steroidWeekCountPrev > 0) {
                console.log("CountPrev Positive");
                steroidWeekChange = ((steroidWeekCount - steroidWeekCountPrev) / steroidWeekCountPrev * 100).toFixed(0);
                // 문자열 생성
                if(steroidWeekChange > 0) {
                    steroidWeekChange = '▲'+steroidWeekChange+'%';
                    steroidWeekChangeDirection = 'positive';
                } else if (steroidWeekChange < 0) {
                    steroidWeekChange = '▼'+steroidWeekChange+'%';
                    steroidWeekChangeDirection = 'negative';
                } else if (steroidWeekChange == 0) {
                    steroidWeekChange = '-'+steroidWeekChange+'%';
                    steroidWeekChangeDirection = 'zero';
                } else if (isNaN(steroidWeekChange)) {
                    steroidWeekChange = null;
                    steroidWeekChangeDirection = 'none';
                }
            } else {
                steroidWeekChange = null;
                steroidWeekChangeDirection = 'none';
            }

            if (steroidMonthCountPrev > 0) {
                steroidMonthChange = ((steroidMonthCount - steroidMonthCountPrev) / steroidMonthCountPrev * 100).toFixed(0);

                // 문자열 생성
                if(steroidMonthChange > 0) {
                    steroidMonthChange = '▲'+steroidMonthChange+'%';
                    steroidMonthChangeDirection = 'positive';
                } else if (steroidMonthChange < 0) {
                    steroidMonthChange = '▼'+steroidMonthChange+'%';
                    steroidMonthChangeDirection = 'negative';
                } else if (steroidMonthChange == 0) {
                    steroidMonthChange = '-'+steroidMonthChange+'%';
                    steroidMonthChangeDirection = 'zero';
                } else if (isNaN(steroidMonthChange)) {
                    steroidMonthChange = null;
                    steroidMonthChangeDirection = 'none';
                }
            } else {
                steroidMonthChange = null;
                steroidMonthChangeDirection = 'none';
            }

            if (weekAvgPrev > 0) {
                weekAvgChange = ((weekAvg - weekAvgPrev) / weekAvgPrev * 100).toFixed(1);

                if(weekAvgChange > 0) {
                    weekAvgChange = '▲'+weekAvgChange+'%';
                    weekAvgChangeDirection = 'positive';
                } else if (weekAvgChange < 0) {
                    weekAvgChange = '▼'+weekAvgChange+'%';
                    weekAvgChangeDirection = 'negative';
                } else if (weekAvgChange == 0) {
                    weekAvgChange = '-'+weekAvgChange+'%';
                    weekAvgChangeDirection = 'zero';
                } else if (isNaN(weekAvgChange)) {
                    weekAvgChange = null;
                    weekAvgChangeDirection = 'none';
                }
            } else {
                weekAvgChange = null;
                weekAvgChangeDirection = 'none';
            }

            if (monthAvgPrev > 0) {
                monthAvgChange = ((monthAvg - monthAvgPrev) / monthAvgPrev * 100).toFixed(1);

                if(monthAvgChange > 0) {
                    monthAvgChange = '▲'+monthAvgChange+'%';
                    monthAvgChangeDirection = 'positive';
                } else if (monthAvgChange < 0) {
                    monthAvgChange = '▼'+monthAvgChange+'%';
                    monthAvgChangeDirection = 'negative';
                } else if (monthAvgChange == 0) {
                    monthAvgChange = '-'+monthAvgChange+'%';
                    monthAvgChangeDirection = 'zero';
                } else if (isNaN(monthAvgChange)) {
                    monthAvgChange = null;
                    monthAvgChangeDirection = 'none';
                }
            } else {
                monthAvgChange = null;
                monthAvgChangeDirection = 'none';
            }


            // let nextHospitalVisitDate = now + 1000*60*60*24*(Math.floor(Math.random()*3) + 1)
            let nextHospitalVisitDate = patient.next_hospital_visit_date
            // + 1000*60*60*24*(Math.floor(Math.random()*3) + 1) // 레코드에 있는 데이트 + 랜덤 일 수.
            let now = new Date().getTime();
            if ((nextHospitalVisitDate*1000) < now){ // DB stores time in seconds. * 1000 to get in milliseconds.
                nextHospitalVisitDate = null;
            }

            let now_b = new Date();
            let nowyear = now_b.getFullYear();
            let nowmonth = now_b.getMonth() + 1;
            let nowdate = now_b.getDate();
            let nowymd = nowyear*10000 + nowmonth*100 + nowdate;
            let birth;
            if (patient.birthday > 300000) { //1900년대생들
                birth = patient.birthday + 19000000;
            } else{
                birth = patient.birthday + 20000000;
            }
            let age1 = nowymd - birth;
            let age = (age1 - (age1%10000))/10000;
            console.log(patient.birthday, now_b, nowyear, nowmonth, nowdate, nowymd, birth, age1, age);

            let sex;
            if (patient.sex == '남성'){
                sex = 'M';
            } else if(patient.sex == '여성') {
                sex = 'F';
            }

            let patientinfo = {
                id: patient.id,
                name: patient.name,
                patient_code: patient.patient_code,
                doctor_code: patient.doctor_code,
                birthday: age,
                sex: sex,
                kakao_id: patient.kakao_id,
                encrypted_kakao_id: patient.encrypted_kakao_id,
                weekTakenRate: weekTakenRate,
                monthTakenRate: monthTakenRate,
                totalWeekCount: totalWeekCount,
                totalMonthCount : totalMonthCount,
                takenWeekCount : takenWeekCount,
                takenMonthCount : takenMonthCount,
                moistWeekCount : moistWeekCount,
                moistMonthCount : moistMonthCount,
                protopicWeekCount : protopicWeekCount,
                protopicMonthCount : protopicMonthCount,
                steroidWeekCount : steroidWeekCount,
                steroidMonthCount : steroidMonthCount,
                weekEmotionEmergencyCount: weekEmergencyMoodCount,
                monthEmotionEmergencyCount: monthEmergencyMoodCount,
                weekStandardDeviation: weekSd,
                monthStandardDeviation: monthSd,
                weekAverage: weekAvg,
                monthAverage: monthAvg,
                nextHospitalVisitDate: nextHospitalVisitDate,
                steroidWeekChange:steroidWeekChange,
                steroidMonthChange: steroidMonthChange,
                steroidWeekChangeDirection:steroidWeekChangeDirection,
                steroidMonthChangeDirection:steroidMonthChangeDirection,
                weekAvgChange:weekAvgChange,
                monthAvgChange:monthAvgChange,
                weekAvgChangeDirection:weekAvgChangeDirection,
                monthAvgChangeDirection:monthAvgChangeDirection
            };

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
    //const patientKakaoId = req.params.kakao_id;
    const patientEncryptedKakaoid = req.params.encrypted_kakao_id;

    let med_miss_reasons;
    let kakao_text_all;

    models.Patient.findOne({
        where: {
            encrypted_kakao_id: patientEncryptedKakaoid
        }
    }).then(patient => {

        if (!patient){
            return res.status(200).json({message: 'No patient found with given encrypted kakao_id.'})
        }

        const p1 = new Promise(function(resolve, reject) {
            models.Mood_check.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    type: 'itchy',
                    encrypted_kakao_id: patient.encrypted_kakao_id
                }
            }).then(mood => {
                if(mood) patient.mood_check = mood;
                resolve();
            });
        });

        const p2 = new Promise(function(resolve, reject) {
            models.Medicine_check.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    encrypted_kakao_id: patient.encrypted_kakao_id
                }
            }).then(check => {
                if(check) patient.medicine_check = check;
                resolve();
            });
        });

        const p3 = new Promise(function(resolve, reject) {
            models.Medicine_check.findAll({
                where: {
                    //kakao_id: req.params.kakao_id,
                    encrypted_kakao_id: req.params.encrypted_kakao_id,
                    //med_check: {[Op.ne]: 1}
                }
            }).then(med_checks => {
                //if (med_checks) {
                med_miss_reasons = med_checks;
                resolve();
                //}
                //resolve();
            }).catch(function (err){
                return res.status(500).json(err)
            })
        });

        const p4 = new Promise(function(resolve, reject) {
            models.Kakao_text.findAll({
                where: {
                    //kakao_id: req.params.kakao_id,
                    encrypted_kakao_id: req.params.encrypted_kakao_id,
                    share_doctor: 1,
                }
            }).then(kakao_texts => {
                //if (kakao_texts) {
                kakao_text_all = kakao_texts;
                resolve();
                //}
                //resolve();
            }).catch(function (err){
                return res.status(500).json(err)
            })
        });

        const p5 = new Promise(function(resolve, reject) {
            models.Patient_image.findAll({
                where: {
                    //kakao_id: patient.kakao_id
                    encrypted_kakao_id: patient.encrypted_kakao_id
                }
            }).then(image => {
                if(image) patient.patient_image = image;
                resolve()
            })
        })

        Promise.all([p1, p2, p3, p4, p5]).then(function(value) {
            let
                weekEmergencyMoodCount = 0,
                monthEmergencyMoodCount = 0,
                weekMoodChecks = [],
                weekMoodChecksPrev = [],
                monthMoodChecks = [],
                monthMoodChecksPrev = [];

            // ---------- Mood Check ------------ //

            for (let iterationCount in patient.mood_check){
                let moodCheck = patient.mood_check[iterationCount]['mood_check']
                let datetime = patient.mood_check[iterationCount]['time']

                // This code converts YYYY-MM-DD hh:mm:ss to YYYY/MM/DD hh:mm:ss that is easily parsed by Date constructor.
                let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.

                let nextDay = new Date();
                nextDay.setHours(23, 59, 59, 999);
                let nextDaytime = nextDay.getTime();


                let timeDifferenceInDays = (nextDaytime - jsDate) / 1000 / 60 / 60 /24

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    weekMoodChecks.push(moodCheck)
                    if (moodCheck <= -3){
                        weekEmergencyMoodCount += 1;
                    }
                }

                if ((7 <= timeDifferenceInDays) && (timeDifferenceInDays < 14)) { // 전 주의 가려움 기록
                    weekMoodChecksPrev.push(moodCheck);
                }

                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    monthMoodChecks.push(moodCheck)
                    if (moodCheck <= -3) {
                        monthEmergencyMoodCount += 1;
                    }
                }
                if ((30 <= timeDifferenceInDays) && (timeDifferenceInDays < 60)) { // 전 월의 가려움 기록
                    monthMoodChecksPrev.push(moodCheck);
                }
            }

            let weekAvg = average(weekMoodChecks).toFixed(1);
            let weekAvgPrev = average(weekMoodChecksPrev).toFixed(1);
            let weekAvgChange, weekAvgChangeDirection;
            let weekSd = standardDeviation(weekMoodChecks).toFixed(1);
            let monthAvg = average(monthMoodChecks).toFixed(1);
            let monthAvgPrev = average(monthMoodChecksPrev).toFixed(1);
            let monthAvgChange, monthAvgChangeDirection;
            let monthSd = standardDeviation(monthMoodChecks).toFixed(1);
            if (isNaN(weekAvg)) weekAvg = '-';
            if (isNaN(weekAvgPrev)) weekAvgPrev = null;
            if (isNaN(weekSd)) weekSd = null;
            if (isNaN(monthAvg)) monthAvg = '-';
            if (isNaN(monthAvgPrev)) monthAvgPrev = null;
            if (isNaN(monthSd)) monthSd = null;

            // ------------------- Medicine Check ------------------- //
            let totalWeekCount = 0;
            let totalMonthCount = 0;

            let takenWeekCount = 0;
            let takenMonthCount = 0;
            let moistWeekCount = 0;
            let moistMonthCount = 0;
            let moistWeekCountPrev = 0;
            let moistMonthCountPrev = 0;
            let moistWeekChange;
            let moistWeekChangeDirection;
            let moistMonthChange;
            let moistMonthChangeDirection;
            let protopicWeekCount = 0;
            let protopicMonthCount = 0;
            let protopicWeekCountPrev = 0;
            let protopicMonthCountPrev = 0;
            let protopicWeekChange;
            let protopicWeekChangeDirection;
            let protopicMonthChange;
            let protopicMonthChangeDirection;
            let steroidWeekCount = 0;
            let steroidMonthCount = 0;
            let steroidWeekCountPrev = 0;
            let steroidMonthCountPrev = 0;
            let steroidWeekChange;
            let steroidWeekChangeDirection;
            let steroidMonthChange;
            let steroidMonthChangeDirection;

            let recordDate = new Date().getTime();

            for (let iterationCount in patient.medicine_check){

                let medCheck = patient.medicine_check[iterationCount]['med_check']
                let datetime = patient.medicine_check[iterationCount]['time']
                let slot = patient.medicine_check[iterationCount]['slot']

                let jsDate = datetime*1000; // DB stores time in seconds. * 1000 to get in milliseconds.
                let nextDay = new Date();
                nextDay.setHours(23, 59, 59, 999);
                let nextDaytime = nextDay.getTime();

                let timeDifferenceInDays = (nextDaytime - jsDate) / 1000 / 60 / 60 /24

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if (medCheck >= 1){
                        takenWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if (medCheck >= 1){
                        takenMonthCount += medCheck;
                    }
                }

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if ((medCheck >= 1) && (slot === 0)){
                        moistWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if ((medCheck >= 1) && (slot === 0)){
                        moistMonthCount += medCheck;
                    }
                }

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if ((medCheck >= 1) && (slot === 1)){
                        protopicWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if ((medCheck >= 1) && (slot === 1)){
                        protopicMonthCount += medCheck;
                    }
                }

                if (timeDifferenceInDays < 7) { // record within 7 days of query
                    totalWeekCount += 1;
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidWeekCount += medCheck;
                    }
                }
                if (timeDifferenceInDays < 30) { // record within 30 days of query
                    totalMonthCount += 1;
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidMonthCount += medCheck;
                    }
                }
                if ((7 <= timeDifferenceInDays) && (timeDifferenceInDays < 14)) { // record query within last week
                    if ((medCheck >= 1) && (slot === 0)){
                        moistWeekCountPrev += medCheck;
                    }
                }

                if ((30 <= timeDifferenceInDays) && (timeDifferenceInDays < 60)) { // record query within last month
                    if ((medCheck >= 1) && (slot === 0)){
                        moistMonthCountPrev += medCheck;
                    }
                }
                if ((7 <= timeDifferenceInDays) && (timeDifferenceInDays < 14)) { // record query within last week
                    if ((medCheck >= 1) && (slot === 1)){
                        protopicWeekCountPrev += medCheck;
                    }
                }
                if ((30 <= timeDifferenceInDays) && (timeDifferenceInDays < 60)) { // record query within last month
                    if ((medCheck >= 1) && (slot === 1)){
                        protopicMonthCountPrev += medCheck;
                    }
                }

                if ((7 <= timeDifferenceInDays) && (timeDifferenceInDays < 14)) { // record query within last week
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidWeekCountPrev += medCheck;
                    }
                }

                if ((30 <= timeDifferenceInDays) && (timeDifferenceInDays < 60)) { // record query within last month
                    if ((medCheck >= 1) && (slot === 2)){
                        steroidMonthCountPrev += medCheck;
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
            // 보습제 사용횟수 증감률 계산
            if (moistWeekCountPrev > 0) {
                console.log("CountPrev Positive");
                moistWeekChange = ((moistWeekCount - moistWeekCountPrev) / moistWeekCountPrev * 100).toFixed(0);
                // 문자열 생성
                if(moistWeekChange > 0) {
                    moistWeekChange = '▲'+moistWeekChange+'%';
                    moistWeekChangeDirection = 'positive';
                } else if (moistWeekChange < 0) {
                    moistWeekChange = '▼'+moistWeekChange+'%';
                    moistWeekChangeDirection = 'negative';
                } else if (moistWeekChange == 0) {
                    moistWeekChange = '-'+moistWeekChange+'%';
                    moistWeekChangeDirection = 'zero';
                } else if (isNaN(moistWeekChange)) {
                    moistWeekChange = null;
                    moistWeekChangeDirection = 'none';
                }
            } else {
                moistWeekChange = null;
                moistWeekChangeDirection = 'none';
            }

            if (moistMonthCountPrev > 0) {
                moistMonthChange = ((moistMonthCount - moistMonthCountPrev) / moistMonthCountPrev * 100).toFixed(0);

                // 문자열 생성
                if(moistMonthChange > 0) {
                    moistMonthChange = '▲'+moistMonthChange+'%';
                    moistMonthChangeDirection = 'positive';
                } else if (moistMonthChange < 0) {
                    moistMonthChange = '▼'+moistMonthChange+'%';
                    moistMonthChangeDirection = 'negative';
                } else if (moistMonthChange == 0) {
                    moistMonthChange = '-'+moistMonthChange+'%';
                    moistMonthChangeDirection = 'zero';
                } else if (isNaN(moistMonthChange)) {
                    moistMonthChange = null;
                    moistMonthChangeDirection = 'none';
                }
            } else {
                moistMonthChange = null;
                moistMonthChangeDirection = 'none';
            }
            // 프로토픽 사용횟수 증감률 계산
            if (protopicWeekCountPrev > 0) {
                console.log("CountPrev Positive");
                protopicWeekChange = ((protopicWeekCount - protopicWeekCountPrev) / protopicWeekCountPrev * 100).toFixed(0);
                // 문자열 생성
                if(protopicWeekChange > 0) {
                    protopicWeekChange = '▲'+protopicWeekChange+'%';
                    protopicWeekChangeDirection = 'positive';
                } else if (protopicWeekChange < 0) {
                    protopicWeekChange = '▼'+protopicWeekChange+'%';
                    protopicWeekChangeDirection = 'negative';
                } else if (protopicWeekChange == 0) {
                    protopicWeekChange = '-'+protopicWeekChange+'%';
                    protopicWeekChangeDirection = 'zero';
                } else if (isNaN(protopicWeekChange)) {
                    protopicWeekChange = null;
                    protopicWeekChangeDirection = 'none';
                }
            } else {
                protopicWeekChange = null;
                protopicWeekChangeDirection = 'none';
            }

            if (protopicMonthCountPrev > 0) {
                protopicMonthChange = ((protopicMonthCount - protopicMonthCountPrev) / protopicMonthCountPrev * 100).toFixed(0);

                // 문자열 생성
                if(protopicMonthChange > 0) {
                    protopicMonthChange = '▲'+protopicMonthChange+'%';
                    protopicMonthChangeDirection = 'positive';
                } else if (protopicMonthChange < 0) {
                    protopicMonthChange = '▼'+protopicMonthChange+'%';
                    protopicMonthChangeDirection = 'negative';
                } else if (protopicMonthChange == 0) {
                    protopicMonthChange = '-'+protopicMonthChange+'%';
                    protopicMonthChangeDirection = 'zero';
                } else if (isNaN(protopicMonthChange)) {
                    protopicMonthChange = null;
                    protopicMonthChangeDirection = 'none';
                }
            } else {
                protopicMonthChange = null;
                protopicMonthChangeDirection = 'none';
            }
            // 스테로이드 사용횟수 증감률 계산
            if (steroidWeekCountPrev > 0) {
                console.log("CountPrev Positive");
                steroidWeekChange = ((steroidWeekCount - steroidWeekCountPrev) / steroidWeekCountPrev * 100).toFixed(0);
                // 문자열 생성
                if(steroidWeekChange > 0) {
                    steroidWeekChange = '▲'+steroidWeekChange+'%';
                    steroidWeekChangeDirection = 'positive';
                } else if (steroidWeekChange < 0) {
                    steroidWeekChange = '▼'+steroidWeekChange+'%';
                    steroidWeekChangeDirection = 'negative';
                } else if (steroidWeekChange == 0) {
                    steroidWeekChange = '-'+steroidWeekChange+'%';
                    steroidWeekChangeDirection = 'zero';
                } else if (isNaN(steroidWeekChange)) {
                    steroidWeekChange = null;
                    steroidWeekChangeDirection = 'none';
                }
            } else {
                steroidWeekChange = null;
                steroidWeekChangeDirection = 'none';
            }

            if (steroidMonthCountPrev > 0) {
                steroidMonthChange = ((steroidMonthCount - steroidMonthCountPrev) / steroidMonthCountPrev * 100).toFixed(0);

                // 문자열 생성
                if(steroidMonthChange > 0) {
                    steroidMonthChange = '▲'+steroidMonthChange+'%';
                    steroidMonthChangeDirection = 'positive';
                } else if (steroidMonthChange < 0) {
                    steroidMonthChange = '▼'+steroidMonthChange+'%';
                    steroidMonthChangeDirection = 'negative';
                } else if (steroidMonthChange == 0) {
                    steroidMonthChange = '-'+steroidMonthChange+'%';
                    steroidMonthChangeDirection = 'zero';
                } else if (isNaN(steroidMonthChange)) {
                    steroidMonthChange = null;
                    steroidMonthChangeDirection = 'none';
                }
            } else {
                steroidMonthChange = null;
                steroidMonthChangeDirection = 'none';
            }

            if (weekAvgPrev > 0) {
                weekAvgChange = ((weekAvg - weekAvgPrev) / weekAvgPrev * 100).toFixed(1);

                if(weekAvgChange > 0) {
                    weekAvgChange = '▲'+weekAvgChange+'%';
                    weekAvgChangeDirection = 'positive';
                } else if (weekAvgChange < 0) {
                    weekAvgChange = '▼'+weekAvgChange+'%';
                    weekAvgChangeDirection = 'negative';
                } else if (weekAvgChange == 0) {
                    weekAvgChange = '-'+weekAvgChange+'%';
                    weekAvgChangeDirection = 'zero';
                } else if (isNaN(weekAvgChange)) {
                    weekAvgChange = null;
                    weekAvgChangeDirection = 'none';
                }
            } else {
                weekAvgChange = null;
                weekAvgChangeDirection = 'none';
            }

            if (monthAvgPrev > 0) {
                monthAvgChange = ((monthAvg - monthAvgPrev) / monthAvgPrev * 100).toFixed(1);

                if(monthAvgChange > 0) {
                    monthAvgChange = '▲'+monthAvgChange+'%';
                    monthAvgChangeDirection = 'positive';
                } else if (monthAvgChange < 0) {
                    monthAvgChange = '▼'+monthAvgChange+'%';
                    monthAvgChangeDirection = 'negative';
                } else if (monthAvgChange == 0) {
                    monthAvgChange = '-'+monthAvgChange+'%';
                    monthAvgChangeDirection = 'zero';
                } else if (isNaN(monthAvgChange)) {
                    monthAvgChange = null;
                    monthAvgChangeDirection = 'none';
                }
            } else {
                monthAvgChange = null;
                monthAvgChangeDirection = 'none';
            }

        // let nextHospitalVisitDate = recordDate + 1000*60*60*24*(Math.floor(Math.random()*3) + 1) // 레코드에 있는 날짜 + 랜덤 일 수.
            let nextHospitalVisitDate = patient.next_hospital_visit_date;
            let now = new Date().getTime();
            if ((nextHospitalVisitDate*1000) < now){ // DB stores time in seconds. * 1000 to get in milliseconds.
                nextHospitalVisitDate = null;
            }

            let now_b = new Date();
            let nowyear = now_b.getFullYear();
            let nowmonth = now_b.getMonth() + 1;
            let nowdate = now_b.getDate();
            let nowymd = nowyear*10000 + nowmonth*100 + nowdate;
            let birth;
            if (patient.birthday > 300000) { //1900년대생들
                birth = patient.birthday + 19000000;
            } else{
                birth = patient.birthday + 20000000;
            }
            let age1 = nowymd - birth;
            let age = (age1 - (age1%10000))/10000;
            console.log(patient.birthday, now_b, nowyear, nowmonth, nowdate, nowymd, birth, age1, age);

            let sex;
            if (patient.sex == '남성'){
                sex = 'M';
            } else if (patient.sex == '여성') {
                sex = 'F';
            }

            let patientinfo = {
                id: patient.id,
                name: patient.name,
                patient_code: patient.patient_code,
                doctor_code: patient.doctor_code,
                birthday: age,
                sex: sex,
                kakao_id: patient.kakao_id,
                encrypted_kakao_id: patient.encrypted_kakao_id,
                weekTakenRate: weekTakenRate,
                monthTakenRate: monthTakenRate,
                totalWeekCount: totalWeekCount,
                totalMonthCount : totalMonthCount,
                takenWeekCount : takenWeekCount,
                takenMonthCount : takenMonthCount,
                moistWeekCount : moistWeekCount,
                moistMonthCount : moistMonthCount,
                protopicWeekCount : protopicWeekCount,
                protopicMonthCount : protopicMonthCount,
                steroidWeekCount : steroidWeekCount,
                steroidMonthCount : steroidMonthCount,
                weekEmotionEmergencyCount: weekEmergencyMoodCount,
                monthEmotionEmergencyCount: monthEmergencyMoodCount,
                weekStandardDeviation: weekSd,
                monthStandardDeviation: monthSd,
                weekAverage: weekAvg,
                monthAverage: monthAvg,
                nextHospitalVisitDate: nextHospitalVisitDate,
                med_check_reason: med_miss_reasons,
                moistWeekChange:moistWeekChange,
                moistMonthChange: moistMonthChange,
                moistWeekChangeDirection:moistWeekChangeDirection,
                moistMonthChangeDirection:moistMonthChangeDirection,
                protopicWeekChange:protopicWeekChange,
                protopicMonthChange: protopicMonthChange,
                protopicWeekChangeDirection:protopicWeekChangeDirection,
                protopicMonthChangeDirection:protopicMonthChangeDirection,
                steroidWeekChange:steroidWeekChange,
                steroidMonthChange: steroidMonthChange,
                steroidWeekChangeDirection:steroidWeekChangeDirection,
                steroidMonthChangeDirection:steroidMonthChangeDirection,
                weekAvgChange:weekAvgChange,
                monthAvgChange:monthAvgChange,
                weekAvgChangeDirection:weekAvgChangeDirection,
                monthAvgChangeDirection:monthAvgChangeDirection,
                patientInitials: patient.initials,
                kakao_text: kakao_text_all
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

// TODO : Promise로 가독성 확보
// TODO : 웹 대시보드에서 dashboard_personal과 chart페이지에서 호출하는 API 가 다른데 규격을 맞출 필요가 있음

function getPatientGraph (req, res){
    const encrypted_kakao_id = req.params.encrypted_kakao_id
    const startTime = req.params.start
    const endTime = req.params.end
    let startTimeDate = moment(startTime*1000).format('YYYY-MM-DD');
    let endTimeDate = moment(endTime*1000).format('YYYY-MM-DD');

    models.Patient.findOne({
        where: {
            encrypted_kakao_id: encrypted_kakao_id
        }
    }).then(patient => {
        if (!patient){
            return res.status(200).json({message: 'No patient found with given encrypted kakao_id.'})
        }
        models.Medicine_check.findAll({
            where: {
                encrypted_kakao_id: req.params.encrypted_kakao_id,
                time: {[Op.lt]: endTime,
                    [Op.gt]: startTime},
            }
        }).then(med_checks => {
            models.Mood_check.findAll({
                where: {
                    encrypted_kakao_id: req.params.encrypted_kakao_id,
                    time: {[Op.lt]: endTime,
                        [Op.gt]: startTime},
                }
            }).then(mood_checks => {
                models.Medicine_time.findAll({
                    where: {
                        encrypted_kakao_id: req.params.encrypted_kakao_id,
                    }
                }).then(med_times => {
                    models.Weather.findAll({
                        date: {[Op.lt]: endTimeDate,
                            [Op.gt]: startTimeDate},

                    }).then(dusts => {
                        dusts.forEach(function (result, i) {
                            let convertedDate = moment(result.date).valueOf();
                            dusts[i] = {
                                "date": convertedDate,
                                "pm10": result.pm10,
                                "pm25": result.pm25
                            };
                        });
                        return res.status(200).json({
                            success: true,
                            medicine_checks: med_checks,
                            mood_checks: mood_checks,
                            medicine_times: med_times,
                            dust: dusts
                        });
                    })
                })
            })
        })
    }).catch(function (err){
        return res.status(500).json(err)
    })
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
            encrypted_kakao_id: req.params.encrypted_kakao_id,
            //med_check: {[Op.ne]: 1}
        }
    }).then(med_checks => {
        //if (!med_checks) {
        //    return res.status(404).json({error: 'No missed medicine checks associated with encrypted_kakao_id: ' + req.params.encrypted_kakao_id});
        //}
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
    let encrypted_kakao_id = req.body.encrypted_kakao_id;
    let patientName = req.body.patientName;
    models.Patient.update({
        registered: 1,
        fullname:patientName// What to update
    }, {
        where: {encrypted_kakao_id: encrypted_kakao_id} // Condition
    }).then(result => {
        console.log('result: ' + result.toString())
        if (result[0] === 1){ // result[0] stores the number of affected rows.
            return res.status(200).json({success: true, message: 'Update complete. Result: ' + result.toString()})
        } else {
            return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given encrypted_kakao_id. ' +
                'It is possible the patient is already registered. Result: ' + result.toString()})
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
    })
}

function declinePatient(req, res){
    let encrypted_kakao_id = req.body.encrypted_kakao_id
    models.Patient.update({
        registered: 2 // What to update
    }, {
        where: {encrypted_kakao_id: encrypted_kakao_id} // Condition
    }).then(result => {
        console.log('result: ' + result.toString())
        if (result[0] === 1){ // result[0] stores the number of affected rows.
            return res.status(200).json({success: true, message: 'Update complete. Result: ' + result.toString()})
        } else {
            return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given encrypted_kakao_id. Result: ' + result.toString()})
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
    })
}

function getMedicineCheck (req, res){

    const encrypted_kakao_id = req.params.encrypted_kakao_id;
    const startTime = req.params.start;
    const endTime = req.params.end;
    let startTimeDate = moment(startTime*1000).format('YYYY-MM-DD');
    let endTimeDate = moment(endTime*1000).format('YYYY-MM-DD');

    // 약복용 불러오기
    const p1 = new Promise(function(resolve, reject) {
        models.Medicine_check.findAll({
            where: {
                encrypted_kakao_id: encrypted_kakao_id,
                date: {[Op.lt]: endTime,
                    [Op.gt]: startTime},
            }
        }).then(med_checks => {
            if (!med_checks) {
                reject('No missed medicine checks associated with encrypted_kakao_id: ' + req.params.encrypted_kakao_id);
            }
            resolve(med_checks);
        }).catch(function (err){
            reject(err);
        })
    });

    // 미세먼지 불러오기
    const p2 = new Promise(function(resolve, reject) {
        models.Weather.findAll({
            date: {[Op.lt]: endTimeDate,
                [Op.gt]: startTimeDate},

        }).then(results => {
            if (!results) {
                reject('No dust information found ');
            } else {
                results.forEach(function (result,i) {
                    let convertedDate = moment(result.date).valueOf();
                    results[i] = {
                        "date": convertedDate,
                        "pm10": result.pm10,
                        "pm25": result.pm25
                    };
                });
                resolve(results);
            }
        }).catch(function (err){
            reject(err);
        })
    });

    Promise.all([p1, p2]).then(value => {
        res.status(200).json({success: true, medicine_checks: value[0], dust: value[1]});
    }).catch(err => {
        logger.error("Promise Error : ",JSON.stringify(err,null,2));
        res.status(500).json({error:err});
    });
}

function getMoodCheck (req, res){
    const startTime = req.params.start
    const endTime = req.params.end

    models.Mood_check.findAll({
        where: {
            encrypted_kakao_id: req.params.encrypted_kakao_id,
            time: {[Op.lt]: endTime,
                [Op.gt]: startTime},
        }
    }).then(mood_checks => {
        if (!mood_checks) {
            return res.status(404).json({error: 'No missed mood checks associated with encrypted_kakao_id: ' + req.params.encrypted_kakao_id});
        }
        return res.status(200).json({success: true, mood_checks: mood_checks})
    }).catch(function (err){
        return res.status(500).json(err)
    })
}

function getPatientImage (req, res){
    const startTime = req.params.start
    const endTime = req.params.end

    models.Patient_image.findAll({
        where: {
            encrypted_kakao_id: req.params.encrypted_kakao_id,
            time: {[Op.lt]: endTime,
                [Op.gt]: startTime},
        }
    }).then(patient_images => {
        if (!patient_images) {
            return res.status(404).json({error: 'No missed images associated with encrypted_kakao_id: ' + req.params.encrypted_kakao_id});
        }
        return res.status(200).json({success: true, patient_images: patient_images})
    }).catch(function (err){
        return res.status(500).json(err)
    })
}

function getPatientMedicineTime (req, res){
    const encrypted_kakao_id = req.params.encrypted_kakao_id

    models.Medicine_time.findAll({
        where: {
            encrypted_kakao_id: req.params.encrypted_kakao_id,
        }
    }).then(med_times => {
        if (!med_times) {
            return res.status(404).json({error: 'No medicine times associated with encrypted_kakao_id: ' + req.params.encrypted_kakao_id});
        }
        return res.status(200).json({success: true, medicine_times: med_times});
    }).catch(function (err){
        return res.status(500).json(err)
    })
}


// Date 는 unixtime in seconds 한국시간.
function createNextPatientVisitDate (req, res) {
    // Input Parameters
    let encrypted_kakao_id, date;
    let now = new Date().getTime();
    if ((req.body.encrypted_kakao_id !== undefined) && (req.body.date !== undefined)){
        encrypted_kakao_id = req.body.encrypted_kakao_id.toString().trim() || '';
        date = req.body.date.toString().trim() || '';
    } else {
        return res.status(403).json({success: false, message: 'Parameters not properly given. Check parameter names (encrypted_kakao_id, date).',
            encrypted_kakao_id: req.body.encrypted_kakao_id, date: req.body.date})
    }

    models.Patient.update({
        next_hospital_visit_date: date // What to update
    }, {
        where: {
            encrypted_kakao_id: encrypted_kakao_id
        } // Condition
    }).then(result => {
        console.log('result: ' + result.toString())
        if (result[0] === 1){ // result[0] stores the number of affected rows.
            return res.status(200).json({success: true, message: 'Update complete. Result: ' + result.toString()})
        } else {
            return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given encrypted_kakao_id. ' +
                'It is possible the patient is already registered. Result: ' + result.toString()})
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
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
    getPatientImage: getPatientImage,
    getPatientMedicineTime: getPatientMedicineTime,
    createNextPatientVisitDate: createNextPatientVisitDate,
    getPatientGraph: getPatientGraph,

};