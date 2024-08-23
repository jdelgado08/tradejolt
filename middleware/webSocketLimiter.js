const rateLimit = require('express-rate-limit');

//after change for dinamique
const wsLimiter = rateLimit({
    windowMs : 60*1000, //1min
    max: 10, //each IP 10
    message: 'Too many websocket connections from this IP, try again later',

});

module.exports = wsLimiter;