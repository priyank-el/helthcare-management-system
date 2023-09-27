import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: Number
    },
    // role:{
    //     type:String
    // },
    otp: {
        type: String
    },
    otpVerification: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    },
    activeStatus: {
        type: Number,
        default: 1,
        enum: [0, 1]
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
export default User