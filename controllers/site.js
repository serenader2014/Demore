var User = require('../proxy').User;
var crypto = require('crypto');
var validator = require('validator');
var xss = require('xss');

var Demo = require('../proxy').Demo;

module.exports.showIndex = function (req, res) {
    res.render("index", {user: req.session.user});
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
    if (password.length < 6 || password.length > 16) {
        res.json({
            status: 0,
            error: 'Password is limited to 6 - 16 chacrators.',
            data: req.body
        });
        return false;
    }
    User.checkIsExist({username: username, email: email}, function (err, result) {
        if (err) {
            res.json({
                status: 0,
                error: err
            });  
            return false;
        }
        if (result) {
            res.json({
                status: 0,
                error: 'User is already exist'
            });
        } else {
            password = md5(validator.trim(password));
            User.newUser({username: username, email: email, password: password}, function (err, u) {
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
        }
    });
};

module.exports.signout = function (req, res, next) {

};

module.exports.adminIndex = function (req, res, next) {
    res.render('admin', {user: req.session.user});
};

module.exports.saveDemo = function (req, res, next) {
    var obj = {};
    obj.author = req.session.user.username;
    obj.title = xss(validator.trim(req.body.title));
    obj.desc = xss(validator.trim(req.body.desc));
    obj.html = req.body.html;
    obj.css = req.body.css;
    obj.js = req.body.js;
    obj.jsLib = req.body.jsLib;
    obj.cssLib = req.body.cssLib;
    obj.lang = req.body.lang;
    if (! Array.isArray(obj.jsLib) || ! Array.isArray(obj.cssLib) || !Array.isArray(obj.lang)) {
        res.json({
            status: 0,
            error: 'Format incorrect.'
        });
        return false;
    }

    Demo.newDemo(obj, function (err) {
        if (err) {
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
            return false;
        }
    });
};


function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}