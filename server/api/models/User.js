const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: 10,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'supervisor', 'customer'],
        default: 'customer'
    }

}, {
    timestamps: true
});

UserSchema.pre('save', function(next){

    const user = this;
    const SALT_FACTOR = 5;

    if(!user.isModified('password')){
        return next();
    } 

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            user.password = hash;
            next();

        });

    });

});

UserSchema.methods.comparePassword = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });

}

module.exports = mongoose.model('User', UserSchema);