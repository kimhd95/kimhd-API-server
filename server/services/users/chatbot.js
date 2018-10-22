const models = require('../../models');
const config = require('../../../configs');
const Op = models.sequelize.Op;
const crypto = require('crypto');
const moment = require('moment');
//var logger = require('../../config/winston');

function getUserChartURL (req, res){
    let encrypted_kakao_id
    if ((req.params.encrypted_kakao_id !== undefined)){
        encrypted_kakao_id = req.params.encrypted_kakao_id.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. ' +
            'Check parameter names (encrypted_kakao_id).', encrypted_kakao_id: req.encrypted_params.kakao_id})
    }

    // /let encrypted_kakao_id = req.params.encrypted_kakao_id;
    //if (req.body){
    //	encrypted_kakao_id = req.params.encrypted_kakao_id
    //} else {
    //	return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id).'})
    //}
    //if (!encrypted_kakao_id){
    //	return res.status(403).json({success: false, message: 'Kakao_id not given in parameter. Check parameters.'})
    //}

    models.User.findOne({
        where: {
            encrypted_kakao_id: encrypted_kakao_id
        }
    }).then(user => {
        //if (user){
        if (!user){
            return res.status(403).json({success: false, message: 'user with same encrypted_kakao_id already exists'})
        } else {
            return res.status(200).json({success: true, message: 'user found returning url',
                url: config.dashboard_url+'/chart/' + user.encrypted_kakao_id})

            // TODO : Create encrypted_kakao_id to protect raw kakao_id from being public.
            // return res.status(200).json({success: true, message: 'user found returning url.', url: 'https://jellyfi.jellylab.io/' + user.encrypted_kakao_id})

        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Error while searching for User with given encrypted_kakao_id. err: ' + err.message})
    })
}

function registerUser (req, res) {
    let kakao_id
    if (req.body){
        kakao_id = req.body.kakao_id
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id).'})
    }
    if (!kakao_id){
        return res.status(403).json({success: false, message: 'Kakao_id not given in Body. Check parameters.'})
    }
    models.User.findOne({
        where: {
            kakao_id: kakao_id
        }
    }).then(user => {
        if (user){
            models.User.update(
              {
                scenario: '100',
                state: 'init'
              },     // What to update
              {where: {
                      kakao_id: kakao_id}
              })  // Condition
              .then(result => {
                return res.status(403).json({success: false, message: 'user with same kakao_id already exists'});
              })
        } else {
            models.User.create({
                kakao_id: kakao_id,
                //encrypted_kakao_id: encrypted_kakao_id,
                scenario: '100',
                state: 'init',
                registered: '0'
            }).then(user => {
                return res.status(201).json({success: true, message: 'user created.', user: user})
            }).catch(function (err){
                return res.status(500).json({success: false, message: 'Error while creating User in DB.', error: err.message, err: err})
            });
        }
    })
}

