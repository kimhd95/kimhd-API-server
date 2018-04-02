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
var cron = require('node-cron');
var request = require('request');
var logger = require('../../config/winston');

function startMicroDustBatch() {
    logger.info("MicroDustBatch started !!");

    cron.schedule('*/10 * * * * *', function () {
        logger.debug('running MicroDustAPI call every 5:00 AM / ' + new Date());

        let serviceKey = 'AuD1lSRzmSkPUA8g67GQ7j401ZJUfoehNzRCdam9Kvh37WR1klQgqoLKrdjvWR8RvuCvXe991jEcjAzn%2BjyPJA%3D%3D';
        let numOfRows = '10';
        let pageSize = '10';
        let itemCode = 'PM10';

        let url = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst?serviceKey='+serviceKey+'&numOfRows='+numOfRows+
            '&pageSize='+pageSize+'&itemCode='+itemCode+'&dataGubun=DAILY&searchCondition=WEEK';

        request(url, function (error, response, body) {
            logger.error('error:', error); // Print the error if one occurred
            logger.debug('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            logger.debug('body:', body); // Print the HTML for the Google homepage.
        });
    }).start();
};

module.exports = {
    startMicroDustBatch:startMicroDustBatch
};