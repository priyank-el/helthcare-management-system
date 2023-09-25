import mongoose from "mongoose";

const patientsSchema = new mongoose.Schema({
    nickname:{
        type:String,
        index:true
    },
    dob:{
        type:String
    },
    contact_no:{
        type:String
    },
    address:{
        type:String
    },
    allergies:{
        type:Array
    },
    medical_history:{
        type:Object
    },
    current_condition:{
        type:String
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    email:{
        type:String
    },
    diagnosis:{
        type:String
    },
    image:{
        type:String,
        get: function(value:string) {
            // Transform and return value here
            return `http://localhost:4001/images/${value}`;
        }
    },
},
{timestamps:true})

patientsSchema.index({nickname:"text",contact_no:"text"})

const Patient = mongoose.model('Patient',patientsSchema)
export default Patient