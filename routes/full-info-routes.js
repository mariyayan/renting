const express = require('express');
const router = express.Router();

const {
    getBookedHousingFullInfo,
    getTenantFullInfo,
    getHousingFullInfo,
    getCottageApartmentFullInfo
} = require('../controllers/full-info-controller');

const { checkJWToken } = require('../controllers/reg-auth-logout-controller');

router.get('/bookedHousingFullInfo/:id', checkJWToken, getBookedHousingFullInfo);

router.get('/tenantFullInfo/:id', checkJWToken, getTenantFullInfo);

router.get('/housingFullInfo/:id', checkJWToken, getHousingFullInfo);

router.get('/cottageApartmentFullInfo/:id', checkJWToken, getCottageApartmentFullInfo);

module.exports = router;