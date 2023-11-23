const getDateDataFromString = function(stringData) {
    return stringData.replace(/(\d+)-(\d+)-(\d+)/i, '$3 $2 $1');
}

const getMinDates = function() {
    let dateNow = new Date();
    let minArrivalDate = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
    dateNow.setDate(dateNow.getDate() + 1);
    let minDepartureDate = `${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate()}`;
    return [minArrivalDate, minDepartureDate];
};

module.exports = {
    getDateDataFromString,
    getMinDates,
};