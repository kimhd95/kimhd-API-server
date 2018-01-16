'use strict';

const
	express = require('express'),
	doctorService = require('../../../services/doctors'),
	authService = require('../../../services/doctors/auth.js');

let router = express.Router()

// Authentication related Doctor APIs.
router.post('/verify_token', authService.verifyToken)
router.post('/register', authService.registerDoctor)
router.post('/login', authService.loginDoctor)
router.get('/logout', authService.logoutDoctor)
router.post('/email_duplicate_check', authService.doctorEmailDuplicateCheck)

// AUTHENTICATE HERE: APIs below this line needs to verify token. "req.decoded" variable is updated.
router.use(authService.checkTokenVerified)

// Check if token is verified. Used for Login Page redirect on client side web dashboard.
router.put('/update_password', authService.updatePassword)
router.delete('/delete_doctor', authService.deleteDoctor)

router.get('/get_patients/:doctor_code', doctorService.getPatients)
router.get('/get_patients_registered/:doctor_code', doctorService.getPatientsRegistered)
router.get('/get_patients_to_add/:doctor_code', doctorService.getPatientsToAdd)
router.get('/get_patient_info/:kakao_id', doctorService.getPatientInfo)
router.get('/get_patient_info_all/:kakao_id', doctorService.getPatientInfoAll)
router.get('/get_patient_info_summary/:kakao_id', doctorService.getPatientInfoSummary)
router.get('/get_patient_med_miss_reason/:kakao_id', doctorService.getPatientMedMissReason)

router.post('/register_patient', doctorService.registerPatient)
router.post('/decline_patient', doctorService.declinePatient)

// Not used yet.
router.get('/add_patient', doctorService.addPatient)

module.exports = router
