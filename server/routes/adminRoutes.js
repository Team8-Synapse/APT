const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.get('/dashboard-stats', auth, authorize('admin'), adminController.getDashboardStats);
router.post('/shortlist', auth, authorize('admin'), adminController.shortlistStudents);
router.post('/drives', auth, authorize('admin'), adminController.addPlacementDrive);
router.delete('/drives/:id', auth, authorize('admin'), adminController.deleteDrive);

module.exports = router;
