import mongoose from "mongoose";

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
    }
},{
    timestamps:true
});

const Doctor = mongoose.model('Doctor',doctorSchema)
export default Doctor