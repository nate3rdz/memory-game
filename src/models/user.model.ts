import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    bestTiming: {
        type: Number,
        required: false
    },
    bestMatchDate: {
        type: Date,
        required: false
    }
}, {versionKey: false});

const User = mongoose.model('User', userSchema);
export default User;
