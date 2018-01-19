'use strict';

const
	express = require('express'),
	doctorsController = require('../../../controllers/apis/doctors'),
	patientsController = require('../../../controllers/apis/patients');

let router = express.Router();

router.use('/doctors', doctorsController)
router.use('/patients', patientsController)

module.exports = router
