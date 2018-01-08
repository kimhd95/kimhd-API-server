'use strict';

const
	express = require('express'),
	bodyParser = require('body-parser'),
	expressHandlebars = require('express-handlebars'),
	syncDatabase = require('./database'),
	passport = require('passport'),
	flash = require('connect-flash'),
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

		//--------------- View Part ------------------ //

		server.set('viewDir', config.viewDir);

		// use morgan to log requests to the console
		server.use(morgan('dev'));

		// Setup view engine
		server.engine('.hbs', expressHandlebars({
			defaultLayout: 'default',
			layoutsDir: config.viewDir + '/layouts',
			extname: '.hbs'
		}));
		server.set('views', server.get('viewDir'));
		server.set('view engine', '.hbs');

		//-------------------------------------------- //

		// Returns middleware that parses json
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: false }));

		//
		//
		// //===== Passport 사용 설정 =====//
		// // Passport의 세션을 사용할 때는 그 전에 Express의 세션을 사용하는 코드가 있어야 함
		// server.use(passport.initialize());
		// server.use(passport.session());
		// server.use(flash());
		//
		// //라우팅 정보를 읽어들여 라우팅 설정
		// var router = express.Router();
		//
		// // 패스포트 설정
		// var configPassport = require('./../configs/passport');
		// configPassport(server, passport);
		//
		// // 패스포트 라우팅 설정
		// var userPassport = require('./routes/user_passport');
		// userPassport(router, passport);

		// Set up routes
		routes.init(server);
	};

	start = function() {
		let hostname = server.get('hostname'),
			port = server.get('port');

		server.listen(process.env.PORT || server.get('port'), function (){
			console.log('Express server listening on - http://' + hostname + ':' + port);
			console.log(process.env.PORT || 3000);

			syncDatabase().then(() => {
				console.log('Database sync');
			})
		})
	};

	return {
		create: create,
		start: start
	};
};

