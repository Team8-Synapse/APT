const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.get('/student-pdf', auth, reportController.generateStudentReport);
router.get('/admin-csv', auth, authorize('admin'), reportController.generateAdminCSV);
router.get('/company-csv', auth, authorize('admin'), reportController.generateCompanyCSV);
router.get('/ai-insights', auth, authorize('admin'), reportController.getAIInsights);
router.get('/count', auth, authorize('admin'), reportController.getReportCount);

// New endpoints for AdminReports.jsx
router.get('/generate', auth, authorize('admin'), reportController.generateReport);
router.post('/ai-analyze', auth, authorize('admin'), reportController.aiAnalyze);

module.exports = router;
