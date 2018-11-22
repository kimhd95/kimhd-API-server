const models = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');

const timeGapToCheckMedicineCheckConnection = 1000 * 60* 30 // 30 minutes.

function now(date) {
    const m = date.getMonth()+1;
    const d = date.getDate();
    const h = date.getHours();
    const i = date.getMinutes();
    const s = date.getSeconds();
    // return date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d)+' '+(h>9?h:'0'+h)+':'+(i>9?i:'0'+i)+':'+(s>9?s:'0'+s);
    return date.getFullYear()+'-'+m+'-'+d+' '+h+':'+i+':'+s;
}

function getUsers(req, res) {
    models.User.findAll({
    }).then(result => {
        res.json(result);
    })
}

function getUserWithId(req, res) {
    models.User.findOne({
        where: {
            kakao_id: req.body.kakao_id
        }
    }).then(result => {
        res.json(result);
    })
}

// TODO: Develop later. Not used now: 알림톡
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

function getBeerInfo(req, res) {
    models.Beer.findOne({
        where: {
            id: req.params.id
        }
    }).then(result => {
        if(result){
            return res.status(200).json(result);
        }else{
            return res.status(404).json({error: 'no Beer column for '+id});
        }
    })
}

module.exports = {
    getUsers: getUsers,
    getUserWithId: getUserWithId,
    getBeerInfo: getBeerInfo,

    // Below methods requires APIKey.

    // medicineTime: medicineTime,
}
