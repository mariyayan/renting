const mongoose = require('mongoose');
const { Schema } = mongoose;

const housingSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    housingName: String,
    city: String,
    address: String,
    description: String,
    priceForDay: Number,
    roomsQuantity: Number,
    housingType: String,
    convinients: Array,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    images: Array
});


housingSchema.statics.getHousingsByParameters = async function(parameters) {
    return await this.find(parameters, { owner: 0 }).lean();
}

housingSchema.statics.getApartmentsCottagesQuantity = async function() {
    let apartments = await this.find({ housingType: 'апартаменты' });
    let cottages = await this.find({ housingType: 'коттеджи' });
    return [apartments.length, cottages.length];
}

let Housing = mongoose.model('Housing', housingSchema);

module.exports = Housing;