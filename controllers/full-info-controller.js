const Booking = require('../models/Booking');
const Housing = require('../models/Housing');
const mongoose = require('mongoose');
const { getMinDates } = require('../helpers/housings-helpers');
const {
    getStringDataFromDate
} = require('../helpers/full-info-helpers');


const getFullInfoRenderDataForBooking = async function(req, id, fullInfoType, sendMessageBoxIdName) {
    let showUserNavMenu = req.session.showUserNavMenu;
    let booking = await Booking.findById(id, { owner: 0 }).lean();
    let renderData = {
        showUserNavMenu,
        _id: booking._id,
        fullInfoData: booking[fullInfoType],
        dates: { arrivalDate: getStringDataFromDate(booking.arrivalDate), departureDate: getStringDataFromDate(booking.departureDate) },
        sendMessageBoxId: sendMessageBoxIdName
    };
    return renderData;
};


const getFullInfoRenderDataForHousing = async function(req, id, additionalData, sendMessageBoxIdName) {
    let showUserNavMenu = req.session.showUserNavMenu;
    let housing = await Housing.findById(id, { owner: 0 }).lean();
    let datesData;
    let minDates = getMinDates();
    datesData = { arrivalDate: minDates[0], departureDate: minDates[1] };
    let renderData = {
        showUserNavMenu,
        _id: housing._id,
        fullInfoData: housing,
        dates: datesData,
        showSearchForm: additionalData[1],
        showBookBtn: additionalData[2],
        sendMessageBoxId: sendMessageBoxIdName
    };
    return renderData;
};


const getBookedHousingFullInfo = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let renderData = await getFullInfoRenderDataForBooking(req, req.params.id, 'housing', '/sendBookingMessage');
    await mongoose.disconnect();
    res.render('housing-full-info.hbs', renderData);
};

const getTenantFullInfo = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let renderData = await getFullInfoRenderDataForBooking(req, req.params.id, 'tenant');
    await mongoose.disconnect();
    res.render('tenant-full-info.hbs', renderData);
};

const getHousingFullInfo = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let renderData = await getFullInfoRenderDataForHousing(req, req.params.id, [false, false, true], '/sendHousingMessage');
    await mongoose.disconnect();
    res.render('housing-full-info.hbs', renderData);
};

const getCottageApartmentFullInfo = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let renderData = await getFullInfoRenderDataForHousing(req, req.params.id, [false, true, false], '/sendHousingMessage');
    await mongoose.disconnect();
    res.render('housing-full-info.hbs', renderData);
};


module.exports = {
    getBookedHousingFullInfo,
    getTenantFullInfo,
    getHousingFullInfo,
    getCottageApartmentFullInfo,
};