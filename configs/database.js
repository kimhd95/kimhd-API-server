const environments = {
	dev: {
		mysql: {
			// host: 'jellylab.ckcwofwuujy2.ap-northeast-2.rds.amazonaws.com',
			// username: 'jellylab',
			// password: 'p3n-68E-pZX-hWL',
			// database: 'jellylab',
			host: 'dev-jellylab-database-nodered.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
			username: 'jellylab',
			password: 'jellylab',
			database: 'Dev_Jellylab_DB_NodeRed',
			// host: '10.33.44.128', // NCP
			// username: 'jellylab',
			// password: '!@jelly2018',
			// database: 'Jellylab',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	// test: {
	// 	mysql: {
	// 		host: 'dev-jellylab-database-nodered.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
	// 		username: 'jellylab',
	// 		password: 'jellylab',
	// 		database: 'Dev_Jellylab_DB_NodeRed',
	// 		logging: console.log
	// 	},
	// 	apikey: '9Y3-7bE-Ud3-7Ja',
	// 	jwt_secret: "9Y3-7bE-Ud3-7Ja"
	// },
	production: {
		mysql: {
			host: 'dev-jellylab-database-nodered.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
			username: 'jellylab',
			password: 'jellylab',
			database: 'Dev_Jellylab_DB_NodeRed',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	}
}

const nodeEnv = process.env.NODE_ENV || 'dev';
module.exports = environments[nodeEnv];
