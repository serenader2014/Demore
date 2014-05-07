var Post = require("../models").Post;

exports.getPostById = function (id ,callback) {
    Post.findOne({_id: id}, callback);
}

exports.getAllPost = function (callback) {
    Post.find({}, null, {sort: [["_id": -1]]}, callback);
}

exports.newpost = function (title, author, date, post, tags, callback) {
    var post = new Post();
    post.title = title;
    post.author = author;
    post.date = date;
    post.tags = tags;
    post.post = post;
    post.save(callback);
}

exports.deletePost = function (id) {
    Post.remove({_id: id}, callback)
}