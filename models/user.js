var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    loginname: {type: String, unique: true, index: true},
    password: {type: String},
    email: {type: String, unique: true}
});

mongoose.model("User", UserSchema);