function updateUser (req, res) {
    console.log('updateUser called.');
    let kakao_id;

    if (req.body){
        kakao_id = req.body.kakao_id;
        if (!kakao_id){
            return res.status(403).json({success: false, message: 'kakao_id not provided.'})
        }
    } else {
        return res.status(403).json({success: false, message: 'No input parameters received in body.'})
    }

    const nickname = req.body.nickname;
    const birthday = req.body.birthday;
    const sex = req.body.sex;
    const allergy = req.body.allergy;
    const vegi = req.body.vegi;
    const snack = req.body.snack;
    const serving_size = req.body.serving_size;
    const disease = req.body.disease;
    const diet = req.body.diet;
    const alone_level = req.body.alone_level;
    const job = req.body.job;
    const register = req.body.register;
    const subway = req.body.subway;
    const exit_quarter = req.body.exit_quarter;
    const with_mood = req.body.with_mood;
    const price = req.body.price;
    const rest5 = req.body.rest5;
    const rest6 = req.body.rest6;
    const rest_final = req.body.rest_final;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const mid_lat = req.body.mid_lat;
    const mid_lng = req.body.mid_lng;
    const cnt = req.body.cnt;
    const limit_cnt = req.body.limit_cnt;



    if(nickname){
        // models.Medicine_time.create({
        //     kakao_id: kakao_id,
        //     encrypted_kakao_id: kakao_id,
        //     slot: 0,
        //     time: 5
        // });
        //
        // models.Medicine_time.create({
        //     kakao_id: kakao_id,
        //     encrypted_kakao_id: kakao_id,
        //     slot: 1,
        //     time: 12
        // });
        //
        // models.Medicine_time.create({
        //     kakao_id: kakao_id,
        //     encrypted_kakao_id: kakao_id,
        //     slot: 2,
        //     time: 17
        // });

        models.User.update({
            registered: 0,
            daily_scenario: 0,
            stamp: 0,
            encrypted_kakao_id: kakao_id //todo: 카카오아이디 암호화
        }, {
            where: {
                kakao_id: kakao_id
            } // Condition
        }).then(result => {
            console.log('result: ' + result.toString())
            if (result){
                return res.status(200).json({success: true, message: 'Update registered complete. Result: ' + result.toString()})
            } else {
                return res.status(200).json({success: true, message: 'No user found to update or User does not exist with given kakao_id. ' +
                    + result.toString()})
            }
        }).catch(function (err){
            return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
        })

    }

    let param_name;
    let param_value;
    if (nickname){
        param_name = 'nickname';
        param_value = nickname;
    } else if (birthday) {
        param_name = 'birthday';
        param_value = birthday;
    } else if (sex) {
        param_name = 'sex';
        param_value = sex;
    } else if (allergy){
        param_name = 'allergy';
        param_value = allergy;
    } else if (vegi){
        param_name = 'vegi';
        param_value = vegi;
    } else if (snack) {
        param_name = 'snack';
        param_value = snack;
    }  else if (serving_size) {
        param_name = 'serving_size';
        param_value = serving_size;
    } else if (disease){
        param_name = 'disease';
        param_value = disease;
    } else if (diet){
        param_name = 'diet';
        param_value = diet;
    } else if (alone_level){
        param_name = 'alone_level';
        param_value = alone_level;
    } else if (job){
        param_name = 'job';
        param_value = job;
    } else if (subway){
        param_name = 'subway';
        param_value = subway;
    } else if (exit_quarter){
        param_name = 'exit_quarter';
        param_value = exit_quarter;
    } else if (with_mood){
        param_name = 'with_mood';
        param_value = with_mood;
    } else if (price){
        param_name = 'price';
        param_value = price;
    } else if (rest5){
        param_name = 'rest5';
        param_value = rest5;
    } else if (rest6){
        param_name = 'rest6';
        param_value = rest6;
    } else if (rest_final){
        param_name = 'rest_final';
        param_value = rest_final;
    } else if (lat){
        param_name = 'lat';
        param_value = lat;
    } else if (lng){
        param_name = 'lng';
        param_value = lng;
    } else if (mid_lat){
        param_name = 'mid_lat';
        param_value = mid_lat;
    } else if (mid_lng){
        param_name = 'mid_lng';
        param_value = mid_lng;
    } else if (cnt){
        param_name = 'cnt';
        param_value = cnt;
    } else if(limit_cnt){
        param_name = 'limit_cnt';
        param_value = limit_cnt;
    }

    if (param_value){
        models.sequelize.query('UPDATE users SET ' + param_name + " = '" + param_value + "' WHERE kakao_id = '" + kakao_id + "';").then(result => {
            if (result){
                console.log('result: ' + result.toString())
                return res.status(200).json({success: true, message: 'user data updated. Result info: ' + result[0].info})
            } else {
                return res.status(403).json({success: false, message: 'user update query failed.'})
            }
        }).catch(function (err){
            return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
        })
    } else {
        return res.status(403).json({success: false, message: 'No parameter given. Please check again. Required: kakao_id. ' +
            'And one more parameter is required among name, initials, user_code, email, phone, sex, birthday'})
    }
}

