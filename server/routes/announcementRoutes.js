const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, announcementController.getAnnouncements);
router.post('/', auth, authorize('admin'), announcementController.addAnnouncement);
router.put('/:id', auth, authorize('admin'), announcementController.updateAnnouncement);
router.delete('/:id', auth, authorize('admin'), announcementController.deleteAnnouncement);

module.exports = router;
