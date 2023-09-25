import mongoose from "mongoose";
import Medicine from "./medicine";

const priscriptionSchema = new mongoose.Schema({
    totalMedicine:{
        type:[ Medicine ]
    },
    doctorId:{
        type:mongoose.Types.ObjectId,
        ref:"Doctor"
    },
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:"Patient"
    },
    appointmentId:{
        type:mongoose.Types.ObjectId,
        ref:"ReqAppointment"
    },
    notes:{
        type:String
    }
});

const Priscription = mongoose.model('Priscription',priscriptionSchema);
export default Priscription;