import { Request,Response } from "express";
import { errorResponse } from "../../handler/responseHandler";
import User from "../../models/user";
import i18n from "i18n";
import Patient from "../../models/patients";

const patientAuth = async (req:Request, res:Response, next:any) => {
    try {
        console.log(req.body.user);
        const isUser = await User.findOne({email:req.body.user.email});
        const isPatient = await Patient.findOne({email:req.body.user.email});

        if(!isUser) throw 'user not found please input right creadential..';
        if(!(isUser?.role === '64f81547ddf804cd0590fe59')) throw i18n.__('authority-error')

        req.body.patient = isPatient
        next();
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

export default patientAuth