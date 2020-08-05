const { Schema, model } = require('mongoose');

const AppointmentSchema = new Schema({
    clientName: {
        type: String,
        required: true
    },
    clientEmail: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    doctor: {
        ref: 'Doctor',
        type: Schema.Types.ObjectId
    },
    department: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { 
    timestamps: true, 
    versionKey: false 
})

module.exports = model('Appointment', AppointmentSchema);
