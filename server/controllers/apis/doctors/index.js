'use strict';

const
	express = require('express'),
	doctorService = require('../../../services/doctors'),
	// passport = require('passport'),
	// flash = require('connect-flash')

let router = express.Router();

// router.use(passport.initialize());
// router.use(passport.session());
// router.use(flash());

router.get('/', doctorService.getDoctors);

router.post('/authenticate', doctorService.authenticate);
// router.post('/register', passport.authenticate('local'), doctorService.registerDoctor);
router.post('/register', doctorService.registerDoctor);
router.post('/login', doctorService.login);


// TODO: 데모용 API 들.
router.get('/get_patients/:doctor_code', doctorService.getPatients);
router.get('/get_patient_info/:kakaoid', doctorService.getPatientInfo);
router.get('/get_patient_info_summary/:kakaoid', doctorService.getPatientInfoSummary);


router.use(doctorService.verifyToken);
// ^middleware: APIs below this line needs to verify token.

router.get('/logout', doctorService.logout);
router.get('/dashboard', doctorService.dashboard);
router.get('/menus', doctorService.menus);
router.get('/user', doctorService.user);
router.get('/patient/:id', doctorService.patientInfo);
router.get('/add_patient', doctorService.addPatient);




// router.get('/:id', doctorService.getUserWithId);

module.exports = router;
