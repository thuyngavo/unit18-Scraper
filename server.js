// Dependencies
//====================================================
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
//====================================================
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
//====================================================
var db = require("./models");

// Initiate express
//====================================================
var app = express();

// Port
//====================================================
var PORT = process.env.PORT || 3000;



// Express router
//====================================================
var router = express.Router();

// Handlebars views
//====================================================
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Make public a static folder
app.use(express.static("public"));

// Parse request body as JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars views
app.engine("handlebars", expressHandlebars({defaultLayout: "main"}));
app.set("view engine", "handlebars");


// If deployed, use deployed db else use local mongoHeadlines db
//====================================================
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect mongoose
//====================================================
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection is successful");
    }
});

// Routes

// A GET route for scraping the website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/").then(function(response) {
    
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Save an empty result object
    var result = {};
    
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.story-body").each(function(i, element) {
      
      //variables to store data
      var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text().trim();
			var summary = $(element).find("p.summary").text().trim();
			// var img = $(element).parent().find("figure.media").find("img").attr("src");
      
      //save data as property of result object
      result.link = link;
      result.title = title;
      //if there is a summary
			if (summary) {
        //save as property of result object
				result.summary = summary;
			};

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        //assigning a variable to hold the new article
        var entry = result;
        Article.find({title: result.title}, function(err, data) {
          if (data.length === 0) {
            entry.save(function(err, data) {
              if (err) throw err;
            });
          }
        }
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        })
      );
    });
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all saved articles from db
app.get("/saved", function(req, res) {
	Article.find({issaved: true}, null, {sort: {created: -1}}, function(err, data) {
    //if there are no articles in the array 
    if(data.length === 0) {
      //render alert
			res.render("placeholder", {message: "You have not saved any articles yet. Try to save some delicious news by simply clicking \"Save Article\"!"});
		}
    else { //otherwise
      //render saved articles
			res.render("saved", {saved: data});
		}
	});
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

