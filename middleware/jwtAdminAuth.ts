const jwt = require('jsonwebtoken');

import { Request,Response } from "express";
import { errorResponse } from "../handler/responseHandler";
import data from "../security/keys";
import Admin from "../models/admin";

const jwtAdminAuth = async (req:Request, res:Response, next:any) => {
    try {
        const authoazationToken = req.headers.authorization;
        const token = authoazationToken?.split(" ")[1]
        let decodedToken = await jwt.verify(token, data.SECRET_KEY)            

        if (!decodedToken) {
            throw 'Token not valid...'
        }

        const adminRecord = await Admin.findOne({ email :  decodedToken.email})

        if (!adminRecord) {
            throw 'Admin not found...'
        }
        req.app.locals.admin = adminRecord
        next()
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}
export default jwtAdminAuth;