const models = require('../../models');
const config = require('../../../configs');
const Op = models.sequelize.Op;
const crypto = require('crypto');
var logger = require('../../config/winston');

function getPatientChartURL (req, res){
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

    models.Patient.findOne({
        where: {
            encrypted_kakao_id: encrypted_kakao_id
        }
    }).then(patient => {
        //if (patient){
        if (!patient){
            return res.status(403).json({success: false, message: 'patient with same encrypted_kakao_id already exists'})
        } else {
            return res.status(200).json({success: true, message: 'patient found returning url',
                url: config.dashboard_url+'/chart/' + patient.encrypted_kakao_id})

            // TODO : Create encrypted_kakao_id to protect raw kakao_id from being public.
            // return res.status(200).json({success: true, message: 'patient found returning url.', url: 'https://jellyfi.jellylab.io/' + patient.encrypted_kakao_id})

        }
    }).catch(function (err){
        return res.status(403).json({success: false, message: 'Error while searching for Patient with given encrypted_kakao_id. err: ' + err.message})
    })
}

function registerPatient (req, res) {
    let kakao_id
    if (req.body){
        kakao_id = req.body.kakao_id
    } else {
        return res.status(400).json({success: false, message: 'Parameters not properly given. Check parameter names (kakao_id).'})
    }
    if (!kakao_id){
        return res.status(403).json({success: false, message: 'Kakao_id not given in Body. Check parameters.'})
    }
    /*
    let key = 'jellyKey';
    let input = kakao_id;

    // 암호화
    let cipher = crypto.createCipher('aes192', key);    // Cipher 객체 생성
    cipher.update(input, 'utf8', 'base64');             // 인코딩 방식에 따라 암호화
    let encrypted_kakao_id = cipher.final('base64');        // 암호화된 결과 값
    */
    /*
        // 복호화
        let decipher = crypto.createDecipher('aes192', key); // Decipher 객체 생성
        decipher.update(encrypted_kakao_id, 'base64', 'utf8');   // 인코딩 방식에 따라 복호화
        let decipheredOutput = decipher.final('utf8');       // 복호화된 결과 값

        // 출력
        console.log('기존 문자열: ' + input);
        console.log('암호화된 문자열: ' + encrypted_kakao_id);
        console.log('복호화된 문자열: ' + decipheredOutput);
    */
    models.Patient.findOne({
        where: {
            kakao_id: kakao_id
        }
    }).then(patient => {
        if (patient){
            return res.status(403).json({success: false, message: 'patient with same kakao_id already exists'})
        } else {
            models.Patient.create({
                kakao_id: kakao_id,
                //encrypted_kakao_id: encrypted_kakao_id,
                scenario: '1',
                state: 'init',
                registered: '0'
            }).then(patient => {
                return res.status(201).json({success: true, message: 'patient created.', patient: patient})
            }).catch(function (err){
                return res.status(500).json({success: false, message: 'Error while creating Patient in DB.', error: err.message, err: err})
            });
        }
    })
}

