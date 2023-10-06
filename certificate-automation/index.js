//server essentials
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 1939;
//make sure not to change the order of the file
//donot change the order!!
const FILENAMES = ["CSVs/ORGTEAMS.csv", "CSVs/JUDGES.csv"];
// this file includes reading the csv file. Make sure to change file name as required
const fs = require("fs");
const papa = require("papaparse");
function parseFile(file) {
  //file name is mentioned here
  fs.readFile(file, "utf-8", (err, data) => {
    if (err) {
      console.log("error reading the csv file for : ", file, err);
      return;
    }
    parseCSV(data, file);
  });
}
function parseCSV(data, file) {
  papa.parse(data, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      routeHandler(results, file);
    },
    error: function (err) {
      console.log("Parsing Error", err.message);
    },
  });
}

function routeHandler(results, file) {
  const index = FILENAMES.indexOf(file);
  switch (index) {
    case 0:
      app.get("/api/teams", (req, res) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.json(results);
      });
      break;
    case 1:
      app.get("/api/judges", (req, res) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.json(results);
      });
      break;
  }
}

FILENAMES.forEach((item) => {
  parseFile(item);
});
app.listen(port, () => {
  console.log(`server runnign at PORT ${port}`);
});
