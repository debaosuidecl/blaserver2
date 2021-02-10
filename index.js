const express = require("express");
const path = require("path");
var useragent = require("useragent");
// const request = require("r")
// const connectDB = require("./config/db");
// const path = require("path");
// const User = require("./models/UserAuth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const request = require("request");
const app = express();
const bodyParser = require("body-parser");
const apikey = "0e5d2c7f52723ef13dde434e89d81d63";
app.use(bodyParser.json({ limit: "900mb" }));
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ limit: "900mb", extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Request-Headers", "GET, PUT, POST, DELETE");
  next();
});
let PORT = process.env.PORT || 3400;
app.listen(PORT, function () {
  console.log(`listening to requests on port ${PORT}`);
  //   connectDB();
});
app.use("/images", express.static("images"));
app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.get("/unsub", async (req, res) => {
  res.render("unsub.ejs");
});

app.post("/api/besttextsms", async (req, res) => {
  const { source, destination, message } = req.body;
  var options3 = {
    url: `https://besttext.com/api/v1/direct/messages/sms?token=E2kTAAdtGCnvxIt0fRC7lh9awPf6DIm3SVAsSIBxl1LSpeUwIO4nFfGpjInw`,
    method: "POST",
    forever: true,
    json: {
      source,
      destination,
      message,
    },
  };

  function callback(error, response, body) {
    console.log(body, error);
    if (error) {
      return res.status(200).send(error.response);
    }
    res.send(body);
    // }
  }
  // console.log(options3);
  request(options3, callback);
});

app.get("/test", async (req, res) => {
  //hey
  res.json({
    message: "we are live",
  });
});
app.post("/api/bulkget", async (req, res) => {
  console.log("hit here");
  let phoneList = req.body.phones;
  const response = await connectToBlacklist(phoneList);
  res.json(response);
});

function connectToBlacklist(phoneList) {
  return new Promise((resolve, reject) => {
    request(
      {
        uri: `https://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,

        json: {
          phones: phoneList,
        },

        method: "POST",
      },
      function (error, response, body) {
        if (error) reject(error);
        if (body == "undefined") reject("undefined");
        else {
          resolve(body);
        }
      }
    );
  });
}
