import mongoose from "mongoose"

const reqAppointment = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
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
    startTime:{
        type:String
    },
    endTime:{
        type:String
    },
    notesForRejection:{
        type:String
    },
    atended:{
        type:Boolean,
        default:false
    }
},
{timestamps:true})

const ReqAppointment = mongoose.model('ReqAppointment',reqAppointment)
export default ReqAppointment