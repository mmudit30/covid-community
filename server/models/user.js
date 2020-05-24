// user.js
var mongoose = require('mongoose');
// Setup schema
var userScheme = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});
// Export User model
var User = (module.exports = mongoose.model('user', userScheme));
module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
};