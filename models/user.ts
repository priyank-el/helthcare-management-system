import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    role:{
        type:String
    },
    otp:{
        type:String
    },
    otpVerification:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    }
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema);
export default User