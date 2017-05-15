var config  = require('config');
var winston = require('winston');

var logger = new winston.Logger ({
    transports : [
        new winston.transports.Console ({json:false, timestamp:true, formatter : plainLog}),
        new winston.transports.File({
            name        :   'Info',
            filename    :   config.get('logging.info'),
            json        :   true,
            level       :   'info',
            timestamp   :   true
        }),
        new winston.transports.File({
            name        :   'Debug',
            filename    :   config.get('logging.debug'),
            json        :   true,
            level       :   'debug',
            timestamp   :   true
        })
    ],
    exceptionHandlers: [
        new winston.transports.Console({json:true, timestamp:true}),
        new winston.transports.File({ filename: config.get('logging.error'), json:true })
    ],
    exitOnError : false
});

function plainLog(options){
    return options.message;
}

function logWithDate(options){
    return new Date().toISOString() + ' - ' + options.message;
}

module.exports = logger;