// Dependencies
// =============================================================
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");

var db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

const router = express.Router();

require(".config/routes")(router);

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "public"));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(router);
const db = process.env.MONGODB_URI || "mongodb://localhost/unit18scraper";

mongoose.connect(db, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection successful");
    }
});

// Starting our Express app
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});