function getRestaurant (req, res) {
    const kakao_id = req.body.kakao_id;
    let subway = req.body.subway;
    let exit_quarter = req.body.exit_quarter;
    const mood = req.body.mood;
    let food_ingre = req.body.food_ingre;
    const price = req.body.price
    let min, max;

    if(food_ingre === null){
      food_ingre = 'x';
    }
    if(subway === '서울 어디든 좋아' || subway === null){
      subway = '[가-힇]';
      exit_quarter = '[0-9]';
    }
    if(exit_quarter === 999){
      exit_quarter = '[0-9]';
    }

    switch (price) {
      case 1:
        min = 0;
        max = 8000;
        break;
      case 2:
        min = 8000;
        max = 15000;
        break;
      case 3:
        min = 12000;
        max = 999999;
        break;
      default:
        min = 0;
        max = 999999;
        break;
    }
    //if ((scenario.indexOf("201") == 0) && (state == 'init')){
    models.sequelize.query('SELECT * FROM restaurants WHERE (subway regexp '+"'"+subway+"'"+') AND (exit_quarter regexp '+"'"+exit_quarter+"'"+') AND (mood regexp '+"'"+mood+"'"+') AND (food_ingre NOT regexp '+"'"+food_ingre+"'"+') AND (food_cost BETWEEN '+min+' AND '+max+') GROUP BY food_type ORDER BY RAND() LIMIT 4;').then(result => {
        if (result){
            console.log('result: ' + result.toString());
            console.log('길이 : '+result[0].length);
            if(result[0].length === 4){
              return res.status(200).json({success: true, message: result})
            }else{
              models.sequelize.query('SELECT * FROM restaurants WHERE (subway regexp '+"'"+subway+"'"+') AND (exit_quarter regexp '+"'"+exit_quarter+"'"+') AND (mood regexp '+"'[가-힇]'"+') AND (food_ingre NOT regexp '+"'"+food_ingre+"'"+') AND (food_cost BETWEEN '+min+' AND '+max+') GROUP BY food_type ORDER BY RAND() LIMIT 4;').then(result => {
                if (result){
                  console.log("첫 결과가 4개가 안되서 두번째 검색(길이) : : "+result[0].length);
                  return res.status(200).json({success: true, message: result})
                } else {
                    console.log('result없음');
                    return res.status(403).json({success: false, message: 'user update query failed.'})
                }
              }).catch(function (err){
                  return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
              })
           }
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getTwoRestaurant (req, res) {
    const kakao_id = req.body.kakao_id;
    const rest3 = req.body.rest3;
    const rest4 = req.body.rest4;

    models.sequelize.query('SELECT * FROM restaurants WHERE id= '+rest3+' UNION SELECT * FROM restaurants WHERE id= '+rest4+';').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getLastHistory (req, res) {
    const kakao_id = req.body.kakao_id;

    models.sequelize.query('SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' ORDER BY id DESC LIMIT 1;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getAllHistory (req, res) {
    const kakao_id = req.body.kakao_id;

    models.sequelize.query('SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' ORDER BY id DESC;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getTodayHistory (req, res) {
    const kakao_id = req.body.kakao_id;
    let nowDate = new Date();
    const date = moment().format('YYYYMMDD');


    models.sequelize.query('SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' AND date = '+"'"+date+"'"+' ORDER BY id;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getThreeHistory (req, res) {
    const kakao_id = req.body.kakao_id;
    let nowDate = new Date();
    const date = moment().format('YYYYMMDD');
    let yesterday = moment(date).subtract(1, 'd').format('YYYYMMDD');
    let twoDaysAgo = moment(date).subtract(2, 'd').format('YYYYMMDD');

    models.sequelize.query('SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' AND date = '+"'"+date+"'"+' UNION '+'SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' AND date = '+"'"+yesterday+"'"+
    ' UNION '+'SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' AND date = '+"'"+twoDaysAgo+"'"+' ORDER BY id;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getSubwayHistory (req, res) {
    const kakao_id = req.body.kakao_id;
    const subway = req.body.subway;

    models.sequelize.query('SELECT * FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' AND subway = '+"'"+subway+"'"+' ORDER BY id;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function getCountHistory (req, res) {
    const kakao_id = req.body.kakao_id;

    models.sequelize.query('SELECT *,count(*) as cnt FROM decide_histories WHERE kakao_id = '+"'"+kakao_id+"'"+' GROUP BY res_name ORDER BY cnt DESC;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function updateStamp (req, res) {
    const kakao_id = req.body.kakao_id
    const stamp = req.body.stamp

    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    //if ((scenario.indexOf("201") == 0) && (state == 'init')){
    models.User.update(
        {
            stamp: stamp
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'User Stamp Update complete.', stamp: stamp})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'User Stamp Update Update failed. Error: ' + err.message})
    })
    //}
}

function updateTest (req, res) {
    const kakao_id = req.body.kakao_id
    const rest1 = req.body.rest1

    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    //if ((scenario.indexOf("201") == 0) && (state == 'init')){
    models.User.update(
        {
            rest1: rest1
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'User Stamp Update complete.', rest1: rest1})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'User Stamp Update Update failed. Error: ' + err.message})
    })
    //}
}

function updateDaily (req, res) {
    const kakao_id = req.body.kakao_id
    const daily_scenario = req.body.daily_scenario

    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    //if ((scenario.indexOf("201") == 0) && (state == 'init')){
    models.User.update(
        {
            daily_scenario: daily_scenario
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'User daily_scenario Update complete.', daily_scenario: daily_scenario})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'User daily_scenario Update Update failed. Error: ' + err.message})
    })
    //}
}

function getUserInfo (req, res) {
    console.log('getUserInfo called.')
    const kakao_id = req.params.kakao_id
    let nowDate = new Date();
    nowDate.getTime();
    const now = nowDate;

    if (kakao_id) {
        models.User.findOne({
            where: {
                kakao_id: kakao_id
            }
        }).then(user => {
            if (!user){
                return res.status(403).json({success: false, message: 'user not found with kakao_id: ' + kakao_id})
            }
            models.UserLog.findAll({
                where: {
                    kakao_id: kakao_id
                },
                order: [
                    // Will escape username and validate DESC against a list of valid direction parameters
                    ['id', 'DESC']
                ]
            }).then(userLog => {
                console.log('userLog findAll finished.')
                if (userLog){
                    //console.log(userLog);
                    models.User.update({
                        exit: 0,
                        //updated_at: now
                    }, {
                        where: {kakao_id: kakao_id} // Condition
                    })
                    return res.status(200).json({success: true, message: 'user and user_log both found.', user_info: user, user_log: userLog})
                } else {
                    // Return when no data found
                    return res.status(403).json({success: false, message: 'No userLog found with given kakao_id.'})
                }
            }).catch(function (err){
                return res.status(403).json({success: false, user_info: user, message: 'user info found. But error occured while retrieving logs.', error: err.message})
            })
        }).catch(function (err){
            return res.status(403).json({success: false, message: err.message})
        })
    } else {
        return res.status(403).json({success: false, message: 'kakao_id not given.'})
    }
}


function getRestaurantInfo (req, res) {
    console.log('getRestaurantInfo called.')
    const id = req.body.id

    models.sequelize.query('SELECT * FROM restaurants WHERE id= '+id+';').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}


function updateUserStart (req, res) {
    console.log('updateUserStart called.')
    const kakao_id = req.body.kakao_id;
    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            subway: null,
            exit_quarter: null,
            with_mood: null,
            price: null,
            rest1: null,
            rest2: null,
            rest3: null,
            rest4: null,
            rest5: null,
            rest6: null
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'UserStart Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'UserStart Update Update failed. Error: ' + err.message})
    })
}

function updatePlaceStart (req, res) {
    console.log('updatePlaceStart called.')
    const kakao_id = req.body.kakao_id;
    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            lat: 0,
            lng: 0,
            mid_lat: 0,
            mid_lng: 0,
            cnt: 0
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'UserStart Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'UserStart Update Update failed. Error: ' + err.message})
    })
}


