const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth } = require('../middleware/auth');

router.get('/profile', auth, studentController.getProfile);
router.post('/profile', auth, studentController.upsertProfile);
router.get('/eligibility', auth, studentController.getEligibility);

module.exports = router;
