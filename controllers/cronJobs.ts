import cron from 'node-cron'
import { Request,Response } from "express"
import ReqAppointment from '../models/requestAppointment'
import Notification from '../models/notification'

const named = async (req:Request,res:Response) => {
    const appointments = await ReqAppointment.find({status:'approve'})

    for(let i =0;i<appointments.length;i++){
        const day = appointments[i]?.appointmentDate?.split(" ")[0]
        const month = appointments[i]?.appointmentDate?.split(" ")[1]
        const hours = 8;

        cron.schedule(`* ${hours} ${day} ${month} *` , () => {
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

export {named} 