function updatePatient (req, res) {
    console.log('updatePatient called.')
    let kakao_id

    if (req.body){
        kakao_id = req.body.kakao_id
        if (!kakao_id){
            return res.status(403).json({success: false, message: 'kakao_id not provided.'})
        }
    } else {
        return res.status(403).json({success: false, message: 'No input parameters received in body.'})
    }

    const name = req.body.name
    const initials = req.body.initials
    const email = req.body.email
    const patient_code = req.body.patient_code
    const doctor_code = req.body.doctor_code
    const phone = req.body.phone
    const sex = req.body.sex
    const birthday = req.body.birthday
    /*
        // 암호화
        let cipher = crypto.createCipher('aes192', key);    // Cipher 객체 생성
        cipher.update(input, 'utf8', 'base64');             // 인코딩 방식에 따라 암호화
        let encrypted_kakao_id = cipher.final('base64');        // 암호화된 결과 값
        console.log('암호화된 문자열: ' + encrypted_kakao_id);

        if (encrypted_kakao_id==null){
            encrypted_kakao_id = '123456';
        }

       */
    //const encrypted_kakao_id = kakao_id + '1';

    if(doctor_code){

        /*
        models.sequelize.query('INSERT INTO medicine_times (kakaoid, encrypted_kakaoid, slot, time) ' +
            'VALUES (' + kakao_id + ", " + kakao_id + ", 0, 5);");
        models.sequelize.query('INSERT INTO medicine_times (kakaoid, encrypted_kakaoid, slot, time) ' +
            'VALUES (' + kakao_id + ", " + kakao_id + ", 1, 12);");
        models.sequelize.query('INSERT INTO medicine_times (kakaoid, encrypted_kakaoid, slot, time) ' +
            'VALUES (' + kakao_id + ", " + kakao_id + ", 2, 17);");
        */

        models.Medicine_time.create({
            kakao_id: kakao_id,
            encrypted_kakao_id: kakao_id,
            slot: 0,
            time: 5
        });

        models.Medicine_time.create({
            kakao_id: kakao_id,
            encrypted_kakao_id: kakao_id,
            slot: 1,
            time: 12
        });

        models.Medicine_time.create({
            kakao_id: kakao_id,
            encrypted_kakao_id: kakao_id,
            slot: 2,
            time: 17
        });

        models.Patient.update({
            doctor_code: doctor_code, // What to update
            registered: 0,
            daily_scenario: 0,
            stamp: 0,
            encrypted_kakao_id: kakao_id
        }, {
            where: {
                kakao_id: kakao_id
            } // Condition
        }).then(result => {
            console.log('result: ' + result.toString())
            if (result){
                return res.status(200).json({success: true, message: 'Update doctor_code and registered complete. Result: ' + result.toString()})
            } else {
                return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given kakao_id. ' +
                    + result.toString()})
            }
        }).catch(function (err){
            return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
        })

    }

    let param_name;
    let param_value;
    if (name){
        param_name = 'name'
        param_value = name
    } else if (initials){
        param_name = 'initials'
        param_value = initials
    } else if (patient_code){
        param_name = 'patient_code'
        param_value = patient_code
    } else if (email) {
        param_name = 'patient_email'
        param_value = email
    }  else if (phone) {
        param_name = 'phone'
        param_value = phone
    } else if (sex) {
        param_name = 'sex'
        param_value = sex
    } else if (birthday) {
        param_name = 'birthday'
        param_value = birthday
    }

    if (param_value){
        models.sequelize.query('UPDATE patients SET ' + param_name + " = '" + param_value + "' WHERE kakao_id = '" + kakao_id + "';").then(result => {
            if (result){
                console.log('result: ' + result.toString())
                return res.status(200).json({success: true, message: 'patient data updated. Result info: ' + result[0].info})
            } else {
                return res.status(403).json({success: false, message: 'patient update query failed.'})
            }
        }).catch(function (err){
            return res.status(403).json({success: false, message: 'Unknown error while querying patients table for update from ChatBot server. err: ' + err.message})
        })
    } else {
        return res.status(403).json({success: false, message: 'No parameter given. Please check again. Required: kakao_id. ' +
            'And one more parameter is required among name, initials, patient_code, email, phone, sex, birthday'})
    }
}

function updateStamp (req, res) {
    const kakao_id = req.body.kakao_id
    const stamp = req.body.stamp

    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    //if ((scenario.indexOf("201") == 0) && (state == 'init')){
    models.Patient.update(
        {
            stamp: stamp
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'Patient Stamp Update complete.', stamp: stamp})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'Patient Stamp Update Update failed. Error: ' + err.message})
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
    models.Patient.update(
        {
            daily_scenario: daily_scenario
        },     // What to update
        {where: {
                kakao_id: kakao_id}
        })  // Condition
        .then(result => {
            return res.status(200).json({success: true, message: 'Patient daily_scenario Update complete.', daily_scenario: daily_scenario})
        }).catch(function (err){
        return res.status(403).json({success: false, message: 'Patient daily_scenario Update Update failed. Error: ' + err.message})
    })
    //}
}

