const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth } = require('../middleware/auth');
const multer = require('multer');

// Configure multer for memory storage (buffer)
const upload = multer({ storage: multer.memoryStorage() });

router.get('/insights', auth, aiController.getInsights);
router.post('/chat', auth, aiController.getChatResponse);
router.post('/mock-interview', auth, aiController.generateMockInterview);
router.post('/mock-evaluate', auth, aiController.evaluateMockAnswer); // Keeping legacy just in case
router.post('/mock-interview-chat', auth, aiController.interviewChat); // New interactive chat
// Updated to accept a single file named 'resume'
router.post('/analyze-resume', auth, upload.single('resume'), aiController.analyzeResume);
router.post('/company-research', auth, aiController.companyResearch);
router.get('/admin-insights', auth, aiController.adminInsights);

module.exports = router;
