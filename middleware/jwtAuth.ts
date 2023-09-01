const jwt = require('jsonwebtoken');

import { Request,Response } from "express";
import { errorResponse } from "../handler/responseHandler";
import User from "../models/user";
import { createClient } from "redis";
const client = createClient();
import data from "../security/keys";

module.exports = async (req:Request, res:Response, next:any) => {
    try {
        await client.connect()
        const token =await client.get('token')
        await client.disconnect()
        let decodedToken = await jwt.verify(token, data.SECRET_KEY)            //=> working with cookies

        if (!decodedToken) {
            const error = new Error('Token not valid...')
            throw error
        }

        const userRecord = await User.findOne({ email :  decodedToken.email})

        if (!userRecord) {
            const error = new Error('User not found...')
            throw error
        }
        
        req.body.user = userRecord
        next()
    } catch (error:any) {
        errorResponse(res,error.message,401)
    }

}