import { Response } from "express";

const successResponse = (res:Response ,message:any , statusCode:number ) => {
    return res.status(statusCode).json({
        data:message
    })
}

const errorResponse = (res:Response ,message:any , statusCode:number) => {
    return res.status(statusCode).json({
        success:false,
        error:message
    })
}

export   {
    successResponse,
    errorResponse
}