import mongoose from "mongoose";

const medicine = new mongoose.Schema({
    medications:{type:String},
    dosages:{type:String},
    frequency:{type:String},
    durations:{type:String},
    dignosis:{type:String}
   });

export default medicine;