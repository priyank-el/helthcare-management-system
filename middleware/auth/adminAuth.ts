import { Request,Response } from "express";
import { errorResponse } from "../../handler/responseHandler";
import User from "../../models/user";

const adminAuth = async (req:Request, res:Response, next:any) => {
    try {
        const isUser = await User.findOne({email:req.body.user.email});

        if(!isUser) throw 'user not found please input right creadential..';
        if(!(isUser?.role === '64f55b3835dc425064e69925')) throw 'you cant has authority to use this api..'

        req.body.patient = isUser
        next();
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

export default adminAuth