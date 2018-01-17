const Sequelize = require('sequelize');
const config = require('../../configs')

const verifyAPIKEY = (req, res, next) => {

	if(!req.body.apikey) {
		console.log(req.body.apikey);
		return res.status(400).send('API key not given.');
	}

	console.log(req.body);
	const apikey = req.body.apikey.toString().trim() || '';
	if(apikey!=config.apikey)
		return res.status(400).send('API key is invalid.');

	next();
}

const sequelize = new Sequelize(
	config.mysql.database,
	config.mysql.username,
	config.mysql.password, {
		logging: config.mysql.logging,
		host: config.mysql.host,
		dialect: 'mysql',

		define: {
			// don't add the timestamp attributes (updatedAt, createdAt)
			timestamps: false,

			// don't delete database entries but set the newly added attribute deletedAt
			// to the current date (when deletion was done). paranoid will only work if
			// timestamps are enabled
			paranoid: false,

			// don't use camelcase for automatically added attributes but underscore style
			// so updatedAt will be updated_at
			underscored: true,

			// disable the modification of tablenames; By default, sequelize will automatically
			// transform all passed model names (first parameter of define) into plural.
			// if you don't want that, set the following
			freezeTableName: false,
		}

	}

);

const Patient = sequelize.define('patient', {
	name: Sequelize.STRING,
	fullname: Sequelize.STRING,
	patient_email: Sequelize.STRING,
	patient_password: Sequelize.STRING,
	kakao_id: { type: Sequelize.STRING, allowNull: false, unique: true },
	doctor_code: Sequelize.STRING,
	registered: Sequelize.STRING,
	phone: Sequelize.STRING,
	sex: Sequelize.STRING,
	birthday: { type: Sequelize.INTEGER },

	// medicine_side: Sequelize.STRING,

	created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});


const PatientLog = sequelize.define('patient_log', {
	kakao_id: { type: Sequelize.STRING, allowNull: false},
	scenario: Sequelize.STRING,
	state: Sequelize.STRING,
	content: Sequelize.STRING,
	date: Sequelize.STRING,
	type: Sequelize.STRING,

	created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});


const Doctor = sequelize.define('doctor', {
	doctor_code: { type: Sequelize.STRING, allowNull: false, unique: true },
	email:Sequelize.STRING,
	password: Sequelize.STRING,
	hospital: Sequelize.STRING,
	name: Sequelize.STRING,
	created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const Medicine_check = sequelize.define('medicine_check', {
	kakao_id: Sequelize.STRING,
	med_check: Sequelize.TINYINT,
	time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	med_miss_reason: Sequelize.STRING,
	med_side: Sequelize.STRING,
	med_side_degree: Sequelize.STRING,
});

const Medicine_time = sequelize.define('medicine_time', {
	kakao_id: Sequelize.STRING,
	slot: Sequelize.STRING,
	time: Sequelize.STRING,
	mute: Sequelize.STRING,
	created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const Mood_check = sequelize.define('mood_check', {
	kakao_id: Sequelize.STRING,
	time: Sequelize.STRING,
	type: Sequelize.STRING,
	mood_check: Sequelize.STRING,
	mood_text: Sequelize.STRING
});

const Kakao_text = sequelize.define('kakao_text', {
	kakao_id: Sequelize.STRING,
	time: Sequelize.STRING,
	text: Sequelize.STRING,
	share_doctor: Sequelize.STRING
});

module.exports = {
	sequelize: sequelize,
	Patient: Patient,
	Doctor: Doctor,
	Medicine_check: Medicine_check,
	Medicine_time: Medicine_time,
	Mood_check: Mood_check,
	Kakao_text: Kakao_text,
	PatientLog: PatientLog,
	verifyAPIKEY: verifyAPIKEY
}
