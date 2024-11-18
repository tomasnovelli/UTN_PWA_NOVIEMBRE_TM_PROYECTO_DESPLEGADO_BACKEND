import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true
        },
        email: {
            type: String,
            required:true
        },
        password: {
            type: String,
            required:true
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            default: 'user'
        }
    }
)

const User = mongoose.model('users', userSchema)

export default User