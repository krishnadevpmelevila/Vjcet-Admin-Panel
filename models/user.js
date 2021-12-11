// create model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// create schema
var userSchema = new Schema({
    sub: String,
    name: String,
    date: String,
    link: String,
    type: String,
    uuid:String,
    created_at: Date,
    updated_at: Date
});
// create model
var User = mongoose.model('User', userSchema);
// export model
module.exports = User;