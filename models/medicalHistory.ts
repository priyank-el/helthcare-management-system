import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
    appointments:{
        type:Array
    },
    priscription:{
        type:Object
    },
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:'Patient'
    }
});

const MedicalHistory = mongoose.model('MedicalHistory',medicalHistorySchema);
export default MedicalHistory