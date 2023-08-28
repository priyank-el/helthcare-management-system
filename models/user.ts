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
        enum:['64ec3838149724882c351e50','64ec3838149724882c351e50','64ec387a149724882c351e54','64ec3894149724882c351e56']
    },
    otp:{
        type:String
    },
    otpVerification:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const User = mongoose.model('User',userSchema);
export default User