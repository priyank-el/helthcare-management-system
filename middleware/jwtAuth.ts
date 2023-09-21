const jwt = require('jsonwebtoken');

import { Request,Response } from "express";
import { errorResponse } from "../handler/responseHandler";
import User from "../models/user";
import data from "../security/keys";

const jwtAuth = (role:any) => async (req:Request, res:Response, next:any) => {
    try {
        const authoazationToken = req.headers.authorization;
        const token = authoazationToken?.split(" ")[1]
        let decodedToken = await jwt.verify(token, data.SECRET_KEY)            

        if (!decodedToken) {
            throw 'Token not valid...'
        }

        const userRecord = await User.findOne({ email :  decodedToken.email})

        if (!userRecord) {
            throw 'User not found...'
        }
        const hasPermission = role.includes(decodedToken.role)
        if(!hasPermission) throw 'You can not access this url..'
        req.body.user = userRecord
        req.app.locals.user = userRecord
        next()
    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}
export default jwtAuth;