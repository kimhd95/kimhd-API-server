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
router.post('/register', patientService.register);
router.post('/medicine_time', patientService.medicineTime);
router.post('/medicine_miss', patientService.medicineMiss);
router.post('/medicine_side', patientService.medicineSide);
router.post('/medicine_check', patientService.medicineCheck);
router.post('/kakao_text', patientService.kakaoText);
router.post('/interview_time', patientService.interviewTime);
router.post('/interview_check', patientService.interviewCheck);
router.post('/mood_check', patientService.moodCheck);

module.exports = router;