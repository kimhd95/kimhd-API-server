'use strict';

const
	express = require('express'),
	doctorService = require('../../../services/doctors'),
	authService = require('../../../services/doctors/auth.js');

let router = express.Router();

// Authentication related Doctor APIs.
router.post('/verifyToken', authService.verifyToken)
router.post('/register', authService.registerDoctor);
router.post('/login', authService.loginDoctor);
router.get('/logout', authService.logoutDoctor);
router.post('/emailDuplicateCheck', authService.doctorEmailDuplicateCheck);

// AUTHENTICATE HERE: APIs below this line needs to verify token. "req.decoded" variable is updated.
// Check if token is verified. Used for Home Page redirect on client side web dashboard.
router.get('/tokenVerified', authService.checkTokenVerified)
router.get('/get_patients/:doctor_code', doctorService.getPatients);
router.get('/get_patients_registered/:doctor_code', doctorService.getPatientsRegistered);
router.get('/get_patients_to_add/:doctor_code', doctorService.getPatientsToAdd);
router.get('/get_patient_info/:kakao_id', doctorService.getPatientInfo);
router.get('/get_patient_info_all/:kakao_id', doctorService.getPatientInfoAll);
router.get('/get_patient_info_summary/:kakao_id', doctorService.getPatientInfoSummary);
router.get('/get_patient_med_miss_reason/:kakao_id', doctorService.getPatientMedMissReason);

router.post('/register_patient', doctorService.registerPatient);
router.post('/decline_patient', doctorService.declinePatient);


// 나중에 풀기.
// router.use(authService.verifyToken);

// Not used yet.
router.get('/add_patient', doctorService.addPatient);

module.exports = router;
