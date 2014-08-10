var sass = require('node-sass');
var jade = require('jade');
var markdown = require('marked');
var coffee = require('../coffee-script').CoffeeScript;
var less = require('less');


module.exports = function (req, res, next) {

    var type = req.body.name;
    var tmpl = req.body.tmpl;

    if (type === 'html' || type === 'css' || type === 'javascript') {
        res.send({
            code: tmpl,
            type: type,
            compiled: type,
            err: ''
        });

        return ;
    }


    var compiled = compiler(type, tmpl);

    var compiledFile = type === 'jade' || type === 'markdown' ? 'html' : (type === 'sass' || type === 'scss' ? 'css' : 'javascript');

    var result = {
        code: compiled.code,
        type: type,
        compiled: compiledFile,
        err: compiled.err
    };

    res.send(result);
};

var compiler = function (type, str) {
    if (! str) {
        return {
            code: '',
            err: ''
        };
    }
    var html, error, js,css;
    if (type == 'jade') {
        try {
            html = jade.render(str);
        } catch (err) {
            error = err.name + ' : ' + err.message;
            console.log(err);
        }
        return {
            code: html,
            err: error
        };
    } else 

    if (type == 'scss') {
        try {
            css = sass.renderSync({
                data: str
            });
        } catch (err) {
            console.log(err);
            error = err;
        }

        return {
            code: css,
            err: error
        };
    } else 

    if (type == 'coffee') {
        try {
            js = coffee.compile(str);
        } catch (err) {
            console.log(err);
            error = err.name + ' : ' + err.message;
        }
        return {
            code: js,
            err: error
        };
    } else 

    if (type == 'markdown') {
        try {
            html = markdown(str);
        } catch (err) {
            console.log(err);
            error = err.name + ' : ' + err.message;
        }
        return {
            code: html,
            err: error
        };
    } else {
        return {
            code: '',
            err: 'can not find a compiler to compile ' + type
        };
    }
};
