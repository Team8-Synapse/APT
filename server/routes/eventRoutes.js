const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth: auth, authorize: authorize } = require('../middleware/auth');

router.get('/', auth, eventController.getEvents);
// Admin only for modifying events
router.post('/', auth, authorize('admin'), eventController.addEvent);
router.delete('/:id', auth, authorize('admin'), eventController.deleteEvent);
router.put('/:id', auth, authorize('admin'), eventController.updateEvent);

module.exports = router;
