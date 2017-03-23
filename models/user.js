const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

// Create Model Based on Schema
const User = module.exports = mongoose.model('User', UserSchema);

// Export function for getting user by id
module.exports.getUserById = function(id, callback){
    User.findByID(id, callback);
};

// Export function for getting user by name
module.exports.getUserByUsername = function(username, callback){
    const query = {username: username};
    User.findOne(query, callback);
};

//Export function for adding a user
module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};