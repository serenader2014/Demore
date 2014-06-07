var mongoose = require("mongoose");
var config = require("../config");

mongoose.connect(config.db, function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});

require("./user");
require("./post");

exports.User = mongoose.model("User");
exports.post = mongoose.model("Post");