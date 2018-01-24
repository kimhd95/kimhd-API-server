'use strict';

const
	express = require('express'),
	doctorsController = require('../../../controllers/apis/doctors'),
	patientsController = require('../../../controllers/apis/patients');

let router = express.Router();

router.use('/doctors', doctorsController) // Doctor Dashboard Web App
router.use('/patients', patientsController) // Chatbot Server

module.exports = router
