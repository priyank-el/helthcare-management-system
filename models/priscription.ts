import mongoose from "mongoose";

const priscriptionSchema = new mongoose.Schema({
    medications:{
        type: Array
    },
    dosages:{
        type:Object
    },
    frequency:{
        type:String
    },
    durations:{
        type:String
    },
    doctorId:{
        type:mongoose.Types.ObjectId,
        ref:"Doctor"
    },
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:"Patient"
    },
    diagnosis:{
        type:String
    }
});

const Priscription = mongoose.model('Priscription',priscriptionSchema);
export default Priscription;