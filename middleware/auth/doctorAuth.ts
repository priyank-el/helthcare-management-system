import { Request,Response } from "express";
import { errorResponse } from "../../handler/responseHandler";
import User from "../../models/user";
import i18n from "i18n";
import Doctor from "../../models/doctor";

const doctorAuth = async (req:Request, res:Response, next:any) => {
    try {
        const isUser = await User.findOne({email:req.body.user.email});
        const isDoctor = await Doctor.findOne({email:req.body.user.email});

        if(!isUser) throw 'user not found please input right creadential..';
        if(!(isUser?.role === '64f8156fddf804cd0590fe5d')) throw i18n.__('authority-error')

        req.body.doctor = isDoctor
        next();
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

export default doctorAuth;