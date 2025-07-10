const express = require('express');
const router = express.Router();
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const geoip = require('geoip-lite');
const parseUserAgent = require('../utils/parseUserAgent');

// Helper to get week start (Monday)
const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const redirectAndStoreAnalytics = async (req, res) => {
  const { shortCode } = req.params;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
console.log(shortCode,ip);
  try {
    const url = await Url.findOne({ shortCode });
    if (!url) return res.status(404).send('URL not found');

    const urlId = url._id;
    const now = new Date();
    const currentWeekStart = getWeekStart(now);
    const day = now.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    const hour = `${String(now.getHours()).padStart(2, '0')}:00`;

    const geo = geoip.lookup(ip);
    const country = geo?.country || 'Unknown';

    const { deviceType } = parseUserAgent(req.headers['user-agent']);

    let analytics = await Analytics.findOne({ urlId });

    if (!analytics) {
      analytics = new Analytics({
        urlId,
        lastUpdated: now,
        ipSet: [ip],
        totalClicks: 1,
        uniqueVisitors: 1,
        dailyClicks: { [day]: 1 },
        hourlyActivity: { [hour]: 1 },
        deviceDistribution: { [deviceType]: 1 },
        topLocations: { [country]: 1 },
        weeklySnapshots: [],
      });
    } else {
      // Weekly snapshot rollover
      const lastUpdatedWeek = getWeekStart(analytics.lastUpdated);
      if (currentWeekStart.getTime() !== lastUpdatedWeek.getTime()) {
        analytics.weeklySnapshots.push({
          weekStart: lastUpdatedWeek,
          totalClicks: analytics.totalClicks,
          uniqueVisitors: analytics.uniqueVisitors,
        });
        analytics.weeklySnapshots = analytics.weeklySnapshots.slice(-4); // Keep last 4
        analytics.dailyClicks = {};
        analytics.hourlyActivity = {};
      }

      analytics.totalClicks += 1;
      if (!analytics.ipSet.includes(ip)) {
        analytics.uniqueVisitors += 1;
        analytics.ipSet.push(ip);
      }

      // Update fields (make sure objects are initialized)
      analytics.dailyClicks[day] = (analytics.dailyClicks[day] || 0) + 1;
      analytics.hourlyActivity[hour] = (analytics.hourlyActivity[hour] || 0) + 1;
      analytics.deviceDistribution[deviceType] = (analytics.deviceDistribution[deviceType] || 0) + 1;
      analytics.topLocations[country] = (analytics.topLocations[country] || 0) + 1;

      analytics.lastUpdated = now;
    }

    // Redirect user
    res.redirect(url.originalUrl);

    // Save analytics in the background
    analytics.save().catch(console.error);

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

router.get("/:shortCode",redirectAndStoreAnalytics);


module.exports = router;
