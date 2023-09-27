import mongoose from "mongoose"

const medicationsSchema = new mongoose.Schema({
    name:{
        type:String
    }
});

const Medications = mongoose.model('Medication',medicationsSchema)
export default Medications