import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    image:{
        type:String,
        get: function(value:string) {
            // Transform and return value here
            return `http://localhost:4001/images/${value}`;
        }
    }
});

const Admin = mongoose.model('Admin',adminSchema)
export default Admin