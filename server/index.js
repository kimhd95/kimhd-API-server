'use strict';
//var logger = require('./config/winston.js');
const
	express = require('express'),
	bodyParser = require('body-parser'),
	syncDatabase = require('./database'),
	morgan = require('morgan');

//const batch = require('./services/batch');

module.exports = function() {
	let
		server = express(),
		create,
		start;

	create = function(config) {
		let routes = require('./routes')

		// Server settings
		server.set('env', config.env)
		server.set('port', config.port)
		server.set('token_domain', config.token_domain)
		server.set('jwt_secret', config.jwt_secret) // secret variable

		// Enable CORS
		server.use(function(req, res, next) {
			// Make sure web app client program use :4000 for its port to make use of the token related APIs.
            let allowedOrigins = [
                'http://localhost:8000',
                'http://localhost:8001',
                'http://localhost:8010',
                'http://localhost:8011',
                'http://devpsy.jellylab.io',
                'http://devatopy.jellylab.io',
                'https://psy.jellylab.io',
                'https://atopy.jellylab.io'
            ];
			if (req.headers !== undefined){
				let origin = req.headers.origin || ''
				if(allowedOrigins.indexOf(origin) > -1){
					res.header('Access-Control-Allow-Origin', origin)
				} else {
					res.header('Access-Control-Allow-Origin', '*')
				}
				res.setHeader('log-origin', origin)
			}

			res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
			res.header("Access-Control-Allow-Credentials", true)
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Set-Cookie")
			next()
		})

		// -------------- Forward HTTP to HTTPS ---------- //
		if (config.env === 'local' || config.env === 'dev') {
			server.use(morgan('dev'))
		} else {
			server.enable('trust proxy')
			server.use(function (req, res, next) {
				if (req.secure) {
					next();
				} else {
					res.redirect('https://' + req.headers.host + req.url)
				}
			})
			server.set('trust proxy', 1)
		}

		// Returns middleware that parses json
		server.use(bodyParser.json())
		server.use(bodyParser.urlencoded({ extended: false }))

		// Set up routes
		routes.init(server)
	}

	start = function(){
		server.listen(process.env.PORT || server.get('port'), function (){
            console.log('Environment: ' + server.get('env') + ', Express server listening on: ' + (process.env.PORT || server.get('port') || 5000))
            syncDatabase().then(() => {console.log('Database Sync Complete')})
        })
    }


	return {
		create: create,
		start: start
	}
}

