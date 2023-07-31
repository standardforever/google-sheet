const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
const PORT = 3000;

// Load credentials from the downloaded JSON file
const credentials = require('./credentials.json');

// Set up authentication
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Create the Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Function to append data to the Google Sheet
async function appendToSheet(spreadsheetId, values) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1', // Append to the first sheet in the spreadsheet
      valueInputOption: 'RAW',
      resource: { values },
    });

    console.log(`${response.data.updates.updatedCells} cells appended.`);
  } catch (error) {
    console.error('Error appending to the Google Sheet:', error);
  }
}

// Route to append data to the Google Sheet
app.post('/api/append-to-sheet', async (req, res) => {
  const spreadsheetId = '1O4uVAA7X_hbITXqL9o-G2dHY1WaBXPhccRaceHhd2wM';
  const values = Object.values(req.body); // Assuming the request body is an array of arrays
    console.log(values)
    const newList = [];
    newList.push(values)
  await appendToSheet(spreadsheetId, newList);

  res.send('Data appended to Google Sheet.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
