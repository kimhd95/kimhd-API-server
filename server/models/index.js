const Sequelize = require('sequelize');
const config = require('../../configs')

const verifyAPIKEY = (req, res, next) => {

    if(!req.body.apikey) {
        console.log(req.body.apikey);
        return res.status(400).send('API key not given.');
    }

    //console.log(req.body);
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
            // For Korean support
            charset: 'utf8',
            collate: 'utf8_general_ci',

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

const User = sequelize.define('user', {
    kakao_id: { type: Sequelize.STRING, allowNull: false, unique: true },
    encrypted_kakao_id: Sequelize.STRING,
    nickname: Sequelize.STRING,
    registered: Sequelize.STRING,
    daily_scenario: Sequelize.INTEGER,
    scenario: Sequelize.STRING,
    state: Sequelize.STRING,
    exit: Sequelize.INTEGER,
    phone: Sequelize.STRING,
    sex: Sequelize.STRING,
    birthday: Sequelize.INTEGER,
    job: Sequelize.STRING,
    serving_size: Sequelize.INTEGER,
    snack: Sequelize.INTEGER,
    allergy: Sequelize.STRING,
    vegi: Sequelize.STRING,
    diet: Sequelize.INTEGER,
    disease: Sequelize.STRING,
    alone_level: Sequelize.INTEGER,
    stamp: Sequelize.INTEGER,
    subway: Sequelize.STRING,
    exit_quarter: Sequelize.INTEGER,
    with_mood: Sequelize.STRING,
    price: Sequelize.INTEGER,
    rest1: Sequelize.INTEGER,
    rest2: Sequelize.INTEGER,
    rest3: Sequelize.INTEGER,
    rest4: Sequelize.INTEGER,
    rest5: Sequelize.INTEGER,
    rest6: Sequelize.INTEGER,
    rest_final: Sequelize.INTEGER,
    lat: Sequelize.FLOAT,
    lng: Sequelize.FLOAT,
    mid_lat: Sequelize.FLOAT,
    mid_lng: Sequelize.FLOAT,
    cnt: Sequelize.INTEGER,
    limit_cnt: {type: Sequelize.INTEGER, defaultValue: 0},
    decide_updated_at: Sequelize.STRING,

    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});


const UserLog = sequelize.define('user_log', {
    kakao_id: { type: Sequelize.STRING, allowNull: false},
    encrypted_kakao_id: Sequelize.STRING,
    scenario: Sequelize.STRING,
    state: Sequelize.STRING,
    content: Sequelize.STRING,
    date: Sequelize.INTEGER,
    type: Sequelize.STRING,
    answer_num: Sequelize.INTEGER,

    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const User_image = sequelize.define('user_image', {
    kakao_id: Sequelize.STRING,
    encrypted_kakao_id: Sequelize.STRING,
    image_link: Sequelize.STRING,
    image_info: Sequelize.STRING,
    date: Sequelize.INTEGER,
    // check_skin : Sequelize.FLOAT,
    // check_atopy : Sequelize.FLOAT
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const User_feedback = sequelize.define('user_feedback', {
    kakao_id: Sequelize.STRING,
    encrypted_kakao_id: Sequelize.STRING,
    sex: Sequelize.STRING,
    birthday: Sequelize.INTEGER,
    job: Sequelize.STRING,
    feedback_content: Sequelize.STRING,
    date: Sequelize.STRING,


    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});

const Decide_history = sequelize.define('decide_history', {
    kakao_id: Sequelize.STRING,
    round: Sequelize.INTEGER,
    res_name: Sequelize.STRING,
    concept: Sequelize.STRING,
    rate: Sequelize.STRING,
    price: Sequelize.STRING,
    exit_quarter: Sequelize.INTEGER,
    with_mood: Sequelize.STRING,
    subway: Sequelize.STRING,
    date: Sequelize.STRING
    // check_skin : Sequelize.FLOAT,
    // check_atopy : Sequelize.FLOAT
});

const Beer = sequelize.define('beer', {
    beer_name: Sequelize.STRING,
    place: Sequelize.STRING,
    sell_type: Sequelize.STRING,
    flavor: Sequelize.INTEGER,
    soda: Sequelize.INTEGER,
    alcohol: Sequelize.FLOAT,
    beer_type: Sequelize.STRING,
    image_url: Sequelize.STRING,
    comment: Sequelize.STRING
});

//ㄴ
// const Doctor = sequelize.define('doctor', {
//     doctor_code: { type: Sequelize.STRING, allowNull: false, unique: true },
//     email:Sequelize.STRING,
//     password: Sequelize.STRING,
//     hospital: Sequelize.STRING,
//     name: Sequelize.STRING,
//     created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
//     updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
// });
//
// const Medicine_check = sequelize.define('medicine_check', {
//     kakao_id: Sequelize.STRING,
//     encrypted_kakao_id: Sequelize.STRING,
//     med_check: Sequelize.TINYINT,
//     time: Sequelize.INTEGER,
//     date: Sequelize.INTEGER,
//     slot: Sequelize.INTEGER,
//     comment_type: Sequelize.INTEGER,
//     comment_text: Sequelize.STRING,
// });
//
// const Medicine_time = sequelize.define('medicine_time', {
//     kakao_id: Sequelize.STRING,
//     encrypted_kakao_id: Sequelize.STRING,
//     slot: Sequelize.INTEGER,
//     time: Sequelize.INTEGER,
//     mute: Sequelize.STRING,
//     created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
//     updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
// });
//
// const Mood_check = sequelize.define('mood_check', {
//     kakao_id: Sequelize.STRING,
//     encrypted_kakao_id: Sequelize.STRING,
//     time: Sequelize.INTEGER,
//     type: Sequelize.STRING,
//     mood_check: Sequelize.STRING,
//     mood_text: Sequelize.STRING
// });



//
// const Kakao_text = sequelize.define('kakao_text', {
//     id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, unique: true},
//     kakao_id: Sequelize.STRING,
//     encrypted_kakao_id: Sequelize.STRING,
//     time: Sequelize.INTEGER,
//     type: Sequelize.STRING,
//     text: Sequelize.STRING,
//     share_doctor: Sequelize.STRING
// });
//
// const Weather = sequelize.define('weather', {
//     id: {type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, unique: true},
//     date: Sequelize.DATE,
//     pm10: Sequelize.INTEGER,
//     pm25: Sequelize.INTEGER
// });

module.exports = {
    sequelize: sequelize,
    User: User,
    UserLog: UserLog,
    User_image: User_image,
    Decide_history: Decide_history,
    User_feedback: User_feedback,
    Beer: Beer,
    verifyAPIKEY: verifyAPIKEY
    // Doctor: Doctor,
    // Medicine_check: Medicine_check,
    // Medicine_time: Medicine_time,
    // Mood_check: Mood_check,

    //Kakao_text: Kakao_text,

    //Weather: Weather,

};
