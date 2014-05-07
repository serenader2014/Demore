var path = require('path');
var pkg = require('./package.json');

var config = {
    name: 'Demo Tools',
    description: 'A HTML and CSS and JavaScript editor in browser with instant preview of the code you write.',
    version: pkg.version,

    site_logo: '',
    site_icon: '',



    upload_dir: path.join(__dirname, 'public', 'user_data', 'images'),
    db: 'mongodb://127.0.0.1/demotools',
    session_secret: 'demotools',
    auth_cookie_name: 'demotools',
    port: 8080,

    allow_sign_up: true
};

module.exports = config;
module.exports.config = config;