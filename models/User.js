const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const { use } = require('browser-sync');

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide User Name'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please Provide Password']
    }
});

var uniqueValidator = require('mongoose-unique-validator');

UserSchema.plugin(uniqueValidator)

UserSchema.pre('save', function(next){
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash)=> {
        user.password = hash;
        next()
    })
})
const User = mongoose.model('User', UserSchema);
module.exports = User
