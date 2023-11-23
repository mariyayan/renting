const { User, secretKey } = require('../models/User');
const Housing = require('../models/Housing');

const Booking = require('../models/Booking');
let Dialoge = require('../models/Dialoge');
let Messages = require('../models/Messages');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
    getImagesSrc
} = require('../helpers/reg-auth-logout-helpers');


const checkJWToken = async function(req, res, next) {
    let token = req.cookies['jwt'];
    if (!token) {
        req.session.showUserNavMenu = false;
        return res.redirect('/');
    }
    jwt.verify(token, secretKey, (err) => {
        if (err) {
            req.session.showUserNavMenu = false;
            return res.redirect('/');
        }
        req.session.showUserNavMenu = true;
        next();
    });
};



const generateAndSendTokens = async function(user, req, res) {
    let { jwtToken, expirationJWTToken } = user.generateJWTToken();
    let { refreshToken } = user.generateRefreshToken();
    await user.save();
    req.session.showUserNavMenu = true;
    res.cookie('jwt', jwtToken, { maxAge: 3600000 }
        //,secure: true, httpOnly:true, sameSite:true}
    );
    res.cookie('jwtExpiration', expirationJWTToken, { maxAge: 3600000 }
        //,secure: true, httpOnly:true, sameSite:true}
    );
    res.cookie('refreshToken', refreshToken, { maxAge: 3600000 }
        //,secure: true, httpOnly:true, sameSite:true}
    );
};



const unsetJWTAndRefreshTokens = function(res) {
    res.clearCookie('refreshToken');
    res.clearCookie('jwt');
    res.clearCookie('jwtExpiration');
    // нужно ли удалять из базы старый рефреш ??
};


const checkUserLogin = async function(login, auth = false) {
    let isloginExists = await User.isLoginExists(login);

    if (auth && !isloginExists) {
        return { error: 'login' };
    }
    if (!auth && isloginExists) {
        return { error: 'login' };
    }
    if (auth) {
        return isloginExists;
    }
};


const createNewUser = async function(reqBody, userRole) {
    let user = new User({ name: reqBody.name, surname: reqBody.surname, email: reqBody.email, phone: reqBody.phone, passportNumber: reqBody.passportNumber, passportDateOfIssue: new Date(reqBody.passportDateOfIssue), passportExpirationDate: new Date(reqBody.passportExpirationDate), role: userRole /*userData*/ }); // await ?
    user.setPassword(reqBody.password);
    return user;
};


const registerUser = async function(req, res) {

    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let isloginExists = await checkUserLogin(req.body.login);
    if (isloginExists) return res.json(isloginExists);
    let user = await createNewUser(req.body, 'tenant');
    await generateAndSendTokens(user, req, res);
    await mongoose.disconnect();
    res.json({ 'navmenu': 'true' });
};


const registerHousing = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let isloginExists = await checkUserLogin(req.body.login);
    if (isloginExists) return res.json(isloginExists);
    let user = await createNewUser(req.body, 'owner');
    let imagesSrcArray = getImagesSrc(req.files);
    let housing = new Housing({ housingName: req.body.housingName, city: req.body.city, address: req.body.address, description: req.body.description, priceForDay: req.body.priceForDay, roomsQuantity: req.body.roomsQuantity, housingType: req.body.housingType, convinients: req.body.convinients, owner: user._id, images: imagesSrcArray });
    await housing.save();
    await generateAndSendTokens(user, req, res);
    await mongoose.disconnect();
    res.json({ 'navmenu': 'true' });
};



const authenticateUser = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await checkUserLogin(req.body.login, true);
    if (user.error) return res.json(user);
    let passwordValidationResult = user.validatePassword(req.body.password);
    if (!passwordValidationResult) {
        return res.json({ 'error': 'password' });
    }
    await generateAndSendTokens(user, req, res);
    await mongoose.disconnect();
    res.json({ 'navmenu': 'true' });
    res.json({ 'navmenu': 'true' });
};


const logoutUser = async function(req, res) {
    req.session.showUserNavMenu = false;
    unsetJWTAndRefreshTokens(res);
    res.redirect('/');
};

const refreshToken = async function(req, res, next) {

    let refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
        req.session.showUserNavMenu = false;
        return res.redirect('/');
    }
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(refreshToken);
    unsetJWTAndRefreshTokens(res);
    await generateAndSendTokens(user, req, res);
    await mongoose.disconnect();
    next();
};


module.exports = {
    registerUser,
    registerHousing,
    authenticateUser,
    logoutUser,
    checkJWToken,
    refreshToken
};