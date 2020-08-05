const fs = require('fs');
const path = require('path');

const deleteImage = (imageName) => {
    setTimeout(() => {
        fs.unlink(path.join(__dirname + '../../../uploads/images/' + imageName), (err) => {
            console.log(err)

            console.log('Image deleted');
        })
    }, 250)
}

const deleteImageByPath = () => {
    let index = imagePath.lastIndexOf('/') + 1;
    let imageName = imagePath.slice(index);

    deleteImage(imageName);
}

module.exports = {
    deleteImage,
    deleteImageByPath
}