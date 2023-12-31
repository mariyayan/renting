import { openCloseWindow } from './openCloseWindow.js';
import { getSendDataFunctions } from './sendData.js';
import { setSlider } from './slider.js';

function setSearchForm() {

    let headerFormDataRE = [/^[а-я]{1,}$/i, /^\d{1,}$/, /^\d{1,}$/, /^апартаменты$|^коттеджи$/];
    let sendSearchForm = getSendDataFunctions('search');
    let headerFormSubmitBtn = document.getElementById('header-form-submit-btn');
    headerFormSubmitBtn.addEventListener('click', e => sendSearchForm(e, headerFormDataRE));
}


setSearchForm();
setSlider('slider');
setSlider('testimonials');



























































































































