import Notification from "../models/notification";
import ReqAppointment from "../models/requestAppointment";
import cron from 'node-cron';

async function cronJobs (){
    const appointments = await ReqAppointment.find({status:'approve'})

    for(let i =0;i<appointments.length;i++){
        const day = appointments[i]?.appointmentDate?.split("-")[0]
        const month = appointments[i]?.appointmentDate?.split("-")[1]
        const hours:any = appointments[i].timeDuration?.split("AM")[0];
        const erlyHours = parseInt(hours) - 1

        cron.schedule(`* ${erlyHours} ${day} ${month} *` , () => {
            sendNotification(appointments[i]._id)
        })
    }
}
const sendNotification = async (id:any) => {
    const appointment = await ReqAppointment.findById(id)

    const notify = appointment?.patientId
    ?  await Notification.create({
        patientId:appointment?.patientId,
        notification:'you have appointment with doctor today ..'
    })
    : await Notification.create({
        patientId:appointment?.userId,
        notification:'you have appointment with doctor today ..'
    })
}

export {
    cronJobs
}