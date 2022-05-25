var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username: String
});

module.exports = mongoose.model("User", UserSchema);