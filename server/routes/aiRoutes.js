const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth } = require('../middleware/auth');

router.get('/insights', auth, aiController.getInsights);
router.post('/chat', auth, aiController.getChatResponse);

module.exports = router;
