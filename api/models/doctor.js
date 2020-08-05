const { Schema, model } = require('mongoose');

const DoctorSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    doctorImage: {
        type: String,
        default: 'uploads/images/noimage.jpg'
    },
    awards: {
        type: Number,
        default: 0
    },
    experienceInYears: {
        type: Number,
        default: 0
    },
    chargesInUSD: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, { 
    timestamps: true,
    versionKey: false
})

module.exports = model('Doctor', DoctorSchema);