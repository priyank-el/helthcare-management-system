import { Request,Response } from "express";
import { HINDI } from "../languages/hi";
import { ENGLISH } from "../languages/en";
import { errorResponse } from "../handler/responseHandler";

const languageAuth = async (req:Request, res:Response, next:any) => {
    try {
        const lang = req.headers.lang;

        const language = lang === 'hi' 
        ? HINDI
        : ENGLISH

        req.body.language = language;
        req.app.locals.language = language
        next();
    } catch (error:any) {
        errorResponse(res,error,401)
    }
}

export default languageAuth