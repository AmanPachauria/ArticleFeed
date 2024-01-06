import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userFirstName: {
        type: String,
        required: true,
    },
    userLastName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String, 
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferences: {
        type: [String], 
        default: [],
    },
    avatar:{
        type: String,
        default: "data:image/png;base64,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",
    },
}, { timestamps: true })


const User = mongoose.model('User', userSchema);

export default User;