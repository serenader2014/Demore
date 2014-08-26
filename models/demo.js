var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var Demo = new Schema({
    title: { type: String },
    desc: { type: String },
    author: { type: String },
    date: { type: Array },
    private: { type: Boolean },
    html: { type: String },
    js: { type: String },
    css: { type: String },
    jsLib: { type: Array },
    cssLib: { type: Array },
    lang: { type: Array }
});

Mongoose.model('Demo', Demo);