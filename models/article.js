// require mongoose
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new UserSchema object
var ArticleSchema = new Schema({
    // `title`= String, required
  title: {
        type: String,
        required: true,
        unique: true
    },
    // `link` = String, required
    link: {
        type: String,
        required: true
    },
    // `summary` = String, required
    summary: {
        type: String
    },
    // date: String,
    // saved: {
    //     type: Boolean,
    //     default: false
    // },

    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the Article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;

