/**
 * Batch Scheduler index
 *
 * @date 2018-04-02
 * @author 엄태균
 *
 */

'use strict';

const models = require('../../models');
const Op = require('sequelize').Op;
const async = require('async');
var cron = require('node-cron');
var request = require('request');
var moment = require('moment');
//var logger = require('../../config/winston');

let serviceKey = 'AuD1lSRzmSkPUA8g67GQ7j401ZJUfoehNzRCdam9Kvh37WR1klQgqoLKrdjvWR8RvuCvXe991jEcjAzn%2BjyPJA%3D%3D';
let numOfRows = '10';
let pageSize = '10';


function startMicroDustBatch() {
    logger.info("MicroDustBatch started !!");

    cron.schedule('0 0 5 * * *', function () {
        logger.info('running MicroDustAPI call every 5:00 AM / ' + new Date());

        let tasks = [
            // PM10
            function(cb) {
                getDustValue('PM10',(err, result) => {
                    if(err) {
                        cb(err);
                    } else {
                        cb(null, result)
                    }
                });
            },
            // PM25
            function(cb) {
                getDustValue('PM25',(err, result) => {
                    if(err) {
                        cb(err);
                    } else {
                        cb(null, result)
                    }
                });
            },
        ];

        async.parallel(tasks,(err, result) => {
            if (err) {
                logger.error("error : ",err);
            } else {
                // Write to DB
                models.Weather.create({
                    date: moment().subtract(1,'days').format('YYYY-MM-DD'),
                    pm10: result[0],
                    pm25: result[1]
                }).then(result => {
                    logger.debug("Weather inserted successfully : ",JSON.stringify(result,null,2));
                }).catch(function (err){
                    logger.error("Error while inserting weather DB :", JSON.stringify(err,null,2));
                });
            }
        })
    }).start();
};

function getDustValue(itemCode, cb) {
    let url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst?serviceKey='+serviceKey+'&numOfRows='+numOfRows+
        '&pageSize='+pageSize+'&itemCode='+itemCode+'&dataGubun=DAILY&searchCondition=WEEK&_returnType=json';

    request(url, function (error, response, body) {
        if(error) cb('Error requesting dust API : '+error);
        if(response.statusCode == '200') {
            let result = JSON.parse(body);

            let seoul = result.list[0].seoul;
            let dataTime = result.list[0].dataTime;
            let yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

            if(dataTime == yesterday) {
                cb(null, seoul);
            } else {
                cb('dataTime is wrong : '+dataTime);
            }
        } else {
            cb("Unexpected Status for dust API : "+response.statusCode);
        }
    });
}

module.exports = {
    startMicroDustBatch:startMicroDustBatch
};