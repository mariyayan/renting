const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;
const secretKey = 'secret';

const userSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    phone: String,
    passportNumber: String,
    passportDateOfIssue: Date,
    passportExpirationDate: Date,
    role: String,
    src: String,

    login: String,
    salt: String,
    hash: String,
    refreshToken: String,
    expirationRefreshToken: Date,
});


userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(String(password), this.salt, 5000, 512, 'sha256').toString('hex');
};



userSchema.methods.validatePassword = function(password) {
    const hash = crypto.pbkdf2Sync(String(password), this.salt, 5000, 512, 'sha256').toString('hex');
    return this.hash === hash;
};



userSchema.methods.generateJWTToken = function() {
    const nowTime = new Date();
    const expirationJWTToken = nowTime.setHours(nowTime.getHours() + 1);
    return {
        jwtToken: jwt.sign({
            login: this.login,
        }, secretKey),
        expirationJWTToken: expirationJWTToken
    }
}

userSchema.methods.generateRefreshToken = function() {
    this.refreshToken = crypto.randomBytes(16).toString("hex");
    const nowTime = new Date();
    nowTime.setDate(nowTime.getDate() + 30);
    this.expirationRefreshToken = nowTime;
    return { refreshToken: this.refreshToken };
};


userSchema.statics.getUserByRefreshToken = function(refreshToken) {
    return this.findOne({ refreshToken: refreshToken });
}


userSchema.statics.isLoginExists = function(userLogin) {
    return this.findOne({ login: userLogin })
}


let User = mongoose.model('User', userSchema);

module.exports = { secretKey, User };