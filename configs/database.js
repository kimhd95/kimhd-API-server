const environments = {
	development: {
		mysql: {
			host: 'jellylab.ckcwofwuujy2.ap-northeast-2.rds.amazonaws.com',
			username: 'jellylab',
			password: 'p3n-68E-pZX-hWL',
			database: 'jellylab',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	test: {
		mysql: {
			host: 'jellylab.ckcwofwuujy2.ap-northeast-2.rds.amazonaws.com',
			username: 'jellylab',
			password: 'p3n-68E-pZX-hWL',
			database: 'jellylab',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	production: {
	}
}

const nodeEnv = process.env.NODE_ENV || 'development';
module.exports = environments[nodeEnv];