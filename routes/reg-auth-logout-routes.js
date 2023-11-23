const express = require('express');
const router = express.Router();

const {
    registerUser,
    registerHousing,
    authenticateUser,
    logoutUser,
    checkJWToken,
    refreshToken
} = require('../controllers/reg-auth-logout-controller');

router.post('/registration', registerUser);

router.post('/registerHousing', registerHousing);

router.post('/authentication', authenticateUser);

router.get('/logout', logoutUser);

router.post('/refreshToken', checkJWToken, refreshToken);

module.exports = router;