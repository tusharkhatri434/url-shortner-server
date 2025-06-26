const express = require('express');
const router = express.Router();
const {
  createShortUrl,
  getUserUrls,
  deleteUrl,
  updateUrl,
//   redirectToOriginalUrl
} = require('../controllers/urlController');

const protect = require('../middlewares/authMiddleware');

// POST /api/urls
router.post('/', protect, createShortUrl);

// GET /api/v1/urls
router.get('/', protect, getUserUrls);

// PUT /api/v1/urls/:id
router.put('/:id', protect, updateUrl);

// DELETE /api/v1/urls/:id
router.delete('/:id', protect, deleteUrl);

// GET /:shortCode — redirection (no token)
// router.get('/r/:shortCode', redirectToOriginalUrl);

module.exports = router;
