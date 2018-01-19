'use strict';

const
	_ = require('lodash'),
	env = process.env.NODE_ENV || 'local',
	envConfig = require('./' + env),
	databaseConfig = require('./database');

module.exports = _.merge(envConfig, databaseConfig);
