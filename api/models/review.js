const { model, Schema } = require('mongoose');

const reviewSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    text: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
}, { timestamps: true, versionKey: false });

module.exports = model('Review', reviewSchema);