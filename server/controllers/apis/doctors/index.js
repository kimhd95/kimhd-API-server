'use strict';

const
	express = require('express'),
	doctorService = require('../../../services/doctors'),
	authService = require('../../../services/doctors/auth.js');

let router = express.Router();

// Authentication related Doctor APIs.
router.get('/verifyToken', authService.verifyToken)
router.post('/register', authService.registerDoctor);
router.post('/login', authService.loginDoctor);
router.get('/logout', authService.logoutDoctor);
router.get('/emailDuplicateCheck', authService.doctorEmailDuplicateCheck);

// AUTHENTICATE HERE: APIs below this line needs to verify token. "req.decoded" variable is updated.
router.use(authService.verifyToken);
// Check if token is verified. Used for Home Page redirect on client side web dashboard.
router.get('/tokenVerified', authService.checkTokenVerified)

router.get('/get_patients/:doctor_code', doctorService.getPatients);
router.get('/get_patients_to_add/:doctor_code', doctorService.getPatientsToAdd);
router.get('/get_patient_info/:kakaoid', doctorService.getPatientInfo);
router.get('/get_patient_info_summary/:kakaoid', doctorService.getPatientInfoSummary);

// Not used yet.
router.get('/add_patient', doctorService.addPatient);

module.exports = router;
