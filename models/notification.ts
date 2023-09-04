import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    patientId:{
        type:mongoose.Types.ObjectId,
        ref:'Patient'
    },
    notification:{
        type:String
    }
},{
    timestamps:true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;