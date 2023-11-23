import { openCloseWindow } from './openCloseWindow.js';
import { getSendDataFunctions } from './sendData.js';


function setDialogBox() {

    let getFunctions = openCloseWindow();
    let [showWindow, closeWindow, closeWindowByUserClick] = getFunctions('dialog-box');
    let showDialogBoxBtn = document.getElementById('show-dialog-box-btn');
    let showDialogBoxWindow = document.getElementById('show-dialog-box-window');
    let showDialogBoxWindowCross = showDialogBoxWindow.querySelector('.cross');

    showDialogBoxBtn.addEventListener('click', (e) => showWindow(e.currentTarget));
    showDialogBoxWindowCross.addEventListener('click', (e) => closeWindow(e.currentTarget));
    showDialogBoxWindow.addEventListener('click', (e) => closeWindowByUserClick(e.target, e.currentTarget));

    let [sendMessage] = getSendDataFunctions('message');
    let sendMessageBtn = document.querySelector('#dialog-box input');
    let path = sendMessageBtn.getAttribute('id');

    sendMessageBtn.addEventListener('click', (e) => sendMessage(e, path, true));
}

setDialogBox();