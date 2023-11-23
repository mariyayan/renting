import { openCloseWindow } from './openCloseWindow.js';

function sendDataToServer() {

    let [showUserNavMenu, closeWindow, showMessage] = openCloseWindow()('windows');

    function datesValidation(e, selector) {
        let date = e.currentTarget;
        let dateValue = e.currentTarget.value;
        if (!dateValue) return;

        if (date.classList.contains('date1')) {
            let departureDate = document.querySelector(`${selector} .date2`);
            let minDate = new Date(dateValue);
            minDate.setDate(minDate.getDate() + 1);
            let minDateStr = minDate.toLocaleDateString().split('.').reverse().join('-');
            departureDate.setAttribute('min', minDateStr);
        }
        if (date.classList.contains('date2')) {
            let arrivalDate = document.querySelector(`${selector} .date1`);
            let maxDate = new Date(dateValue);
            maxDate.setDate(maxDate.getDate() - 1);
            let maxDateStr = maxDate.toLocaleDateString().split('.').reverse().join('-');
            arrivalDate.setAttribute('max', maxDateStr);
        }
    }


    function validateForm(e, regExpsArr) {
        function validate(inputs, regExpsArr) {
            let result;
            let count = 0;

            inputs.forEach(item => {
                item = item.querySelector('input:checked') ? item.querySelector('input:checked') : item;

                if (regExpsArr[count++].test(item.value)) {
                    if (item.closest('.input-container').querySelector('.validation-field').classList.contains('show-validation-field')) {
                        item.closest('.input-container').querySelector('.validation-field').classList.remove('show-validation-field');
                    }
                } else {
                    result = false;
                    if (!item.closest('.input-container').querySelector('.validation-field').classList.contains('show-validation-field')) {
                        item.closest('.input-container').querySelector('.validation-field').classList.add('show-validation-field');
                    }
                }
            });

            if (!(result === false)) {
                result = true;
            }
            return result;
        }

        function getFormData() {
            e.preventDefault();
            let form = e.target.closest('form');
            let formInputs = Array.from(form.querySelectorAll('.form-data'));;
            return [form, formInputs];
        }


        function validateFormData() {
            let [form, formInputs] = getFormData();
            let result = validate(formInputs, regExpsArr.flat(Infinity)) ? form : false;
            return [form, result];
        }

        return validateFormData();
    }



    function hideServerValidationField(e) {
        let form = e.currentTarget.closest('form');
        let validationField = form.querySelector('.show-validation-field');
        if (validationField) {
            validationField.classList.remove('show-validation-field');
        }
    }


    function removeFormInputData(form, formHousingData, textarea = false) {
        let fields = form.querySelectorAll('.form-data');
        fields.forEach(field => field.value = '');
        if (formHousingData) {
            let fields = form.querySelectorAll('.form-housing-data input');
            fields.forEach(field => field.checked ? field.checked = false : null);
        } else if (textarea) {
            let field = form.querySelectorAll('.form-housing-data textarea');
            field.value = '';
        }
    }

    async function sendFormDataToServer(e, path, ...regExpsArr) {
        e.preventDefault();
        let currentTarget = e.currentTarget;
        hideServerValidationField(e);
        let [form, validationResult] = validateForm(e, regExpsArr);
        console.log(validationResult)
        if (validationResult) {
            let formData = new FormData(form);
            console.log(formData)
            let serverResponce = await sendPostRequest(path, formData, 'multipart/form-data');

            if (serverResponce.navmenu) {
                closeWindow(currentTarget);
                let opt = form.getAttribute('id') === 'register-housing-form' ? true : false;
                removeFormInputData(form, opt);
                showUserNavMenu();

            } else if (serverResponce.error) {
                form.querySelector(`.server-validation-field-${serverResponce.error}`).classList.add('show-validation-field');
            }
        }
    }

    function sendSearchForm(e, headerFormDataRE) {
        e.preventDefault();
        let [form, validationResult] = validateForm(e, headerFormDataRE);
        if (validationResult) {
            form.submit();
        }
    }


    async function sendGetRequest(url, headerData, responceType) {

        let request = await fetch(url);
        let response = await request.json();
        return response;
    }


    async function sendPostRequest(url, reqBody, contentType) {
        console.log(reqBody)
        let request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': contentType
                //'Content-Type': 'application/json',
                //'Content-Type': 'multipart/form-data',
                //'Content-Type': 'form/multipart',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: reqBody,
        });
        let response = await request.json();
        console.log(response)
        return response;
    }


    function setQueryParams(baseUrl, paramsArr) {
        let url = new URL(baseUrl);
        paramsArr.forEach(param => url.searchParams.set(param[0], param[1]));
        return url;
    }


    async function getFiveLastMessages(e) {
        let currentTarget = e.currentTarget;
        let lastMessageId = document.querySelector('#messages-container .message').getAttribute('id');
        let dialogeId = document.querySelector('.dialoge').getAttribute('id').match(/\w+\w$/).join();
        let responce = await sendPostRequest('/getFiveLastMessages', JSON.stringify({ 'lastMessageId': lastMessageId, 'dialogeId': dialogeId }), 'application/json');
        if (!responce.showGetFiveLastMessagesBtn) {
            let getFiveMessagesBtn = document.getElementById('get-five-last-messages-btn');
            getFiveMessagesBtn.classList.add('hide');
        }
        insertHtml(currentTarget, responce.html, 'afterend');

    }

    async function bookOrCheck(e, search) {

        e.preventDefault();
        let baseUrl = e.target.closest('div').getAttribute('id');
        let url = baseUrl;
        let inputsVals;

        if (!baseUrl) return;
        if (search) {
            let inputs = document.querySelectorAll('#search-form input');
            inputsVals = [
                [inputs[0].name, inputs[0].value],
                [inputs[1].name, inputs[1].value]
            ];
            url = setQueryParams('http://127.0.0.1:3000' + baseUrl, inputsVals);
        }

        let responce = await sendGetRequest(url);
        search ? isHousingBooked(responce, inputsVals) : null;
    }

    function isHousingBooked(response, inputsVals) {
        let houseIsBookedContainer = document.getElementById('housing-is-booked-block');
        let bookHousingBtn = document.querySelector('.book-btn');
        if (response.booked) {
            bookHousingBtn.classList.contains('hide') ? null : bookHousingBtn.classList.add('hide');
            return houseIsBookedContainer.classList.remove('hide');
        }
        houseIsBookedContainer.classList.contains('hide') ? null : houseIsBookedContainer.classList.add('hide');
        bookHousingBtn.classList.remove('hide');

        bookHousingBtn.addEventListener('click', (e) => bookOrCheck(e));

        let id = bookHousingBtn.getAttribute('id');
        let baseUrl = 'http://127.0.0.1:3000' + id;
        let url = setQueryParams(baseUrl, inputsVals);
        bookHousingBtn.setAttribute('id', url);
    }


    function getMessage(e) {
        console.log(e.target.previousElementSibling)
        let message = e.target.previousElementSibling.value;
        return message;
    }


    function insertHtml(parent, html, where) {
        parent.insertAdjacentHTML(where, html);
    }

    async function sendMessage(e, path, opt = false) {
        e.preventDefault();
        let currentTarget = e.currentTarget;
        let url = path ? path : e.target.closest('section').getAttribute('id');
        let message = getMessage(e);
        let response = await sendPostRequest(url, JSON.stringify({ 'message': message }), 'application/json');

        if (opt) {
            return closeWindow(currentTarget);
        } else {
            let parent = document.getElementById('messages-container');
            let html = response.html;
            console.log(html)
            insertHtml(parent, html, 'beforeend');
        }
    }

    function getSendDataFunctions(opt) {
        if (opt === 'menu') {
            return [sendFormDataToServer];
        } else if (opt === 'search') {
            return sendSearchForm;
        } else if (opt === 'message') {
            return [sendMessage, getFiveLastMessages];
        } else if (opt === 'book-housing') {
            return bookOrCheck;
        } else if (opt === 'dates') {
            return datesValidation;
        } else if (opt === 'refresh') {
            return refreshToken;
        }
    }

    return getSendDataFunctions;
}


export let getSendDataFunctions = sendDataToServer();