const ClinicModel = require('../models/clinic');

const { deleteImage, deleteImageByPath } = require('../utils/deleteImage');


const getClinics = async (req, res) => {
    const { limit, skip } = req.query;

    try {
        const clinics = await ClinicModel
        .find()
        .limit(limit)
        .skip(skip);

        res.status(200).json({
            count: clinics.length,
            clinics,
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

const getClinicById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const clinic = await ClinicModel.findById(id);

        if(!clinic) {
            return res.status(400).json({
                message: 'Clinic isn\'t exist!'
            })
        }

        res.status(200).json({
            clinic,
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

const postClinic = async (req, res) => {
    let imageFilename = '', imageDest = '';
    
    if(!!req.file) {
        imageFilename = req.file.filename;
        imageDest = req.file.destination;
    }

    try {
        const data = { ...req.body };

        if(!!req.file) {
            data.clinicImage = process.env.SERVER_URI + imageDest + '/' + imageFilename;
        }

        const clinic = new ClinicModel(data);
        const result = await clinic.save();

        res.status(201).json({
            clinic: result,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        deleteImage(imageFilename);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const putClinic = async (req, res) => {
    let imageFilename = '', imageDest = '';
    
    if(!!req.file) {
        imageFilename = req.file.filename;
        imageDest = req.file.destination;
    }

    try {
        const data = { ...req.body };
        const { id } = req.params;

        console.log(data);

        if(!!req.file) {
            data.clinicImage = process.env.SERVER_URI + imageDest + '/' + imageFilename;
        }

        const clinic = await ClinicModel.findById(id);

        if(!clinic) {
            deleteImage(imageFilename);

            return res.status(400).json({
                message: 'Clinic isn\'t exist'
            })
        }

        const result = await clinic.updateOne({ ...data });

        res.status(201).json({
            message: 'Updated Successfully',
            clinic: result._doc,
            request: {
                type: req.method
            }
        })
    }
    catch(err) {
        console.log(err);

        deleteImage(imageFilename);

        res.status(500).json({
            error: { message: err }
        })
    }
}

const deleteClinic = async (req, res) => {
    const { id } = req.params;

    try {
        const clinic = await ClinicModel.findByIdAndDelete(id);

        // Handle error if clinic isn't exist
        if(!clinic) {
            return res.status(400).json({
                message: 'Clinic isn\'t exist'
            })
        }

        deleteImageByPath(clinic.clinicImage);

        res.status(201).json({
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

module.exports = {
    getClinics,
    getClinicById,
    postClinic,
    deleteClinic,
    putClinic
}