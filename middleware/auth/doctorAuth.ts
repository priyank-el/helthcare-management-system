import { Request,Response } from "express";
import { errorResponse } from "../../handler/responseHandler";
import Doctor from "../../models/doctor";

module.exports = async (req:Request, res:Response, next:any) => {
    try {
        const isDoctor = await Doctor.findOne({email:req.body.user.email});

        if(!isDoctor) throw 'patient not found please loged in..';
        req.body.doctor = isDoctor
        next();
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}