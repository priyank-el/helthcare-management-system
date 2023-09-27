import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor'
    },
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    notification: {
        type: String
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema)
export default Notification