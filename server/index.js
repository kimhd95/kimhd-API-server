'use strict';

const
	express = require('express'),
	bodyParser = require('body-parser'),
	syncDatabase = require('./database'),
	morgan = require('morgan')

module.exports = function() {
	let server = express(),
		create,
		start;

	create = function(config) {
		let routes = require('./routes');

		// Server settings
		server.set('env', config.env);
		server.set('port', config.port);
		server.set('hostname', config.hostname);
		server.set('jwt_secret', config.jwt_secret); // secret variable

		// Enable CORS
		server.use(function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			next();
		});

		// use morgan to log requests to the console
		server.use(morgan('dev'));

		// Returns middleware that parses json
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: false }));

		// Set up routes
		routes.init(server);
	};

	start = function() {
		let
			hostname = server.get('hostname'),
			port = server.get('port');
		server.listen(process.env.PORT || port, function (){
			console.log('Express server listening on - http://' + hostname + ':' + port);
			console.log(process.env.PORT || server.get('port') || 3000);
			syncDatabase().then(() => {console.log('Database sync');})
		})
	};

	return {
		create: create,
		start: start
	};
};

