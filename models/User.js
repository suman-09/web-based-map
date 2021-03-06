const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    //adding new schema for taking input from map
    name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'please enter a password'],
        minlength: [6, 'minimum password length is 6 characters']
    },
    
    longitude: [String],
    latitude: [String],
    locationname: [String],
    note: [String]
});

//password hashing
//fire a fxn before doc saved to db
//"this" local instance of the user before we save it to the db
//bcrypt.genSalt is the fxn for generate salt for the password
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password ,salt);
    next();
});

//static method to login user
userSchema.methods.login = async function(password) {
    return await bcrypt.compare(password,this.password);
}

const User = mongoose.model('user', userSchema);

module.exports = User;