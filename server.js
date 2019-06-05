// Dependencies
//====================================================
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var cheerio = require ("cheerio");

// Port
//====================================================
var PORT = process.env.PORT || 3000;

// Initiate express
//====================================================
var app = express();

// Express router
//====================================================
var router = express.Router();

// Route
//====================================================
require("./config/routes")(router);

app.use(express.static(__dirname + "/public"));

// Handlebars views
//====================================================
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));

// Middleware
//====================================================
app.use(router);


// If deployed, use deployed db else use local mongoHeadlines db
//====================================================
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose
//====================================================
mongoose.connect(MONGODB_URI, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection is successful");
    }
});

// Listener
//====================================================
app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
});
