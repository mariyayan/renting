const createHtml = function(messages) {
    let code='';
    for (let message of messages) {
        code += `<article id=${message._id} class='message'><div class='message-sender'>${message.sender}</div><div class='message-text'>${message.message}</div><time>${message.time}</time></article>`;
    }
    return code;
};

module.exports = {
    createHtml
};