var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {type: String},
    date: {type: Array},
    author: {type: String},
    tags: {type: Array},
    post: {type: String}
})

mongoose.model("Post", PostSchema);