// // bring in the Scrape function from our scripts directory
// var scrape = require("../scripts/scrape");
// // bring articles & notes from the controller
// var articlesController = require("../controllers/articles");
// var notesController = require("../controllers/notes");

// module.exports = function(router) {
//         // this renders the homepage
//     router.get("/", function(req, res) {
//         res.render("home");
//     });
//         // this renders the saved handlebars page
//     router.get("/saved", function(req, res) {
//         res.render("saved");
//     });
//     router.get("/api/fetch", function(req, res) {
//         articlesController.fetch(function(err, docs) {
//             if (!docs || docs.insertedCount === 0) {
//                 res.json({
//                     message: "No new articles today. Check back tomorrow!"
//                 });
//             } else {
//                 res.json({
//                     message: "Added " + docs.insertedCount + " new articles!"
//                 });
//             }
//         });
//     });
//     router.get("/api/articles", function(req, res) {
//         var query = {};
//         if (req.query.saved) {
//             query = req.query;
//         }
//         articlesController.get(query, function(data) {
//             res.json(data);
//         });
//     });
//     router.delete("/api/articles/:id", function(req, res){
//         var query = {};
//         query._id = req.params.id;
//         articlesController.delete(query, function(err, data){
//             res.json(data);
//         });
//     });
//     router.patch("/api/articles", function(req, res) {
//         articlesController.update(req.body, function(err, data){
//             res.json(data);
//         });
//     });
//     router.get("/api/notes/:article_id?", function(req, res){
//         var query = {};
//         if (req.params.article_id) {
//             query._id = req.params.article_id;
//         }
//         notesController.get(query, function(err, data){
//             res.json(data);
//         });
//     });
//     router.delete("/api/notes/:id", function(req, res){
//         var query = {};
//         query._id = req.params.id;
//         notesController.delete(query, function(err, data){
//             res.json(data);
//         });
//     });
//     router.post("/api/notes", function(req, res) {
//         notesController.save(req.body, function(data){
//             res.json(data);
//         });
//     });
// }