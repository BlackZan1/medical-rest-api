const { Router } = require('express');
const multer = require('multer');

const { getClinics, getClinicById, postClinic, deleteClinic, putClinic } = require('../controllers/clinics');

// Assets
const { randomName } = require('../utils/randomName');

// Upload config and init
const mimetypes = {
    'image/jpeg': '.jpeg',
    'image/jpg': '.jpg',
    'image/png': '.png'
}

const storage = multer.diskStorage({
    destination: function(_, __, cb) {
        cb(null, 'uploads/clinics')
    },
    filename: function (_, file, cb) {
        const filename = randomName();

        cb(null, filename + mimetypes[file.mimetype]);
    }
})

const fileFilter = (_, file, cb) => {
    const types = Object.keys(mimetypes);

    if(types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file'), false);
    }
}

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });

const router = Router();

router.get('/', getClinics);

router.get('/:id', getClinicById);

router.post('/', upload.single('clinicImage'), postClinic);

router.put('/:id', upload.single('clinicImage'), putClinic);

router.delete('/:id', deleteClinic);

module.exports = router;