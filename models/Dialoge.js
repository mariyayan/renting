const mongoose = require('mongoose');
const { Schema } = mongoose;

const dialogeSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user1Name: String,
    user2Name: String
});


dialogeSchema.methods.getReceiverId = function(senderId) {
    return this.user1 === senderId ? this.user2 : this.user1;
}

dialogeSchema.methods.getReceiverName = function(senderName) {
    return senderName === this.user1Name ? this.user2Name : this.user1Name;
}

dialogeSchema.statics.isDialogeExists = function(userId1, userId2) {
    return this.findOne({ $or: [{ user1: userId1, user2: userId2 }, { user1: userId2, user2: userId1 }] })
}

let Dialoge = mongoose.model('Dialoge', dialogeSchema);


module.exports = Dialoge;