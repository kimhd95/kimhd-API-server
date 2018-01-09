'use strict';

const
	express = require('express'),
	bodyParser = require('body-parser'),
	syncDatabase = require('./database'),
	morgan = require('morgan'),
	cors = require('cors')

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

		// let whitelist = ['http://localhost', 'http://121.', 'http://175.', 'http://121.140.205.189']
		// let corsOptions = {
		// 	origin: function (origin, callback) {
		// 		if (whitelist.indexOf(origin) !== -1) {
		// 			callback(null, true)
		// 		} else {
		// 			callback(new Error('Not allowed by CORS'))
		// 		}
		// 	}
		// }
		//
		// server.use(cors(corsOptions))

		// Enable CORS
		server.use(function(req, res, next) {

			// let allowedOrigins = ['localhost:4000', "http://121.",  "http://175.", "http://121.140.205.189"];
			// let origin = req.headers.origin;
			// if(allowedOrigins.indexOf(origin) > -1){
			// 	res.setHeader('Access-Control-Allow-Origin', origin);
			// }

			// res.header("Access-Control-Allow-Origin", "*");
			// TODO: ADD WEB APP ADDRESS IN PRODUCTION.
			// res.header('Access-Control-Allow-Origin', 'http://localhost');
			// res.header('Access-Control-Allow-Origin', ['http://localhost:4000', 'http://localhost:2000']);
			res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
			res.header("Access-Control-Allow-Credentials", true);
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie");
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

