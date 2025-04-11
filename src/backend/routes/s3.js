
const express = require('express');
const router = express.Router();
const { getPresignedUrl, deleteFile } = require('../controllers/s3Controller');
const { protect } = require('../middleware/auth');

// Routes
router.route('/upload-url')
  .get(protect, getPresignedUrl);

router.route('/delete')
  .delete(protect, deleteFile);

module.exports = router;
