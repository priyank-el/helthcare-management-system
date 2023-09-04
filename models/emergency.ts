import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    reason:{
        type:String
    },
    age:{
        type:String
    },
    contactNO:{
        type:String
    }
},
{timestamps:true});

const Emergency = mongoose.model('Emergency',emergencySchema)
export default Emergency;