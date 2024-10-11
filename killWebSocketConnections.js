const { stopWebSocket } = require('./utils/apcaWsClient'); 

console.log('Killing all WebSocket connections before deployment...');
stopWebSocket();
