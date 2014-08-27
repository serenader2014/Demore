var mongoose = require("mongoose");
var config = require("../config");

require("./user");
require("./demo");

exports.User = mongoose.model("User");
exports.Demo = mongoose.model('Demo');
