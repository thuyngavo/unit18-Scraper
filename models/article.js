var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    article: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    date: String,
    saved: {
        type: Boolean,
        default: false
    }
});

var article = mongoose.model("article", articleSchema);

module.exports = article;
