import { Request,Response } from "express";
import { errorResponse } from "../../handler/responseHandler";
import User from "../../models/user";

const adminAuth = async (req:Request, res:Response, next:any) => {
    try {
        const isUser = await User.findOne({email:req.body.user.email});

        if(!isUser) throw 'user not found please input right creadential..';
        // if(!(isUser?.role === '64f81563ddf804cd0590fe5b')) throw req.body.language.AUTHORITY_ERROR

        req.body.admin = isUser
        next();
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

export default adminAuth