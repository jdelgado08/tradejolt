const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { 
    getAllReports, 
    getAccountReport, 
    createCustomReport,
    deleteReport,
} = require('../controllers/reportController');

router.get('/', authenticateUser, getAllReports);
router.delete('/:id', authenticateUser, deleteReport);
router.get('/account/:accountId', authenticateUser, getAccountReport);
router.post('/custom', authenticateUser, createCustomReport);

module.exports = router;
