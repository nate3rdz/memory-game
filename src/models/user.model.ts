import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true
    },
}, {versionKey: false});

const User = mongoose.model('User', userSchema);
export default User;
