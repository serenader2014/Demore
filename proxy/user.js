var User = require("../models").User;

exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback)
}

exports.newUser = function (loginname, password, email, callback) {
    var user = new User();
    user.loginname = loginname;
    user.password = password;
    user.email = email;
    user.save(callback);
}