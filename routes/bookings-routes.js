const express = require('express');
const router = express.Router();

const {
    bookHousing,
    checkIfBooked,
    getBookings
} = require('../controllers/booking-controller');

const { checkJWToken } = require('../controllers/reg-auth-logout-controller');

router.get('/bookHousing/:id', checkJWToken, bookHousing);

router.get('/checkIsHousingBooked/:id', checkJWToken, checkIfBooked);

router.get('/bookings', checkJWToken, getBookings);

module.exports = router;