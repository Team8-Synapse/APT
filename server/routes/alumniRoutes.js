const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, alumniController.getInsights);
router.post('/', auth, authorize('admin'), alumniController.addInsight);
router.get('/directory', auth, alumniController.getDirectory);
router.post('/member', auth, authorize('admin'), alumniController.addAlumni);
router.put('/member/:id', auth, authorize('admin'), alumniController.updateAlumni);
router.delete('/member/:id', auth, authorize('admin'), alumniController.deleteAlumni);
router.get('/topics', auth, alumniController.getTopics);

module.exports = router;
