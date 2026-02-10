const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

// Public route - anyone can view announcements (filtered if not admin)
router.get('/', optionalAuth, announcementController.getAnnouncements);

// Admin-only routes
router.post('/', auth, authorize('admin'), announcementController.addAnnouncement);
router.put('/:id', auth, authorize('admin'), announcementController.updateAnnouncement);
router.delete('/:id', auth, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;
