var User = require('../proxy').User;
var crypto = require('crypto');
var validator = require('validator');

module.exports.showIndex = function (req, res) {
    res.render("index");
};

module.exports.showSignin = function (req, res) {
    res.render('signin');
};

module.exports.signin = function (req, res, next) {
    var email = req.body.email,
        password = req.body.password;
    if (!validator.isEmail(email)) {
        res.json({
            status: 0,
            error: 'Not a leagal email'
        });
        return false;
    }
    password = md5(password);
    User.getByEmail(email, function (err, u) {
        if (err) {
            res.json({
                status: 0,
                error: err
            });
            return false;
        }
        if (u) {
            if (password === u.password) {
                req.session.user = u;
                res.json({
                    status: 1,
                    error: ''
                });
            } else {
                res.json({
                    status: 0,
                    error: 'Password or username incorrect'
                });
                return false;
            }
        } else {
            res.json({
                status: 0,
                error: 'Password or username incorrect'
            });
            return false;
        }
    });
};

module.exports.showSignup = function (req, res) {
    res.render('signup');
};

module.exports.signup = function (req, res, next) {
    var username = req.body.username,
        email = req.body.email,
        password = req.body.password;


    if (!username || !email || !password) {
        res.json({
            status: 0,
            error: 'Sign up information incomplete'
        });
        return false;
    }
    if (!validator.isEmail(email)) {
        res.json({
            status: 0,
            error: 'Not a leagal email'
        });
        return false;
    }
    if (!validator.isAlphanumeric(username)) {
        res.json({
            status: 0,
            error: 'User name is limited to any number or alpha'
        });
        return false;
    }
    if (username.length > 16) {
        res.json({
            status: 0,
            error: 'User name too long.'
        });
        return false;
    }
    if (password < 6 || password > 16) {
        res.json({
            status: 0,
            error: 'Password is limited to 6 - 16 chacrators.'
        });
        return false;
    }
    if (User.checkIsExist({username: username, email: email})) {
        res.json({
            status: 0,
            error: 'User is already exist'
        });
        return false;
    }
    password = md5(validator.trim(password));
    User.newUser(username, password, email, function (err, u) {
        if (err) {
            console.error(err);
            res.json({
                status: 0,
                error: err
            });
            return false;
        } else {
            res.json({
                status: 1,
                error: ''
            });
        }
    });
};

module.exports.signout = function (req, res, next) {

};

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}