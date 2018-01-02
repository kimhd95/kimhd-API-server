'use strict';

const
	express = require('express'),
	doctorService = require('../../../services/doctors'),
	passport = require('passport'),
	flash = require('connect-flash')

let router = express.Router();

// router.use(passport.initialize());
// router.use(passport.session());
// router.use(flash());

router.get('/', doctorService.getDoctors);

router.post('/authenticate', doctorService.authenticate);

router.post('/register', passport.authenticate('local'), doctorService.registerDoctor);
router.post('/login', doctorService.login);

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