import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    closed: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Number,
        required: true
    },
    closedAt: {
        type: Number
    }
}, {versionKey: false});

const Match = mongoose.model('Match', matchSchema);
export default Match;
