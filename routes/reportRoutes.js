const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication')
const accountCheckPermissions = require('../utils/accountCheckPermissions');
const { 
  getAllReports, 
  getAccountReport,
  createCustomReport,
} = require('../controllers/reportController');

router.get('/', getAllReports);
router.get('/account/:accountId', authenticateUser, getAccountReport);
router.post('/custom',authenticateUser, accountCheckPermissions, createCustomReport);

module.exports = router;
