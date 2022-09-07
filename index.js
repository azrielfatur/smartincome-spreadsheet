const express = require("express");
var cors = require('cors');
const { google } = require("googleapis");

const app = express();
app.use(express.json())
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

app.post("/entries", async (req, res) => {
  const { pic_name, company_name, phone_number } = req.body;

  console.log(req.body);

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1OseJ7nKQZE6s5RWz77ZU5HTAUVer2C_hOsI6-GXO2KU";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  // const getRows = await googleSheets.spreadsheets.values.get({
  //   auth,
  //   spreadsheetId,
  //   range: "'Form Entry'!A:A",
  // });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "SheetTest",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[null, pic_name, company_name, phone_number]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});

app.listen(1337, (req, res) => console.log("running on 1337"));