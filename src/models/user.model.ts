import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    emergencyContact: [{
        type: String
    }],
    email: {
        type: String,
        required: true
    },
});

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;