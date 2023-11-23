const { User } = require('../models/User');
const Dialoge = require('../models/Dialoge');
const Messages = require('../models/Messages');
const Housing = require('../models/Housing');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
let { createHtml } = require('../helpers/message-helpers');


const sendMessage = async function(req, opt, id, refreshToken) {
    let sender = await User.getUserByRefreshToken(refreshToken);
    let senderId = sender._id;
    let senderName = sender.name;
    let receiverId;
    let receiverName;

    if (opt === 'housing') {

        let housing = await Housing.findById(id);
        let receiver = await User.findById(housing.owner);
        receiverId = receiver._id;
        receiverName = receiver.name;
    } else if (opt === 'booking') {
        let booking = await Booking.findById(id);
        let senderRole = sender.role === 'tenant' ? 'owner' : 'tenant';
        receiverId = booking[senderRole]._id;
        receiverName = booking[senderRole].name;
    }
    let dialoge = await Dialoge.isDialogeExists(senderId, receiverId);

    if (!dialoge) {
        dialoge = await Dialoge.create({ user1: senderId, user2: receiverId, user1Name: senderName, user2Name: receiverName });
    }
    let message = await Messages.create({ message: req.body.message, sender: senderName, receiver: receiverName, dialoge: dialoge._id, time: new Date() });
};



const getDialoges = async function(req, res) {


    let showUserNavMenu = req.session.showUserNavMenu;
    let refreshToken = req.cookies['refreshToken'];
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let user = await User.getUserByRefreshToken(refreshToken);
    let userId = user._id;
    let dialogeIds = await Dialoge.find({ $or: [{ user1: userId }, { user2: userId }] }, { _id: 1 }).lean();
    let messageData = await Messages.getDataForDialogeCard(dialogeIds);
    await mongoose.disconnect();

    res.render('cards.hbs', {
        showUserNavMenu,
        dialogeCards: true,
        cardData: {
            id: 'dialoge-cards',
            data: messageData,
            cardType: 'dialoge-card'
        }
    });
};



const getDialoge = async function(req, res) {


    let showUserNavMenu = req.session.showUserNavMenu;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let dialoge = await Dialoge.findById(req.params.id);
    let showGetFiveLastMessagesBtn = false;
    let messagesData = await Messages.find({ dialoge: dialoge._id }, { _id: 1, sender: 1, message: 1, time: 1 }).sort({ $natural: -1 }).lean();
    await mongoose.disconnect();
    if (messagesData.length > 5) {
        showGetFiveLastMessagesBtn = true;
    }
    let messages = messagesData.splice(0, 5);


    res.render('dialoge.hbs', {
        showUserNavMenu,
        dialogeId: dialoge._id,
        messageData: messages,
        showGetFiveLastMessagesBtn
    });
};


const sendDialogeMessage = async function(req, res) {
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let dialoge = await Dialoge.findById(req.params.id);
    let refreshToken = req.cookies['refreshToken'];;
    let sender = await User.getUserByRefreshToken(refreshToken);
    let senderName = sender.name;
    let receiverName = dialoge.getReceiverName(senderName);
    let message = await Messages.create({ message: req.body.message, sender: senderName, receiver: receiverName, dialoge: dialoge._id, time: new Date() });
    await mongoose.disconnect();

    let html = createHtml([message]);
    res.json({ 'html': html });
};


const getFiveLastMessages = async function(req, res) {

    let showGetFiveLastMessagesBtn = false;
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    let lastMessageTime = await Messages.findById(req.body.lastMessageId, { time: 1 });
    let messagesData = await Messages.find({ dialoge: req.body.dialogeId, time: { $lt: lastMessageTime.time } }).sort({ $natural: -1 }).lean();
    if (messagesData.length > 5) {
        showGetFiveLastMessagesBtn = true;
    }
    let messages = messagesData.splice(0, 5);
    let html = createHtml(messages);
    await mongoose.disconnect();

    res.json({ 'html': html, 'showGetFiveLastMessagesBtn': showGetFiveLastMessagesBtn });
};


const sendHousingMessage = async function(req, res) {
    let refreshToken = req.cookies['refreshToken'];
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    await sendMessage(req, 'housing', req.params.id, refreshToken);
    await mongoose.disconnect();

    res.json({ messageSent: true });
};


const sendBookingMessage = async function(req, res) {
    let refreshToken = req.cookies['refreshToken'];
    await mongoose.connect("mongodb://0.0.0.0:27017/");
    await sendMessage(req, 'booking', req.params.id, refreshToken);
    await mongoose.disconnect();

    res.json({ messageSent: true });

};



module.exports = {
    getDialoges,
    getDialoge,
    sendDialogeMessage,
    getFiveLastMessages,
    sendHousingMessage,
    sendBookingMessage
};