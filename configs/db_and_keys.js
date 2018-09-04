const productionKeys = require('./production_keys')

const environments = {
	local: {
		mysql: {
            host: 'dev-food.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
            username: 'jellyfood',
			password: 'jelly2018db',
            database: 'DEV_FOOD',
            logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	dev: {
		mysql: {
            host: 'dev-food.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
            username: 'jellyfood',
            password: 'jelly2018db',
            database: 'DEV_FOOD',
            logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	//todo: stage server ??
	stage: {
		mysql: {
			host: 'stage-dermatology.cgrre2ngqldq.ap-northeast-2.rds.amazonaws.com',
			username: 'jellyderma',
			password: 'jelly2018db',
			database: 'DERMATOLOGY_STAGE',
			logging: console.log
		},
		apikey: '9Y3-7bE-Ud3-7Ja',
		jwt_secret: "9Y3-7bE-Ud3-7Ja"
	},
	production: {
		mysql: {
			host: productionKeys.prodDBHost,
			username: productionKeys.prodDBUserName,
			password: productionKeys.prodDBKey,
			database: productionKeys.prodDBDatabase,
			logging: console.log
		},
		apikey: productionKeys.prodAPIKey,
		jwt_secret: productionKeys.prodJWTKey
	}
}

const nodeEnv = process.env.NODE_ENV || 'local';
module.exports = environments[nodeEnv];
