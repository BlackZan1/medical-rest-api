const { Router } = require('express');
const multer = require('multer');

// Controllers
const { 
    getDoctors, 
    getDoctorById, 
    postDoctor, 
    deleteDoctorById,
    postDoctorReview,
    getDoctorReviewById
} = require('../controllers/doctors');

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
        cb(null, 'uploads/images')
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

// Inint route
const router = Router();

// GET
router.get('/', getDoctors);

// POST 
router.post('/', upload.single('doctorImage'), postDoctor);

// UPDATE - PUT
// router.put('/');

// GET :ID
router.get('/:id', getDoctorById);

// DELETE
router.delete('/:id', deleteDoctorById);

// GET Doctor review
router.get('/review/:id', getDoctorReviewById);

// POST Doctor review
router.post('/review', postDoctorReview);

module.exports = router;