function updateRest4 (req, res) {
    console.log('updateRest4 called.')
    const kakao_id = req.body.kakao_id;
    const rest1 = req.body.rest1;
    const rest2 = req.body.rest2;
    const rest3 = req.body.rest3;
    const rest4 = req.body.rest4;
    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            rest1: rest1,
            rest2: rest2,
            rest3: rest3,
            rest4: rest4
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'UserRest4 Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'UserRest4 Update Update failed. Error: ' + err.message})
    })
}

function updateRestOnly2 (req, res) {
    console.log('updateRest4 called.')
    const kakao_id = req.body.kakao_id;
    const rest1 = req.body.rest1;
    const rest2 = req.body.rest2;
    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            rest5: rest1,
            rest6: rest2,
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'UserRestOnly2 Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'UserRestOnly2 Update Update failed. Error: ' + err.message})
    })
}

function updatePlaceInfo (req, res) {
    console.log('updatePlaceInfo called.')
    const kakao_id = req.body.kakao_id;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const cnt = req.body.cnt;
    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            lat: lat,
            lng: lng,
            cnt: cnt
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'updatePlaceInfo Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'updatePlaceInfo Update Update failed. Error: ' + err.message})
    })
}

function updateMidInfo (req, res) {
    console.log('updateMidInfo called.')
    const kakao_id = req.body.kakao_id;
    const mid_lat = req.body.mid_lat;
    const mid_lng = req.body.mid_lng;
    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            mid_lat: mid_lat,
            mid_lng: mid_lng,
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'updatePlaceInfo Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'updatePlaceInfo Update Update failed. Error: ' + err.message})
    })
}

function createDecideHistory (req, res) {
    const kakao_id = req.body.kakao_id;
    const round = req.body.round;
    const res_name = req.body.res_name;
    const price = req.body.price;
    const exit_quarter = req.body.exit_quarter;
    const with_mood = req.body.with_mood;
    const subway = req.body.subway;
    let nowDate = new Date();
    const date = moment().format('YYYYMMDD');


    models.Decide_history.create({
        kakao_id: kakao_id,
        round: 2,
        res_name: res_name,
        price: price,
        exit_quarter: exit_quarter,
        with_mood: with_mood,
        subway: subway,
        date: date
    })
    .then(result => {
        return res.status(200).json({success: true, message: 'DecideHistory Update complete.'})
    }).catch(function (err){
    return res.status(403).json({success: false, message: 'DecideHistory Update Update failed. Error: ' + err.message})
    })
}

function createUserFeedback (req, res) {
    const kakao_id = req.body.kakao_id;
    const sex = req.body.sex;
    const birthday = req.body.birthday;
    const job = req.body.job;
    const feedback_content = req.body.feedback_content;
    let nowDate = new Date();
    const date = moment().format('YYYYMMDD');


    models.User_feedback.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        sex: sex,
        birthday: birthday,
        job: job,
        feedback_content: feedback_content,
        date: date
    })
    .then(result => {
        return res.status(200).json({success: true, message: 'UserFeedback Create complete.'})
    }).catch(function (err){
    return res.status(403).json({success: false, message: 'UserFeedback Create failed. Error: ' + err.message})
    })
}

function getFeedbackInfo (req, res) {
    console.log('getFeedbackInfo called.')

    models.sequelize.query('SELECT * FROM user_feedbacks;').then(result => {
        if (result){
            console.log('result: ' + result.toString())
            return res.status(200).json({success: true, message: result})
        } else {
            console.log('result없음');
            return res.status(403).json({success: false, message: 'user update query failed.'})
        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
    })
    //}
}

function updateExit (req, res) {
    console.log('updateExit called.')
    let kakao_id

    if (req.body){
        kakao_id = req.body.kakao_id
        if (!kakao_id){
            return res.status(403).json({success: false, message: 'kakao_id not provided.'})
        }
    } else {
        return res.status(403).json({success: false, message: 'No input parameters received in body.'})
    }
    const exit = req.body.exit
    let nowDate = new Date();
    nowDate.getTime();
    const now = nowDate;

    models.User.update({
        exit: exit, // What to update
        //updated_at: now
    }, {
        where: {
            kakao_id: kakao_id
        } // Condition
    }).then(result => {
        console.log('result: ' + result.toString())
        if (result){
            return res.status(200).json({success: true, message: 'Update Exit complete. Result: ' + result.toString()})
        } else {
            return res.status(200).json({success: true, message: 'No user found to update or User does not exist with given kakao_id. ' +
                + result.toString()})
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
    })

}

function createUserLog (req, res){
    const kakao_id = req.body.kakao_id
    const scenario = req.body.scenario
    const state = req.body.state
    const content = req.body.content
    const date = req.body.date
    const type = req.body.type
    const answer_num = req.body.answer_num
    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    models.UserLog.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        scenario: scenario,
        state: state,
        content: content,
        date: date,
        type: type,
        answer_num: answer_num
    }).then(userLog => {
        models.User.update(
            {
                scenario: scenario,
                state: state,
                date: date,
                updated_at: date
            },     // What to update
            {where: {
                    kakao_id: kakao_id}
            })  // Condition
            .then(result => {
                return res.status(200).json({success: true, message: 'User Log and User both Update complete.', updateResult: result, userLog: userLog})
            }).catch(function (err){
            return res.status(403).json({success: false, message: 'User Log updated. However User Update failed. Error: ' + err.message, userLog: userLog})
        })
        // return res.status(201).json({success: true, userLog})
    }).catch(function (err){
        return res.status(500).json({success: false, error: err.message})
    })
}

