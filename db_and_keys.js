const environments = {
	local: {
		mysql: {
			host: 'dev-jellylab-database-nodered.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
			username: 'jellylab',
			password: 'jellylab',
			database: 'Dev_Jellylab_DB_NodeRed',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	dev: {
		mysql: {
			host: 'dev-jellylab-database-nodered.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
			username: 'jellylab',
			password: 'jellylab',
			database: 'Dev_Jellylab_DB_NodeRed',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	qa: {
		mysql: {
			host: '<QA DB SERVER HOST HERE>',
			username: 'jellylab',
			password: '<QA PASSWORD HERE>',
			database: '<QA DB SERVER DB NAME HERE>',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	production: {
		mysql: {
			host: '<FILL IN HOST MANUALLY.>',
			username: '<FILL IN USERNAME MANUALLY>',
			password: '<FILL IN PASSWORD MANUALLY.>',
			database: '<FILL IN DB NAME MANUALLY>',
			logging: console.log
		},
		apikey: '<FILL IN API KEY MANUALLY>',
		jwt_secret: "<FILL IN JWT SECRET KEY MANUALLY>"
	}
}

const nodeEnv = process.env.NODE_ENV || 'local';
module.exports = environments[nodeEnv];
