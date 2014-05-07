var site = require('../controllers').site;

module.exports = function (app, req, res, next) {

    app.get('/', site.showIndex);
}