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
        type: String, // Assuming you're storing the phone number as a string
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Assuming each user has a unique email address
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
        type: [String], // Assuming preferences are stored as an array of strings
        default: [], // You can set a default value if needed
    },
})

const User = mongoose.model('User', userSchema);

export default User;