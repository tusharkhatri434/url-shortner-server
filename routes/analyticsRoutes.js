const express = require('express');
const getAnalytics = require('../controllers/analyticsController');
const router = express.Router();
// const { getAnalyticsForUrl } = require('../../controllers/analyticsController');
// const protect = require('../../middlewares/authMiddleware');

// // GET /api/v1/analytics/:urlId
// router.get('/:urlId', protect, getAnalyticsForUrl);

router.get("/:shortCode",getAnalytics);

module.exports = router;
