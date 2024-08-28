const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const {
    createPriceAlert,
    getPriceAlerts,
    deletePriceAlert,
    updatePriceAlert,
    manualTrigger,
} = require('../controllers/priceAlertController');

router.post('/', authenticateUser, createPriceAlert);

router.get('/', authenticateUser, getPriceAlerts);

router.delete('/:id', authenticateUser, deletePriceAlert);

router.put('/:id', authenticateUser, updatePriceAlert);

module.exports = router;
