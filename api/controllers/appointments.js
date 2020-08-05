// Models
const AppointmentModel = require('../models/appointment');
const DoctorModel = require('../models/doctor');

const getAppointments = async (req, res) => {
    try {
        const { limit, skip } = req.params;

        const appointments =  await AppointmentModel.find().limit(limit).skip(skip);

        res.status(200).json({
            count: appointments.length,
            appointments,
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

const postAppointment = async (req, res) => {
    try {
        const data = req.body;
        const appointment = new AppointmentModel(data);

        const doctorIsExist = await DoctorModel.findById(data.doctor);

        if(!doctorIsExist) {
            return res.status(400).json({
                error: {
                    message: `Doctor with ID:${data.doctor} isn\'t exist`
                }
            })
        }

        const result = await appointment.save();

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

        res.status(500).json({
            error: { message: err }
        })
    }
}

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentModel.findOne({ _id: id });

        if(!appointment) {
            return res.status(400).json({
                message: 'Appointment isn\'t exist'
            })
        }

        res.status(200).json({
            appointment: appointment._doc,
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

const deleteAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await AppointmentModel.findOneAndDelete({ _id: id });

        if(!appointment) {
            return res.status(400).json({
                message: 'Appointment isn\'t exist'
            })
        }

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

module.exports = {
    getAppointments,
    postAppointment,
    getAppointmentById,
    deleteAppointmentById
}