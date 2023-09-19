import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
    history:{
        type:Array
    },
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:'Patient'
    }
});

const MedicalHistory = mongoose.model('MedicalHistory',medicalHistorySchema);
export default MedicalHistory