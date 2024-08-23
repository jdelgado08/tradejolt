const express = require('express');
const router = express.Router();
const { 
    subscribeTrades, 
    unsubscribeTrades, 
    stopWebSocket 
} = require('../controllers/priceAlertController');

const wsLimiter = require('../middleware/webSocketLimiter');

router.post('/subscribe', wsLimiter, subscribeTrades);
router.post('/unsubscribe', wsLimiter, unsubscribeTrades);
router.post('/stop', wsLimiter, stopWebSocket);

module.exports = router;
