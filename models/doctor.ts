import mongoose from "mongoose";
import { feedbackSchema } from "./feedBack";

const doctorSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    degree:{
        type:String,
        enum:['MBBS','MD','MS','SERGEN']
    },
    address:{
        type:String
    },
    contact:{
        type:String
    },
    image:{
        type:String,
        get: function(value:string) {
            // Transform and return value here
            return `http://localhost:4001/images/${value}`;
        }
    },
    feedback:{
        type:[feedbackSchema],
        default:null
    }
},{
    toJSON:{getters:true},
    timestamps:true
});

const Doctor = mongoose.model('Doctor',doctorSchema)
export default Doctor