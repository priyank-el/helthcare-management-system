import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:"Patient"
    },
    feedback:{
        type:String
    }
});

const Feedback = mongoose.model('Feedback',feedbackSchema);
export default Feedback;