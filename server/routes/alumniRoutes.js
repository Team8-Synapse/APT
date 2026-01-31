const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, alumniController.getInsights);
router.post('/', auth, authorize('admin'), alumniController.addInsight);
router.get('/topics', auth, alumniController.getTopics);

module.exports = router;
