const randomName = () => {
    return Math.random().toString(36).substr(2, 12) + '';
}

module.exports = {
    randomName
}