function createUserImage (req, res) {
    const kakao_id = req.body.kakao_id
    const image_link = req.body.image_link
    const medical_image = req.body.medical_image
    //const date = req.body.date
    const check_skin = req.body.check_skin
    const check_atopy = req.body.check_atopy
    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    models.User_image.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        image_link: image_link,
        medical_image: medical_image,
        date: Date.now()/1000,
        check_skin: check_skin,
        check_atopy: check_atopy
    }).catch(function (err) {
        return res.status(403).json({success: false, message: 'User image Create failed. Error: ' + err.message})
    })
}




// Legacy code left here for reference.
function medicineTime (req, res) {

    const kakao_id = req.body.kakao_id.toString().trim() || '';
    if (!kakao_id) return res.status(400).json({error: 'Incorrect id'});

    const slot = req.body.slot.toString().trim() || '';
    const time = req.body.medicine_time.toString().trim() || '';


    models.Medicine_time.findOne({
        where: {
            kakao_id: kakao_id,
            slot: slot
        }
    }).then(medicine_time => {
        if (!medicine_time) {
            models.Medicine_time.create({
                kakao_id: kakao_id,
                encrypted_kakao_id: kakao_id,
                slot: slot,
                time: time
            }).then(medicine_time => res.status(201).json(medicine_time));
        } else {

            if (!slot.length) return res.status(400).json({error: 'Incorrect'});
            if (!time.length) return res.status(400).json({error: 'Incorrect'});

            medicine_time.time = time;
            medicine_time.slot = slot;

            medicine_time.save().then(_ => res.status(201).json(medicine_time));

            const rule = new schedule.RecurrenceRule();
            rule.hour = parseInt(time);
            rule.minute = 0;

            scheduler = req.app.get('scheduler');

            if (scheduler[kakao_id][slot]) scheduler[kakao_id][slot].cancel();

            models.User.findOne({
                where: {
                    kakao_id: kakao_id
                }
            }).then(user => {
                scheduler[kakao_id][slot] = schedule.scheduleJob(rule, function(){

                    axios.post('https://openapi.bablabs.com/v2/kakao-talks', {
                        phone_number:user.phone,
                        message:'sdf'
                    }, {
                        headers: { Authorization: '456789' }
                    }).then(response => {
                        console.log(response.data.url);
                        console.log(response.data.explanation);
                    }).catch(error => {
                        console.log(error);
                    });
                });
            });
        }
    });
}


function getMedicineTime (req, res) {

    let kakao_id
    if ((req.params.kakao_id !== undefined)){
        kakao_id = req.params.kakao_id.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id).', kakao_id: req.params.kakao_id})
    }

    models.Medicine_time.findAll({
        where: {
            kakao_id: kakao_id
        }
    }).then(Medicine_time => {
        res.status(201).json({success: true, message: 'Medicine success', result: Medicine_time})
    }).catch(function (err){
        res.status(400).json({success: false, message: 'Get failed. Error: ' + err.message})
    })
}

function createMedicineTime (req, res) {

    let kakao_id, slot, time
    if ((req.body.kakao_id !== undefined) && (req.body.slot !== undefined) && (req.body.time !== undefined)){
        kakao_id = req.body.kakao_id.toString().trim() || '';
        slot = req.body.slot.toString().trim() || '';
        time = req.body.time.toString().trim() || '';

        if (slot < 0 || slot >= 4 ){
            return res.status(403).json({success: false, message: 'Allowed Slot values are 0 (Morning), 1 (Lunch), 2 (Dinner), 3 (Before Sleep)'})
        }

    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, slot, time).', kakao_id: req.body.kakao_id, slot: req.body.slot, time: req.body.time})
    }

    models.Medicine_time.findOne({
        where: {
            kakao_id: kakao_id,
            slot: slot
        }
    }).then(med_time => {
        if (med_time){
            console.log('slot already exists for given kakao_id, slot. Updating value')
            med_time.slot = slot
            med_time.save().then(_ => {
                return res.status(201).json(med_time)
            }).catch(function (err){
                return res.status(500).json({success: false, message: 'slot already exists for given kakao_id and slot, but failed to update.', err: err.message})
            })
        } else {
            models.Medicine_time.create({
                kakao_id: kakao_id,
                encrypted_kakao_id: kakao_id,
                slot: slot,
                time: time
            }).then(Medicine_time => {
                return res.status(201).json({success: true, result: Medicine_time})
            }).catch(function (err){
                return res.status(400).json({success: false, message: 'Slot does not exist for given kakao_id. However, create failed.', err: err.message})
            })
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Create medicine time failed for some unknown reason.', err: err.message})
    })
}