function getPatientInfo (req, res) {
    console.log('getPatientInfo called.')
    const kakao_id = req.params.kakao_id
    let nowDate = new Date();
    nowDate.getTime();
    const now = nowDate;

    if (kakao_id) {
        models.Patient.findOne({
            where: {
                kakao_id: kakao_id
            }
        }).then(patient => {
            if (!patient){
                return res.status(403).json({success: false, message: 'patient not found with kakao_id: ' + kakao_id})
            }
            models.PatientLog.findAll({
                where: {
                    kakao_id: kakao_id
                },
                order: [
                    // Will escape username and validate DESC against a list of valid direction parameters
                    ['id', 'DESC']
                ]
            }).then(patientLog => {
                console.log('patientLog findAll finished.')
                if (patientLog){
                    //console.log(patientLog);
                    models.Patient.update({
                        exit: 0,
                        //updated_at: now
                    }, {
                        where: {kakao_id: kakao_id} // Condition
                    })
                    return res.status(200).json({success: true, message: 'patient and patient_log both found.', patient_info: patient, patient_log: patientLog})
                } else {
                    // Return when no data found
                    return res.status(403).json({success: false, message: 'No patientLog found with given kakao_id.'})
                }
            }).catch(function (err){
                return res.status(403).json({success: false, patient_info: patient, message: 'patient info found. But error occured while retrieving logs.', error: err.message})
            })
        }).catch(function (err){
            return res.status(403).json({success: false, message: err.message})
        })
    } else {
        return res.status(403).json({success: false, message: 'kakao_id not given.'})
    }
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

    models.Patient.update({
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
            return res.status(200).json({success: true, message: 'No patient found to update or Patient does not exist with given kakao_id. ' +
                + result.toString()})
        }
    }).catch(function (err){
        return res.status(500).json({success: false, message: 'Updated failed. Error: ' + err.message})
    })

}

function createPatientLog (req, res){
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

    models.PatientLog.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        scenario: scenario,
        state: state,
        content: content,
        date: date,
        type: type,
        answer_num: answer_num
    }).catch(function (err){
        return res.status(500).json({success: false, error: err.message})
    })
}

function createPatientImage (req, res) {
    const kakao_id = req.body.kakao_id
    const image_link = req.body.image_link
    const medical_image = req.body.medical_image
    const date = req.body.date
    //let nowDate = new Date();
    //nowDate.getTime();
    //const now = nowDate;

    models.Patient_image.create({
        kakao_id: kakao_id,
        encrypted_kakao_id: kakao_id,
        image_link: image_link,
        medical_image: medical_image,
        date: date,
    }).then(result => {
        return res.status(200).json({
            success: true,
            message: 'Patient image Create complete.',
            daily_scenario: daily_scenario
        })
    }).catch(function (err) {
        return res.status(403).json({success: false, message: 'Patient image Create failed. Error: ' + err.message})
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
        models.sequelize.query('UPDATE patients SET ' + param_name + " = '" + param_value + "' WHERE kakao_id = '" + kakao_id + "';").then(result => {
            if (result){
                return res.status(200).json({success: true, message: 'patient data updated. Result info: ' + result[0].info})
            } else {
                return res.status(403).json({success: false, message: 'patient update query failed.'})
            }
        }).catch(function (err){
            return res.status(403).json({success: false, message: 'Unknown error while querying patients table for update from ChatBot server. err: ' + err.message})
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

module.exports = {
    getPatientChartURL: getPatientChartURL,

    registerPatient: registerPatient,
    updatePatient: updatePatient,
    updateDaily: updateDaily,
    updateStamp: updateStamp,
    createPatientImage: createPatientImage,
    getPatientInfo: getPatientInfo,
    updateExit: updateExit,
    createPatientLog: createPatientLog,

    createMedicineTime: createMedicineTime,
    getMedicineTime: getMedicineTime,
    // updateMedicineTime: updateMedicineTime,

    createMedicineCheck: createMedicineCheck,
    getMedicineCheck: getMedicineCheck,
    createMoodCheck: createMoodCheck,
    createMoodCheckText: createMoodCheckText,
    getMedicineTimeToCheck: getMedicineTimeToCheck,
    verifyDoctorCode: verifyDoctorCode
}