var site = require('../controllers').site;
var compiler = require('../controllers').compiler;

module.exports = function (app, req, res, next) {

    app.get('/', site.showIndex);
    app.get('/signin', site.showSignin);
    app.post('/signin', site.signin);
    app.get('/signup', site.showSignup);
    app.post('/signup', site.signup);
    app.post('/signout', site.signout);
    app.post('/compile', compiler);
};