// To be used for later.
function updateMedicineTimeMute (req, res) {

    let kakao_id, slot, time
    if ((req.body.kakao_id !== undefined) && (req.body.slot !== undefined) && (req.body.time !== undefined)){
        kakao_id = req.body.kakao_id.toString().trim() || '';
        slot = req.body.slot.toString().trim() || '';
        time = req.body.time.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, slot, time).', kakao_id: req.body.kakao_id, slot: req.body.slot, time: req.body.time})
    }

    if (param_value){
        models.sequelize.query('UPDATE users SET ' + param_name + " = '" + param_value + "' WHERE kakao_id = '" + kakao_id + "';").then(result => {
            if (result){
                return res.status(200).json({success: true, message: 'user data updated. Result info: ' + result[0].info})
            } else {
                return res.status(403).json({success: false, message: 'user update query failed.'})
            }
        }).catch(function (err){
            return res.status(403).json({success: false, message: 'Unknown error while querying users table for update from ChatBot server. err: ' + err.message})
        })
    }
}

function getMedicineCheck (req, res) {

    let kakao_id
    if ((req.params.kakao_id !== undefined)){
        kakao_id = req.params.kakao_id.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id).', kakao_id: req.params.kakao_id})
    }

    models.Medicine_check.findAll({
        where: {
            kakao_id: kakao_id
        }
    }).then(Medicine_check => {
        res.status(201).json({success: true, result: Medicine_check})
    }).catch(function (err){
        res.status(400).json({success: false, message: 'Get failed. Error: ' + err.message})
    })
}

// Time은 UnixTime in seconds 로 한다 - Integer. - 기록할 당시의 유닉스시간
// Date는 (UnixTime in seconds) - (UnixTime in seconds % 60*60*24) 로 한다. 그 해당 날짜만 기록. (시간, 분, 초 를 제외한다.) - medicine_time 에서 약체크에 해당하는 날짜시간.
// 또한, Date 는 한국시 기준으로 기록하고, 한국시 기준으로 회수한다. (챗봇에서 콜을 할 때 이미 한국시로 Date 를 준다.)
// Allowed Slot values are 0 (Morning), 1 (Lunch), 2 (Dinner), 3 (Before Sleep) - Integer
function createMedicineCheck (req, res) {

    let kakao_id, med_check, time, date, slot
    if ((req.body.kakao_id !== undefined) && (req.body.med_check !== undefined) && (req.body.time !== undefined) && (req.body.date !== undefined) && (req.body.slot !== undefined)){
        kakao_id = req.body.kakao_id.toString().trim() || '';
        med_check = req.body.med_check.toString().trim() || '';
        time = req.body.time.toString().trim() || '';
        date = req.body.date.toString().trim() || '';
        slot = req.body.slot.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, med_check, time, date, slot).',
            kakao_id: req.body.kakao_id, med_check: req.body.med_check, time: req.body.time, date: req.body.date, slot: req.body.slot})
    }

    models.Medicine_check.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        med_check: med_check,
        time: time,
        date: time,
        //date: parseInt(date), // (챗봇에서 콜을 할 때 이미 한국시로 Date 를 준다.)
        slot: slot
    }).then(medicine_check => {
        res.status(201).json({success: true, result: medicine_check})
    }).catch(function (err){
        res.status(400).json({success: false, message: 'Create failed. Error: ' + err.message})
    })
}

function createMoodCheck (req, res) {

    let kakao_id, mood_check, type, time, text
    if ((req.body.kakao_id !== undefined) && (req.body.mood_check !== undefined) && (req.body.type !== undefined) && (req.body.time !== undefined)){
        kakao_id = req.body.kakao_id.toString().trim() || '';
        mood_check = req.body.mood_check.toString().trim() || '';
        type = req.body.type.toString().trim() || '';
        time = req.body.time.toString().trim() || '';
        //text = req.body.text.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, mood_check, type, time).',
            kakao_id: req.body.kakao_id, mood_check: req.body.mood_check, type: req.body.type, time: req.body.time})
    }

    models.Mood_check.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        mood_check: mood_check,
        type: type,
        time: time
    }).then(mood_check => {
        res.status(201).json({success: true, result: mood_check})
    }).catch(function (err){
        res.status(400).json({success: false, message: 'Create failed. Error: ' + err.message})
    })

}


