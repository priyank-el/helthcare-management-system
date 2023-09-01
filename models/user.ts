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
        type:String,
        enum:['64f17ae8dc6c9c2bbcfeb113','64f17b669cc1af572a06a24e','64f17b729cc1af572a06a250','64f17b7e9cc1af572a06a252']
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