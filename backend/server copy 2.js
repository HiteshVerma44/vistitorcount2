const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());

console.log(process.env.REFRESH_TOKEN);
// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set credentials with refresh token (access token will refresh automatically)
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Google Analytics Data API v1beta
const analyticsData = google.analyticsdata("v1beta");

// Your GA4 Property ID
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;

// Route to get total visitors and page views
app.get("/api/total-visitors", async (req, res) => {
  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      auth: oauth2Client,
      requestBody: {
        dateRanges: [
          {
            startDate: "today",
            endDate: "today",
          },
        ],
        dimensions: [{ name: "eventName" }],
        metrics: [
          { name: "totalUsers" },
          { name: "newUsers" },
          { name: "sessions" },
          { name: "eventCount" },
        ],
      },
    });

    let pageViews = 0;
    let scrolls = 0;
    let totalUsers = "0";
    let sessions = "0";

    for (const row of response.data.rows || []) {
      const eventName = row.dimensionValues[0].value;
      const eventCount = parseInt(row.metricValues[2]?.value || "0", 10);

      if (eventName === "page_view") pageViews = eventCount;
      if (eventName === "scroll") scrolls = eventCount;

      totalUsers = row.metricValues[0]?.value || totalUsers;
      sessions = row.metricValues[1]?.value || sessions;
    }

    res.json({
      totalUsers,
      totalSessions: sessions,
      pageViews: pageViews.toString(),
      scrolls: scrolls.toString(),
    });
  } catch (error) {
    console.error(
      "Error fetching analytics data:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to fetch visitor data");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
