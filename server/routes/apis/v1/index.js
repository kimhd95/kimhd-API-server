'use strict';

const
	express = require('express'),
	doctorsController = require('../../../controllers/apis/doctors'),
	usersController = require('../../../controllers/apis/users');

let router = express.Router();

router.use('/doctors', doctorsController) // Doctor Dashboard Web App
router.use('/users', usersController) // Chatbot Server

module.exports = router
