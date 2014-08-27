var Demo = require('../models').Demo;

module.exports.newDemo = function (opt, callback) {
    var demo = new Demo();
    demo.title = opt.title;
    demo.desc = opt.desc;
    demo.author = opt.author;
    demo.date = [new Date()];
    demo.private = opt.private;
    demo.html = opt.html;
    demo.css = opt.css;
    demo.js = opt.js;
    demo.jsLib = opt.jsLib;
    demo.cssLib = opt.cssLib;
    demo.lang = opt.lang;
    demo.save(callback);
};

module.exports.getUserDemo = function (user, callback) {
    Demo.find({author: user}, null, {sort: {_id: -1}},callback);
};

module.exports.getSomeDemo = function (callback) {
    Demo.find({}, null, {limit: 10, sort: {_id: -1}}, callback);
};