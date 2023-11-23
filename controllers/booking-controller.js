const { User } = require('../models/User');
const Housing = require('../models/Housing');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

const bookHousing = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let housing = await Housing.findById(req.params.id, { salt: 0, hash: 0, refreshToken: 0, expirationRefreshToken: 0 });
    let owner = await User.findById(housing.owner, { salt: 0, hash: 0, refreshToken: 0, expirationRefreshToken: 0 });
    let refreshToken = req.cookies['refreshToken'];
    let tenant = await User.getUserByRefreshToken(refreshToken);
    let booking = await Booking.create({ housing, owner, tenant, arrivalDate: new Date(req.query.arrivalDate), departureDate: new Date(req.query.departureDate) });
    await mongoose.disconnect();
    res.redirect('/bookings');
};

const checkIfBooked = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let housing = await Housing.findById(req.params.id);
    let isHousingBooked = await Booking.checkIsHousingBooked(housing, new Date(req.query.arrivalDate), new Date(req.query.departureDate));
    await mongoose.disconnect();
    if (!isHousingBooked) {
        return res.json({ booked: true });
    }
    return res.json({ booked: false });
};

const getBookings = async function(req, res) {
    let showUserNavMenu = req.session.showUserNavMenu;
    let refreshToken = req.cookies['refreshToken'];
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(refreshToken);
    let userRole = user.role;
    let bookingData = await Booking.find({ userRole: user }, { owner: 0 }).sort({ $natural: -1 }).lean();
    await mongoose.disconnect();
    let typeData = userRole === 'tenant' ? 'booking-cards' : 'tenant-cards';
    let [bookingCards, tenantCards] = userRole === 'tenant' ? [true, false] : [false, true];



    res.render('cards.hbs', {
        showUserNavMenu,
        bookingCards,
        tenantCards,
        cardData: {
            id: typeData,
            data: bookingData,
        }
    });
};

module.exports = {
    bookHousing,
    checkIfBooked,
    getBookings
};