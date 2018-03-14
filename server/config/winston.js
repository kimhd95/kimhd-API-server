const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');

function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

const logConfig = new winston.Logger({
    transports: [
        new (winston.transports.Console) ({
            name:'debug-console',
            level:'debug',
            timestamp: timeStampFormat,
            colorize: true
        }),
        new (winstonDaily) ({
            name: 'info-file',
            filename:'./logs/app',
            datePattern: '_yyyy-MM-dd.log',
            json: false,
            colorize: false,
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'info',
            timestamp: timeStampFormat
        })
    ],
    exceptionHandlers: [
        new (winstonDaily) ({
            name: 'exception-file',
            humanReadableUnhandledException: true,
            json: false,
            filename: './logs/app-exception',
            datePattern: '_yyyy-MM-dd.log',
            maxsize: 50000000,
            maxFiles: 1000,
            level: 'error',
            timestamp: timeStampFormat
        }),
        new (winston.transports.Console) ({
            name: 'exception-console',
            humanReadableUnhandledException: true,
            colorize: true,
            level: 'debug',
            timestamp: timeStampFormat
        })
    ]
});

module.exports = logConfig;