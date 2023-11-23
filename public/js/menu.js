import { openCloseWindow } from './openCloseWindow.js';
import { getSendDataFunctions } from './sendData.js';

function setMenu() {

    let getFunctions = openCloseWindow();
    let [showWindow, openCloseUserNavMenu, closeWindowByUserClick] = getFunctions('menu');
    let [sendFormDataToServer] = getSendDataFunctions('menu');
    let refreshToken=getSendDataFunctions('refresh');
    let datesValidation = getSendDataFunctions('dates');

    function setNavMenu() {

        let loginAndPasswordRE = [/^[a-zа-я0-9]{3,10}$/i, /^[a-zа-я0-9]{5,15}$/i];
        let userDataRE = [/^[a-zа-я]+$/i, /^[a-zа-я]+$/i, /^[a-z0-9]+@[a-z0-9-]+.[a-z]{2,4}$/i, /^\+\(\d{3}-\d{2}\)-\d{3}-\d{2}-\d{2}$/];
        let housingDataRE = [/^[a-zа-я]+$/i, /^[a-zа-я]+$/i, /^[a-zа-я0-9\s\.\,-№]{1,}$/i, /^(\S+\s?)+\S{0,}$/gim, /^\d{1,}$/, /^\d$/, /^апартаменты$|^коттеджи$/, /^\S{1,}$/i];
        let passportDataRE = [/^[a-z]{2}\d{7}$/i, /^\d{4}-\d{2}-\d{2}$/, /^\d{4}-\d{2}-\d{2}$/];

        let registrationFormDates = document.querySelectorAll('#registration-window .dates input');
        let registrationFormDate1 = registrationFormDates[0];
        let registrationFormDate2 = registrationFormDates[1];

        let registerHousingFormDates = document.querySelectorAll('#registerHousing-window .dates input');
        let registerHousingFormDate1 = registerHousingFormDates[0];
        let registerHousingFormDate2 = registerHousingFormDates[1];

        let registerHousingBtn = document.getElementById('registerHousing-btn');
        let registrationBtn = document.getElementById('registration-btn');
        let authenticationBtn = document.getElementById('authentication-btn');

        let registrationWindow = document.getElementById('registration-window');
        let authenticationWindow = document.getElementById('authentication-window');
        let registerHousingWindow = document.getElementById('registerHousing-window');

        let sendAuthenticationFormBtn = document.getElementById('send-authentication-form');
        let sendRegistrationFormBtn = document.getElementById('send-registration-form');
        let sendRegisterHousingFormBtn = document.getElementById('send-register-housing-form');


        registerHousingBtn.addEventListener('click', (e) => showWindow(e.currentTarget));
        registrationBtn.addEventListener('click', (e) => showWindow(e.currentTarget));
        authenticationBtn.addEventListener('click', (e) => showWindow(e.currentTarget));

        registrationWindow.addEventListener('click', (e) => closeWindowByUserClick(e.target, e.currentTarget));
        authenticationWindow.addEventListener('click', (e) => closeWindowByUserClick(e.target, e.currentTarget));
        registerHousingWindow.addEventListener('click', (e) => closeWindowByUserClick(e.target, e.currentTarget));

        sendAuthenticationFormBtn.addEventListener('click', (e) => sendFormDataToServer(e, '/authentication', loginAndPasswordRE, /^owner$|^tenant$/));
        sendRegistrationFormBtn.addEventListener('click', (e) => sendFormDataToServer(e, '/registration', userDataRE, loginAndPasswordRE, passportDataRE));
        sendRegisterHousingFormBtn.addEventListener('click', (e) => sendFormDataToServer(e, '/registerHousing', userDataRE, loginAndPasswordRE, passportDataRE, housingDataRE));

        registrationFormDate1.addEventListener('blur', e => datesValidation(e, '#registration'));
        registrationFormDate2.addEventListener('blur', e => datesValidation(e, '#registration'));

        registerHousingFormDate1.addEventListener('blur', e => datesValidation(e, '#registerHousing'));
        registerHousingFormDate2.addEventListener('blur', e => datesValidation(e, '#registerHousing'));
    }


    function setUserNavMenu() {

        let userNavMenuBtn = document.getElementById('user-nav-menu-btn');
        let userNavMenuWindow = document.getElementById('user-nav-menu-window'); 
        userNavMenuBtn.addEventListener('click', openCloseUserNavMenu);
    }

/*    function callMenuFunc() {
        let menuElement = document.querySelector('.show-nav-menu');
        headerBtns ? setNavMenu() : setUserNavMenu();
    }
  callMenuFunc();*/
 setNavMenu();
  setUserNavMenu();
  
 setInterval(refreshToken,900000);
}

setMenu();

