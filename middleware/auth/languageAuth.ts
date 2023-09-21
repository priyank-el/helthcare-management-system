import { Request,Response } from "express";
import { errorResponse } from "../../handler/responseHandler";
import { ENGLISH } from "../../languages/en";
import { HINDI } from "../../languages/hi";

const languageAuth = async (req:Request, res:Response, next:any) => {
    try {
        const lang = req.headers.lang;

        const language = lang === 'hi' 
        ? HINDI
        : ENGLISH

        req.body.language = language
        
        next();
    } catch (error:any) {
        errorResponse(res,error,401)
    }
}

export default languageAuth