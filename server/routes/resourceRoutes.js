const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, resourceController.getResources);
router.post('/', auth, authorize('admin'), resourceController.addResource);
router.get('/:id', auth, resourceController.getResourceById);
router.put('/:id', auth, authorize('admin'), resourceController.updateResource);
router.delete('/:id', auth, authorize('admin'), resourceController.deleteResource);

module.exports = router;