// Integrated into createMoodCheck. Unused now.
function createMoodCheckText (req, res){
    let kakao_id, mood_check_id, text;
    if ((req.body.kakao_id !== undefined) && (req.body.mood_check_id !== undefined) && (req.body.text !== undefined)){
        kakao_id = req.body.kakao_id.toString().trim() || '';
        mood_check_id = req.body.mood_check_id.toString().trim() || '';
        text = req.body.text.toString().trim() || '';
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, mood_check_id, text).', kakao_id: req.body.kakao_id, mood_check_id: req.body.mood_check_id, text: req.body.text})
    }

    models.Mood_check.update(
        {mood_text: text,
            encrypted_kakao_id: kakao_id},
        {where: {
                kakao_id: kakao_id,
                id: mood_check_id,
            }
        }
    ).then(mood_check => res.status(200).json({success: true, message: 'Update done. mood_check: ' + mood_check.toString()})
    ).catch(function (err){
        res.status(400).json({success: false, message: 'Updated failed. Error: ' + err.message})
    })
}

// 환자가 챗봇으로 약체크를 할 때, 이전 이틀동안 최대 3회 약체크 null data 가 있을 경우 그 time slot 을 가져와 챗봇 서버에 알려준다. 그러면 챗봇 서버는 환자에거게 적절한 약체크 질문을 던진다.
// date 는 unixtime in seconds 한국시
function getMedicineTimeToCheck (req, res) {

    let kakao_id, time
    if ((req.params.kakao_id !== undefined) && (req.params.time !== undefined)){
        // kakao_id = req.body.kakao_id.toString().trim() || '';
        // time = req.body.time.toString().trim() || '';
        kakao_id = req.params.kakao_id
        time = parseInt(req.params.time)
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id, time).',
            kakao_id: req.body.kakao_id, date: req.body.time})
    }

    models.Medicine_time.findAll({
        where: {
            kakao_id: kakao_id
        },
        order: [
            ['slot', 'DESC']
        ]
    }).then(Medicine_time => {


        // 메디신 타임을 다 가져와서, 메디신 체크에 원래 체크를 해야 하는 날짜와 타임슬롯에 데이터가 실제로 존재하는지 확인.
        models.Medicine_check.findAll({
            where: {
                kakao_id: kakao_id,
                // med_check: {[Op.ne]: null}, // 데이터가 있는 경우 다 가져온다. med_check 가 null 일 수가 없기에 주석처리 함. (환자가 체크를 하지 않았으면 row 자체가 생성되지 않았을 것이기에.)
                date: {   // 주의: time 은 콜 했을 당시의 유닉스 시간. date 는 medicine_check 데이터 내에서 해당하는 날짜.
                    [Op.lte]: time,
                    [Op.gte]: time - (time % 60*60*24) - 60*60*24 // 오늘
                }
            },
            order: [
                // Will escape username and validate DESC against a list of valid direction parameters
                ['time', 'DESC']
            ]
            // limit: 8 // 이전 8회까지만.
        }).then(med_check => {

            let expectedValues = [];
            for (let i=0; i<Medicine_time.length; i++){
                // if (med_check.slot) Medicine_time[i].slot
                // if (med_check)
                expectedValues.push({date: time - (time % (60*60*24) + 60*60*9), slot: parseInt(Medicine_time[i].slot)})  // 오늘 + 한국시로 변환
                expectedValues.push({date: time - (time % (60*60*24)) - 60*60*24  + 60*60*9, slot: parseInt(Medicine_time[i].slot)}) // 어제 + 한국시로 변환
            }

            for (let j=0; j<med_check.length; j++){
                for (let k=0; k < expectedValues.length; k++){
                    if (expectedValues[k].date === med_check[j].date && expectedValues[k].slot === med_check[j].slot){
                        expectedValues.splice(k, 1)
                    }
                }
            }

            expectedValues.sort(function(a,b){return a.slot - b.slot});
            expectedValues.sort(function(a,b){return a.date - b.date});

            return res.status(200).json({success: true, message: 'successfully retrieved data.', med_time: Medicine_time, med_check: med_check, toAskValues: expectedValues})
        }).catch(err => {
            res.status(400).json({success: false, message: 'Failed. Error: ' + err.message})
        })
    }).catch(function (err){
        res.status(400).json({success: false, message: 'Failed. Error: ' + err.message})
    })
}

function verifyDoctorCode (req, res) {
    let doctorCode;
    if ((req.body.doctor_code !== undefined)){
        doctorCode = req.body.doctor_code;
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (doctor_code).',
            doctor_code: req.body.doctor_code});
    }

    models.Doctor.findOne({
        where: {
            doctor_code: doctorCode
        }
    }).then(result => {
        if(result !== null) {
            res.status(200).json({result: 'success'})
        } else {
            res.status(200).json({result: 'no doc'})
        }
    }).catch(err => {
        logger.error("DB Error in verifyDoctorCode :"+err.message);
        res.status(400).json({message: 'Failed. DB Error: ' + err.message})
    });
}

function updateLimitCnt (req, res) {
    console.log('updateMidInfo called.')
    const kakao_id = req.body.kakao_id;
    const limit_cnt = req.body.limit_cnt;
    const date = moment().format('MM/DD/H');

    // let nowDate = new Date();
    // nowDate.getTime();
    // const now = nowDate;

    models.User.update(
        {
            limit_cnt: limit_cnt,
            decide_updated_at: date,
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'updateLimitCnt Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'updateLimitCnt Update Update failed. Error: ' + err.message})
    })
}

