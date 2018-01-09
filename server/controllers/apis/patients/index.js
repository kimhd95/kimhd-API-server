'use strict';

const
	express = require('express'),
	patientService = require('../../../services/patients'),
	models = require('../../../models');

let router = express.Router();


router.get('/get_patients', patientService.getPatients);
router.get('/:id', patientService.getPatientWithId);


router.use('/*', models.verifyAPIKEY);
// ^Middleware. Make sure to put all the routes which needs authentication below this middleware.

router.post('/register_kakao_id', patientService.registerKakaoId);
router.post('/register_doctor_code', patientService.registerDoctorCode);
router.post('/kakao_text', patientService.kakaoText);
router.post('/medicine_check', patientService.medicineCheck);
router.post('/medicine_check_miss_reason', patientService.medicineCheckMissReason);
router.post('/medicine_check_med_side', patientService.medicineCheckMedSide);
router.post('/medicine_check_med_side_degree', patientService.medicineCheckMedSideDegree);

router.post('/mood_check', patientService.moodCheck);
router.post('/mood_check_reason', patientService.moodCheckReason);

// router.post('/medicine_time', patientService.medicineTime);
// router.post('/medicine_miss', patientService.medicineMiss);
// router.post('/medicine_side', patientService.medicineSide);
// router.post('/interview_time', patientService.interviewTime);
// router.post('/interview_check', patientService.interviewCheck);

module.exports = router;
