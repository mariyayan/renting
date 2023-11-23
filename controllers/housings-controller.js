const Housing = require('../models/Housing');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const { getDateDataFromString, getMinDates } = require('../helpers/housings-helpers');



const getMainPage = async function(req, res) {

    let showUserNavMenu = req.session.showUserNavMenu;
    let [minArrivalDate, minDepartureDate] = getMinDates();
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let [apartmentsQuantity, cottagesQuantity] = await Housing.getApartmentsCottagesQuantity();
    await mongoose.disconnect();

    res.render('index.hbs', {
        showUserNavMenu,
        minArrivalDate,
        minDepartureDate,
        apartmentsQuantity,
        cottagesQuantity,
    })
};


const searchHousingByRequest = async function(req, res) {

    let showUserNavMenu = req.session.showUserNavMenu;
    let housingParams = { city: req.query.city, roomsQuantity: req.query.roomsQuantity, $or: [{ priceForDay: { $lt: req.query.priceForDay }, priceForDay: { $eq: req.query.priceForDay } }], housingType: req.query.housingType };
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let housings = await Housing.getHousingsByParameters(housingParams);
    await mongoose.disconnect();
    if (housings.length < 1) {
        return res.render('cards.hbs', {
            cardData: {
                showUserNavMenu,
                id: 'housing-cards',
                data: null
            }
        });
    }
    res.render('cards.hbs', {
        showUserNavMenu,
        housingCards: true,
        cardData: {
            id: 'housing-cards',
            data: housings,
            path: '/housingFullInfo',
        }
    });
};



const searchApartments = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let apartments = await Housing.find({ housingType: 'апартаменты' }, { owner: 0 }).lean();
    await mongoose.disconnect();
    let showUserNavMenu = req.session.showUserNavMenu;
    res.render('cards.hbs', {
        showUserNavMenu,
        housingCards: true,
        cardData: {
            id: 'cottage-apartment-cards',
            data: apartments,
            path: '/cottageApartmentFullInfo',
        }
    });
};




const searchCottages = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let cottages = await Housing.find({ housingType: 'коттеджи' }, { owner: 0 }).lean();
    await mongoose.disconnect();
    let showUserNavMenu = req.session.showUserNavMenu;
    res.render('cards.hbs', {
        showUserNavMenu,
        housingCards: true,
        cardData: {
            id: 'cottage-apartment-cards',
            data: cottages,
            path: '/cottageApartmentFullInfo',
        }
    })
};



module.exports = {
    searchHousingByRequest,
    searchApartments,
    searchCottages,
    getMainPage
};