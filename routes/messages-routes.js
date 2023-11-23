const express = require('express');
const router = express.Router();

const {
    getDialoges,
    getDialoge,
    sendDialogeMessage,
    getFiveLastMessages,
    sendHousingMessage,
    sendBookingMessage
} = require('../controllers/messages-controller');

const { checkJWToken } = require('../controllers/reg-auth-logout-controller');

router.get('/dialoges', checkJWToken, getDialoges);

router.get('/dialoge/:id', checkJWToken, getDialoge);

router.post('/sendDialogeMessage/:id', checkJWToken, sendDialogeMessage); 

router.post('/getFiveLastMessages', checkJWToken, getFiveLastMessages); 

router.post('/sendHousingMessage/:id', checkJWToken, sendHousingMessage);

router.post('/sendBookingMessage/:id', checkJWToken, sendBookingMessage); 

module.exports = router;