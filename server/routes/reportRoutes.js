const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.get('/student-pdf', auth, reportController.generateStudentReport);
router.get('/admin-csv', auth, authorize('admin'), reportController.generateAdminCSV);
router.get('/company-csv', auth, authorize('admin'), reportController.generateCompanyCSV);

module.exports = router;
