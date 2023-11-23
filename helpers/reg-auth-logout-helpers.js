const getImagesSrc = function(files) {
    let srcs = [];
    files.forEach(file => srcs.push(file.path));
    return srcs;
}

module.exports = {
    getImagesSrc
};