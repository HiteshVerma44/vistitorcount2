// server.js
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set credentials with refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Google Analytics Data API
const analyticsData = google.analyticsdata("v1beta");
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// Endpoint to fetch analytics data
app.get("/api/total-visitors", async (req, res) => {
  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      auth: oauth2Client,
      requestBody: {
        dateRanges: [
          {
            startDate: "2024-05-13", // customize if needed
            endDate: "today",
          },
        ],
        dimensions: [{ name: "eventName" }],
        metrics: [
          { name: "totalUsers" },   // 0
          { name: "newUsers" },     // 1
          { name: "sessions" },     // 2
          { name: "eventCount" },   // 3
        ],
      },
    });

    let pageViews = 0;
    let scrolls = 0;
    let totalUsers = "0";
    let sessions = "0";

    for (const row of response.data.rows || []) {
      const eventName = row.dimensionValues[0].value;
      const eventCount = parseInt(row.metricValues[3]?.value || "0", 10);

      if (eventName === "page_view") pageViews = eventCount;
      if (eventName === "scroll") scrolls = eventCount;

      totalUsers = row.metricValues[0]?.value || totalUsers;
      sessions = row.metricValues[2]?.value || sessions;

      console.log(`event: ${eventName}, values:`, row.metricValues);
    }

    console.log('----------------------------------------------------------------------------------------------');
    res.json({
      totalVisitors: totalUsers,          // ✅ Real visitor count
      totalSessions: sessions,
      pageViews: pageViews.toString(),    // ✅ Total page loads
      scrolls: scrolls.toString(),
    });
  } catch (error) {
    console.error("Error fetching analytics:", error.response?.data || error.message);
    res.status(500).send("Failed to fetch data");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
