import mongoose from "mongoose";

const roleSchma = new mongoose.Schema({
    role : {
        type : String
    }
});

const Role = mongoose.model('Role',roleSchma);
export default Role;