//require mongoose
var mongoose = require("mongoose");

// save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new NoteSchema object
var NoteSchema = new Schema({
  
    // _articleId: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Article"
    // },
  
  // title = String
  title: String,
  // body = String
  body: String
});

// create model from the above schema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;