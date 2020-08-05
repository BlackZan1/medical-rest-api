// Assets
const { deleteImage, deleteImageByPath } = require('../utils/deleteImage');

// Models
const DoctorModel = require('../models/doctor');
const ReviewModel = require('../models/review');

const getDoctors = async (req, res) => {
    try {
        const { limit, skip } = req.query;

        const doctors = await DoctorModel.find().limit(+limit).skip(+skip);

        res.status(200).json({
            count: doctors.length,
            doctors,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const postDoctor = async (req, res) => {
    let imageFilename = '', imageDest = '';
    
    if(!!req.file) {
        imageFilename = req.file.filename;
        imageDest = req.file.destination;
    }

    try {
        const data = { ...req.body };

        console.log(data);

        if(!!req.file) {
            data.doctorImage = process.env.SERVER_URI + imageDest + '/' + imageFilename;
        }

        const doctor = new DoctorModel(data);
        const result = await doctor.save();

        res.status(201).json({
            message: 'Created Successfully',
            result,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        // Deleting image if the error
        deleteImage(imageFilename);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await DoctorModel.findOne({ _id: id });

        // Handle error if doctor isn't exist
        if(!doctor) {
            return res.status(400).json({
                message: 'Doctor isn\'t exist'
            })
        }

        res.status(200).json({
            doctor: doctor._doc,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const deleteDoctorById = async (req, ) => {
    try {
        const { id } = req.params;
        const doctor = await DoctorModel.findByIdAndDelete(id);

        // Handle error if doctor isn't exist
        if(!doctor) {
            return res.status(400).json({
                message: 'Doctor isn\'t exist'
            })
        }

        // Delete doctor image
        deleteImageByPath(doctor.doctorImage);

        res.status(200).json({
            message: 'Deleted Successfully',
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { message: err }
        })
    }
}

// Doctor reviews controllers
const getDoctorReviewById = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await ReviewModel.findById(id);

        if(!review) {
            return res.status(400).json({
                message: 'Review with provided ID isn\'t exist'
            })
        }

        res.status(200).json({
            review,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const postDoctorReview = async (req, res) => {
    const data = req.body;

    try {
        const doctor = await DoctorModel.findById(data.doctor);

        if(!doctor) {
            return res.status(400).json({
                message: 'Doctor with provided ID isn\'t exist'
            })
        }

        const review = new ReviewModel({ ...data });
        const result = await review.save();

        // if review has any parent that means this review isn't top and no needing to add id to doctors reviews
        if(!!data.parent) {
            const parentReview = await ReviewModel.findById(data.parent);

            if(!parentReview) {
                return res.status(400).json({
                    error: { message: 'Review with provided ID isn\'t exist' }
                })
            }

            parentReview.children = [ ...parentReview.children, result._id ];

            await parentReview.save();
        }
        else {
            doctor.reviews = [ ...doctor.reviews, result._id ];

            await doctor.save();
        }

        res.status(201).json({
            message: 'Created!',
            review: result,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = {
    getDoctorById,
    getDoctors,
    postDoctor,
    deleteDoctorById,
    getDoctorReviewById,
    postDoctorReview
}