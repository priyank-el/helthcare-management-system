import mongoose from "mongoose"

const medicine = new mongoose.Schema({
    medications:
    {
        type:mongoose.Types.ObjectId,
        ref:'Medication'
    },
    dosages:{type:String},
    frequency:{type:String},
    durations:{type:String},
    dignosis:{type:String}
   });

export default medicine