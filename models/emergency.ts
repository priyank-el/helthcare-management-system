import mongoose from "mongoose"

const emergencySchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient'
    },
    relative: {
        type: String
    },
    contact_number: {
        type: String
    },
    address: {
        type: String
    }
},
);

const Emergency = mongoose.model('Emergency', emergencySchema)
export default Emergency