var site = require('../controllers').site;
var compiler = require('../controllers').compiler;

module.exports = function (app, req, res, next) {

    app.get('/', site.showIndex);

    app.post('/compile', compiler);
};