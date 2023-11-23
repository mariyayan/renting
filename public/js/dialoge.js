import { getSendDataFunctions } from './sendData.js';

function setDialoge() {
    let [sendMessage, getFiveLastMessages] = getSendDataFunctions('message');

    let sendMessageBtn = document.getElementById('send-message-btn');
    let getFiveLastMessagesBtn = document.getElementById('get-five-last-messages-btn');

    sendMessageBtn.addEventListener('click', (e) => sendMessage(e, null));
    getFiveLastMessagesBtn ? getFiveLastMessagesBtn.addEventListener('click', (e) => getFiveLastMessages(e)) : null;
}

setDialoge();