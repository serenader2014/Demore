var User = require("../models").User;

module.exports.getById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

module.exports.newUser = function (obj, callback) {
    var user = new User();
    user.username = obj.username;
    user.password = obj.password;
    user.email = obj.email;
    user.save(callback);
};

module.exports.checkIsExist = function (obj, callback) {
    User.find({username: obj.username}, function (err, u) {
        if (err) {
            callback(err);
        }
        if (u) {
            callback(err, true);
        } else {
            User.find({email: obj.email}, function (err, user) {
                if (err) {
                    callback(err);
                }
                if (user) {
                    callback(err, true);
                } else {
                    callback(err, false);
                }
            });
        }
    });
};

module.exports.getByEmail = function (email, callback) {
    User.findOne({email: email}, callback);
};