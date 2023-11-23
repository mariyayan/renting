import { getSendDataFunctions } from './sendData.js';


function setFullInfo() {

    let bookOrCheck = getSendDataFunctions('book-housing');
    let checkIsHousingBookedSubmitBtn = document.getElementById('check-is-housing-booked-submit-btn');

    if (checkIsHousingBookedSubmitBtn) {
        let datesValidation = getSendDataFunctions('dates');
        let searchFormDates = document.querySelectorAll('#search-form .dates input');
        let searchFormDate1 = searchFormDates[0];
        let searchFormDate2 = searchFormDates[1];
        searchFormDate1.addEventListener('blur', e => datesValidation(e, '#search-form'));
        searchFormDate2.addEventListener('blur', e => datesValidation(e, '#search-form'));
        checkIsHousingBookedSubmitBtn.addEventListener('click', (e) => bookOrCheck(e, true));
    }
}


setFullInfo();