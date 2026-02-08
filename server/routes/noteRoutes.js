const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { auth } = require('../middleware/auth');

router.get('/student/:studentId', auth, noteController.getNotes);
router.post('/create', auth, noteController.addNote);
router.put('/:id', auth, noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);

module.exports = router;
