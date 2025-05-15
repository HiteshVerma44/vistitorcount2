const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const analyticsData = google.analyticsdata('v1beta');
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// Route to get real-time active users
app.get('/api/realtime-visitors', async (req, res) => {
  try {
    const response = await analyticsData.properties.runRealtimeReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      auth: oauth2Client,
      requestBody: {
        metrics: [{ name: 'activeUsers' }]
      }
    });

    res.json({
      totalActiveUsers: response.data.totals?.[0]?.metricValues?.[0]?.value || '0'
    });

  } catch (error) {
    console.error('❌ Error fetching realtime analytics data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch real-time data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Realtime Analytics Server running at: http://localhost:${PORT}`);
});
