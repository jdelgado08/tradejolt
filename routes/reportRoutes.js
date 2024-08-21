const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { getAllReports, getAccountReport, createCustomReport } = require('../controllers/reportController');

router.get('/', authenticateUser, getAllReports);
router.get('/account/:accountId', authenticateUser, getAccountReport);
router.post('/custom', authenticateUser, createCustomReport);

module.exports = router;
