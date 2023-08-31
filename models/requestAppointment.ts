import mongoose from "mongoose";

const reqAppointment = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:'Patient'
    },
    doctorId:{
        type:mongoose.Types.ObjectId,
        ref:'Doctor'
    },
    appointmentDate:{
        type:String
    },
    status:{
        type:String,
        enum:['pending','approve','reject'],
        default:'pending'
    },
    timeDuration:{
        type:String
    },
    notesForRejection:{
        type:String
    }
},
{timestamps:true})

const ReqAppointment = mongoose.model('ReqAppointment',reqAppointment)
export default ReqAppointment