const { Schema, model } = require('mongoose');

const ClinicSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    doctors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Dcctor'
        }
    ],
    country: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    clinicImage: {
        type: String,
        default: null
    }
}, { versionKey: false })

module.exports = model('Clinic', ClinicSchema);