const getDateDataFromString = function(stringData) {
    return stringData.replace(/(\d+)-(\d+)-(\d+)/i, '$3 $2 $1');
};

const getDateDataFromDate = function(date) {
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
};

const getStringDataFromDate = function(date) {
    return date.toLocaleDateString().split('.').reverse().join('-');
}

module.exports = {
    getDateDataFromString,
    getDateDataFromDate,
    getStringDataFromDate
};