const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  'GOOGLE_CLIENT_ID', // CLIENT_ID
  'GOOGLE_CLIENT_SECRET', // CLIENT_SECRET
  'REDIRECT_URI' // REDIRECT_URI
);

// Set tokens (from OAuth 2.0 Playground)
oauth2Client.setCredentials({
  access_token: 'GOOGLE_ACCESS_TOKEN',        // 🔁 Replace with your real token
  refresh_token: 'GOOGLE_REFRESH_TOKEN',         // 🔁 Replace with your real refresh token
});

// Google Analytics Data API v1beta
const analyticsData = google.analyticsdata('v1beta');

// Replace with your GA4 property ID
const GA4_PROPERTY_ID = '488377611';

// Route to get total visitors
app.get('/api/total-visitors', async (req, res) => {
  try {
    const response = await analyticsData.properties.runReport({
      property: `properties/${GA4_PROPERTY_ID}`,
      auth: oauth2Client,
      requestBody: {
        dateRanges: [
          {
            startDate: '300daysAgo',
            endDate: 'today',
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
      },
    });

    const totalVisitors = response.data.rows?.[0]?.metricValues?.[0]?.value || '0';
    res.json({ totalVisitors });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).send('Failed to fetch visitor data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});









// const express = require('express');
// const { google } = require('googleapis');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // OAuth2 credentials
// const oauth2Client = new google.auth.OAuth2(
//   '65192405850-pgqiba11jge9900pav06ctr9q3jks3hi.apps.googleusercontent.com', // CLIENT_ID
//   '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', // CLIENT_SECRET
//   'https://developers.google.com/oauthplayground' // REDIRECT_URI
// );

// // Auth URL to redirect user
// app.get('/auth', (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: 'https://www.googleapis.com/auth/analytics.readonly',
//   });
//   res.redirect(url);
// });

// // Callback to get access token
// app.get('/auth/callback', async (req, res) => {
//   const code = req.query.code;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     res.send('Authentication successful! Tokens saved.');
//   } catch (err) {
//     console.error('Auth Error:', err);
//     res.status(500).send('Authentication failed');
//   }
// });

// // Google Analytics GA4 (v1beta)
// const analyticsData = google.analyticsdata('v1beta');
// const GA4_PROPERTY_ID = '488377611'; // Your GA4 property ID

// // Route to get active users
// app.get('/api/total-visitors', async (req, res) => {
//   try {
//     const response = await analyticsData.properties.runReport({
//       property: `properties/${GA4_PROPERTY_ID}`,
//       auth: oauth2Client,
//       requestBody: {
//         dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
//         metrics: [{ name: 'activeUsers' }],
//       },
//     });

//     const totalVisitors = response.data.rows?.[0]?.metricValues?.[0]?.value || '0';
//     res.json({ totalVisitors });
//   } catch (err) {
//     console.error('GA4 API Error:', err);
//     res.status(500).send('Failed to fetch visitors');
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
