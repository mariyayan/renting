const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    message: String,
    sender: String,
    src: String,
    receiver: String,
    dialoge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dialoge'
    },
    time: Date
});

messageSchema.statics.getDataForDialogeCard = async function(dialogeIds) {
    let dialogeCardsData = [];
    for (let dialogeId of dialogeIds) {
        let messageData = await this.findOne({ dialoge: dialogeId._id }, { sender: 1, message: 1, dialoge: 1, time: 1 }).sort({ $natural: -1 }).limit(1).lean();
        dialogeCardsData.push(messageData);
    }
    return dialogeCardsData;
};

let Messages = mongoose.model('Messages', messageSchema);

module.exports = Messages;