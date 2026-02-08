const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', auth, resourceController.getResources);
router.post('/', auth, authorize('admin'), upload.single('file'), resourceController.addResource);
router.get('/:id', auth, resourceController.getResourceById);
router.put('/:id', auth, authorize('admin'), upload.single('file'), resourceController.updateResource);
router.delete('/:id', auth, authorize('admin'), resourceController.deleteResource);

module.exports = router;
