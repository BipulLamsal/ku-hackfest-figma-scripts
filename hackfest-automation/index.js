//server essentials
const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
const port = 1939;

// this file includes redding the certificate csv file. Make sure to change file name
const fileName = "Certificate.csv";
const fs = require("fs");
const papa = require("papaparse");
//file name is mentioned here
fs.readFile(fileName, "utf-8", (err, data) => {
  if (err) {
    console.log("error reading the csv file : ", err);
    return;
  }
  parseCSV(data);
});
function parseCSV(data) {
  papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log("Parsing the csv file :");
      parsedData = results;
      //running the server after file gets parsed
      app.get("/api/certificates", (req, res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.json(parsedData);
      });
      app.listen(port, () => {
        console.log(`server runnign at PORT ${port}`);
      });
    },
    error: function (err) {
      console.log("Parsing Error", err.message);
    },
  });
}
