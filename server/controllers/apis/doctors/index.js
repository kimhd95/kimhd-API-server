'use strict';

const
	express = require('express'),
	doctorService = require('../../../services/doctors'),
	authService = require('../../../services/doctors/auth.js');

let router = express.Router()

// Authentication related Doctor APIs.
// Check if token is verified. Used for Login Page redirect on client side web dashboard.
router.post('/verify_token', authService.verifyToken)
router.post('/register', authService.registerDoctor)
router.post('/login', authService.loginDoctor)
router.get('/logout', authService.logoutDoctor)
router.post('/email_duplicate_check', authService.doctorEmailDuplicateCheck)

// Check if token is verified. Used for Login Page redirect on client side web dashboard.
router.use(authService.checkTokenVerified)

// TODO: The below APIs do not follow the convention of making use of POST GET PUT DELETE for API design.
// For example, router.post('update_password') can be changed to router.put('/password')
router.post('/update_password', authService.updatePassword)
// Above /update_password API changed from PUT -> POST because client side web dashboard AJAX call does not send cookie with PUT method requests.
// 2018-01-17 14:57 API Design change requested by Hyewon
router.post('/update_hospital', authService.updateHospital)
router.post('/delete_doctor', authService.deleteDoctor)

router.get('/get_patients/:doctor_code', doctorService.getPatients)
router.get('/get_patients_registered/:doctor_code', doctorService.getPatientsRegistered)
router.get('/get_patients_to_add/:doctor_code', doctorService.getPatientsToAdd)
router.get('/get_patient_info/:kakao_id', doctorService.getPatientInfo)
router.get('/get_patient_info_all/:kakao_id', doctorService.getPatientInfoAll)
router.get('/get_patient_info_summary/:kakao_id', doctorService.getPatientInfoSummary)
router.get('/get_patient_med_miss_reason/:kakao_id', doctorService.getPatientMedMissReason)

router.get('/get_medicine_check/:kakao_id/:start/:end', doctorService.getMedicineCheck)
router.get('/get_mood_check/:kakao_id/:start/:end', doctorService.getMoodCheck)

router.post('/register_patient', doctorService.registerPatient)
router.post('/decline_patient', doctorService.declinePatient)

router.get('/get_patient_medicine_time/:kakao_id', doctorService.getPatientMedicineTime)

// Not used yet.
router.get('/add_patient', doctorService.addPatient)

module.exports = router
