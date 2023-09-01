import { Request,Response } from "express"
import Patient from "../../models/patients";
import { errorResponse } from "../../handler/responseHandler";

module.exports = async (req:Request, res:Response, next:any) => {
    try {
        const isPatients = await Patient.findOne({email:req.body.user.email});

        if(!isPatients) throw 'patient not found please loged in..';
        req.body.patient = isPatients
        next();
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}