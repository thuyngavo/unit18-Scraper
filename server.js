// require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

// set up our port to be either the host's or our local port 3000
var PORT = process.env.PORT || 3000;

// instantiate our express app
var app = express();

// set up an express router
var router = express.Router();

// require our routes file pass our router object
require("./config/routes")(router);

// designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

// connect handlebars to our express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// use bodyparser in our app
app.use(bodyParser.urlencoded({
    extended: false
}));

// have every request go through our router middleware
app.use(router);
// If deployed, use deployed db else use local mongoHeadlines db
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose to out database
mongoose.connect(MONGODB_URI, function(error) {
    //Log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }
    // or log a success message
    else {
        console.log("mongoose connection is successful");
    }
});

// listen on the port
app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
});



// // Dependencies
// // =============================================================
// const express = require("express");
// const bodyParser = require("body-parser");
// const exphbs = require("express-handlebars");
// const cheerio = require("cheerio");
// const mongoose = require("mongoose");
// var logger = require("morgan");
// var axios = require("axios");

// var db = require("./models");

// const app = express();
// const PORT = process.env.PORT || 3000;

// const router = express.Router();

// require(".config/routes")(router);

// app.engine("handlebars", exphbs({defaultLayout: "main"}));
// app.set("view engine", "handlebars");

// app.use(express.static(__dirname + "public"));


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(router);

// // If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// // mongoose.connect(MONGODB_URI);


// mongoose.connect(MONGODB_URI, function(err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log("connection successful");
//     }
// });

// // Starting our Express app
// // =============================================================
// app.listen(PORT, function () {
//     console.log("App listening on PORT " + PORT);
// });