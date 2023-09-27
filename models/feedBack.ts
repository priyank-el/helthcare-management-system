import mongoose from "mongoose"

const feedbackSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: "Patient"
    },
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: "Doctor"
    },
    feedback: {
        type: String
    }
});

const Feedback = mongoose.model('Feedback', feedbackSchema)
export {
    feedbackSchema
}
export default Feedback