import mongoose from "mongoose";

const reqAppointment = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:'Patient'
    },
    doctorId:{
        type:mongoose.Types.ObjectId,
        ref:'Doctor'
    }
},
{timestamps:true})

const ReqAppointment = mongoose.model('ReqAppointment',reqAppointment)