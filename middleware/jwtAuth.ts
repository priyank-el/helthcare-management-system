const jwt = require('jsonwebtoken');

import { Request,Response } from "express";
import { errorResponse } from "../handler/responseHandler";
import User from "../models/user";
import data from "../security/keys";

const jwtAuth = async (req:Request, res:Response, next:any) => {
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
        
        req.body.user = userRecord
        next()
    } catch (error:any) {
        errorResponse(res,error.message,401)
    }
}
export default jwtAuth;