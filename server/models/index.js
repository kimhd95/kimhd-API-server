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
        timezone: '+09:00',
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
    kakao_id: Sequelize.STRING,
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
    like_food: Sequelize.STRING,
    hate_food: Sequelize.STRING,
    vegi: Sequelize.STRING,
    diet: Sequelize.INTEGER,
    disease: Sequelize.STRING,
    alone_level: Sequelize.INTEGER,
    stamp: Sequelize.INTEGER,
    subway: Sequelize.STRING,
    exit_quarter: Sequelize.INTEGER,
    with_mood: Sequelize.STRING,
    mood2: Sequelize.STRING,
    taste: Sequelize.STRING,
    food_type: Sequelize.STRING,
    rest1: Sequelize.INTEGER,
    rest2: Sequelize.INTEGER,
    rest_final: Sequelize.INTEGER,
    lat: Sequelize.FLOAT,
    lng: Sequelize.FLOAT,
    mid_lat: Sequelize.FLOAT,
    mid_lng: Sequelize.FLOAT,
    cnt: Sequelize.INTEGER,
    limit_cnt: {type: Sequelize.INTEGER, defaultValue: 0},
    decide_updated_at: Sequelize.STRING,
    gender: Sequelize.STRING,
    ageGroup: Sequelize.INTEGER,
    password: Sequelize.STRING,
    email: { type: Sequelize.STRING, allowNull: false, unique: true },
    chat_log: Sequelize.TEXT,
    created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
});


const UserLog = sequelize.define('user_log', {
    kakao_id: { type: Sequelize.STRING, allowNull: false},
    encrypted_kakao_id: Sequelize.STRING,
    scenario: Sequelize.STRING,
    state: Sequelize.STRING,
    content: Sequelize.STRING,
    date: Sequelize.STRING,
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

const Restaurant = sequelize.define('restaurant', {
    region: Sequelize.STRING,
    res_name: Sequelize.STRING,
    subway: Sequelize.STRING,
    exit_quarter: Sequelize.INTEGER,
    food_type: Sequelize.STRING,
    food_name: Sequelize.STRING,
    mood: Sequelize.STRING,
    lunch_option: Sequelize.BOOLEAN,
    taste: Sequelize.STRING,
    mood2: Sequelize.STRING,
    food_ingre: Sequelize.STRING,
    food_cost: Sequelize.STRING,
    res_size: Sequelize.STRING,
    calories: Sequelize.INTEGER,
    res_phone: Sequelize.STRING,
    closedown: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  },{
    indexes: [
      // add a FULLTEXT index
      { type: 'FULLTEXT', name: 'subway_idx', fields: ['subway'] },
      { type: 'FULLTEXT', name: 'food_type_idx', fields: ['food_type'] },
      { type: 'FULLTEXT', name: 'mood_idx', fields: ['mood'] },
      { type: 'FULLTEXT', name: 'mood2_idx', fields: ['mood2'] },
      { type: 'FULLTEXT', name: 'taste_idx', fields: ['taste'] },
      { type: 'FULLTEXT', name: 'food_ingre_idx', fields: ['food_ingre'] },
      { method: 'BTREE', name: 'exit_quarter_idx', fields: ['exit_quarter'] }
    ]
  });

const Decide_history = sequelize.define('decide_history', {
    kakao_id: Sequelize.STRING,
    rest1: Sequelize.INTEGER,
    rest2: Sequelize.INTEGER,
    rest_winner: Sequelize.INTEGER,
    res_name: Sequelize.STRING,
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

module.exports = {
    sequelize: sequelize,
    User: User,
    UserLog: UserLog,
    User_image: User_image,
    Decide_history: Decide_history,
    User_feedback: User_feedback,
    Beer: Beer,
    Restaurant: Restaurant,
    verifyAPIKEY: verifyAPIKEY
};