function verifyLimit (req, res) { //끼니 당 3회 제한 판별 API함수
    console.log('verifyLimit called.')
    const kakao_id = req.body.kakao_id;
    const limit_cnt = req.body.limit_cnt; //현재 유저DB의 메뉴결정 횟수

    let decide_updated_at = req.body.decide_updated_at; //현재 유저의 마지막 메뉴결정 day/hour
    if(decide_updated_at === null){
      decide_updated_at = '99/99/99';
    }
    decide_updated_at = decide_updated_at.split('/');
    let now_time = moment().format('MM/DD/H'); //지금의 day/hour
    now_time = now_time.split('/');

    //hour에 따라, 0~9시,10~15시,16~24시를 기준으로 범위를 나눈다.
    function calTimeRange(value){
      if(value > 16){
        return 3;
      }else if(value > 10){
        return 2;
      }else{
        return 1;
      }
    }

    /*
    limit_cnt가 3일때,
     날짜가 같을 떄
      - 지금 시간의 범위와, 유저 시간의 범위가 같을 떄, 메뉴 고르기 제한
       - month가 다르면, 메뉴 고르기 가능
      - 지금 시간의 범위와, 유저 시간의 범위가 다를 떄, limit_cnt 0으로 초기화 시키고 메뉴 고르기 가능
     날짜가 다를 때
      - limit_cnt 0으로 초기화 시키고 메뉴 고르기 가능
    */
    if(limit_cnt === 3){
      if(decide_updated_at[1] === now_time[1]){
        if(calTimeRange(decide_updated_at[2]) === calTimeRange(now_time[2])){
          if(decide_updated_at[0] === now_time[0]){
            return res.status(200).json({result: 'failed'})
          }else{
            models.User.update(
                {
                    limit_cnt: 0,
                },     // What to update
                {where: {
                        kakao_id: kakao_id}
                })  // Condition
                .then(result => {
                  return res.status(200).json({result: 'success'})
                }).catch(function (err){
                return res.status(403).json({success: false, message: 'updateLimitCnt Update Update failed. Error: ' + err.message})
            })
          }
        }else{
          models.User.update(
              {
                  limit_cnt: 0,
              },     // What to update
              {where: {
                      kakao_id: kakao_id}
              })  // Condition
              .then(result => {
                return res.status(200).json({result: 'success'})
              }).catch(function (err){
              return res.status(403).json({success: false, message: 'updateLimitCnt Update Update failed. Error: ' + err.message})
          })
        }
      }else{
        models.User.update(
            {
                limit_cnt: 0,
            },     // What to update
            {where: {
                    kakao_id: kakao_id}
            })  // Condition
            .then(result => {
              return res.status(200).json({result: 'success'})
            }).catch(function (err){
            return res.status(403).json({success: false, message: 'updateLimitCnt Update Update failed. Error: ' + err.message})
        })
      }
    }else{ //limit_cnt가 3이 아닌경우 계속 진행 가능
      return res.status(200).json({result: 'success'})
    }
}

function updateState (req, res) {
    const kakao_id = req.body.kakao_id;
    const scenario = req.body.scenario;
    const state = req.body.state;

    models.User.update(
        {
            scenario: scenario,
            state: state
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'User State Update complete.'})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'User State Update Update failed. Error: ' + err.message})
    })
    //}
}

module.exports = {
    getUserChartURL: getUserChartURL,

    registerUser: registerUser,
    updateUser: updateUser,
    updateLimitCnt: updateLimitCnt,
    updateDaily: updateDaily,
    updateStamp: updateStamp,
    updateTest: updateTest,
    updateState: updateState,
    createUserImage: createUserImage,
    getUserInfo: getUserInfo,
    getRestaurant: getRestaurant,
    getTwoRestaurant: getTwoRestaurant,
    getRestaurantInfo: getRestaurantInfo,
    updateUserStart: updateUserStart,
    updatePlaceStart: updatePlaceStart,
    updatePlaceInfo: updatePlaceInfo,
    updateMidInfo: updateMidInfo,
    updateRest4: updateRest4,
    updateRestOnly2: updateRestOnly2,
    getLastHistory: getLastHistory,
    getTodayHistory: getTodayHistory,
    getThreeHistory: getThreeHistory,
    getSubwayHistory: getSubwayHistory,
    verifyLimit: verifyLimit,
    updateExit: updateExit,
    createUserLog: createUserLog,
    createUserFeedback: createUserFeedback,
    getCountHistory: getCountHistory,
    getAllHistory: getAllHistory,
    getFeedbackInfo: getFeedbackInfo,

    createMedicineTime: createMedicineTime,
    getMedicineTime: getMedicineTime,
    // updateMedicineTime: updateMedicineTime,

    createMedicineCheck: createMedicineCheck,
    createDecideHistory: createDecideHistory,
    getMedicineCheck: getMedicineCheck,
    createMoodCheck: createMoodCheck,
    createMoodCheckText: createMoodCheckText,
    getMedicineTimeToCheck: getMedicineTimeToCheck,
    verifyDoctorCode: verifyDoctorCode
}
