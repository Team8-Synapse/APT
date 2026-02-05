const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, notificationController.getNotifications);
router.put('/read-all', auth, notificationController.markAllRead);
router.put('/:id', auth, notificationController.markAsRead);
router.post('/', auth, authorize('admin'), notificationController.createNotification);

module.exports = router;
