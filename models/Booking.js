const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    housing: Object,
    owner: Object,
    tenant: Object,
    arrivalDate: Date,
    departureDate: Date
});


bookingSchema.statics.checkIsHousingBooked = async function(housing, arrival, departure) {
    //return this.find({housing:housing, $or:[{arrivalDate:{$gt:arrival}, arrivalDate:{$gt:departure}}, {deparureDate:{$lt:departure},departureDate:{$lt:arrival}}]});
    let houses = await this.find({ housing: housing });
    let result;
    for (let house of houses) {
        if (arrival < house.arrivalDate && departure < house.departureDate) {
            result = true;
        } else if (arrival > house.departureDate && departure > house.departureDate) {
            result = true;
        } else {
            result = false;
            break;
        }
    }
    return result;
};

let Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;