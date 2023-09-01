import mongoose from "mongoose";

const roleSchma = new mongoose.Schema({
    role : {
        type : String,
        enum:['Doctor','Patient','Administrator','Nurse']
    }
});

const Role = mongoose.model('Role',roleSchma);
export default Role;