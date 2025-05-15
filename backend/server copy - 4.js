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
            startDate: "2024-05-13",
            endDate: "today",
          },
        ],
        dimensions: [{ name: "eventName" }],
        metrics: [
          { name: "totalUsers" },  // index 0
          { name: "newUsers" },    // index 1
          { name: "sessions" },    // index 2
          { name: "eventCount" },  // index 3
        ]
        
      },
    });

    let pageViews = 0;
    let scrolls = 0;
    let totalUsers = "0";
    let sessions = "0";

    for (const row of response.data.rows || []) {
      const eventName = row.dimensionValues[0].value;
      // console.log(eventName, 'eventname---------');
      const eventCount = parseInt(row.metricValues[3]?.value || "0", 10); // index 3 = eventCount
    console.log('eventCount-------', eventName, eventCount);
      if (eventName === "page_view") pageViews = eventCount;
      if (eventName === "scroll") scrolls = eventCount;

      console.log('metric value ------' , row.metricValues);
    
      totalUsers = row.metricValues[0]?.value || totalUsers; // totalUsers = index 0
      sessions = row.metricValues[2]?.value || sessions;     // sessions = index 2

    }
    console.log('===================================================================================================');
    

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
