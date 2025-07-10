const Url = require('../models/Url');
const Analytics = require('../models/Analytics');

const getAnalytics = async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Step 1: Get the original URL document
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    // Step 2: Get the associated analytics document
    const analytics = await Analytics.findOne({ urlId: url._id });
    if (!analytics) return res.status(404).json({ message: 'No analytics found for this URL' });

    // Step 3: Prepare response
    const result = {
      originalUrl: url.originalUrl,
      shortCode: shortCode,
      totalClicks: analytics.totalClicks,
      uniqueVisitors: analytics.uniqueVisitors,
      dailyClicks: analytics.dailyClicks,
      hourlyActivity: analytics.hourlyActivity,
      deviceDistribution: analytics.deviceDistribution,
      topLocations: analytics.topLocations,
      weeklySnapshots: analytics.weeklySnapshots,
      lastUpdated: analytics.lastUpdated,
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getAnalytics;
