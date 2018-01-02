'use strict';

const
	_ = require('lodash'),
	env = process.env.NODE_ENV || 'local',
	envConfig = require('./' + env),
	databaseConfig = require('./database');

let defaultConfig = {
	env: env,
	server_port: 8081
};

module.exports = _.merge(defaultConfig, envConfig, databaseConfig);
