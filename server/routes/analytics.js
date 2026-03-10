const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth, authorize } = require('../middleware/auth');

// GET all dashboard analytics (Admin Only)
router.get('/dashboard', auth, authorize('admin'), analyticsController.getDashboardAnalytics);

module.exports = router;
