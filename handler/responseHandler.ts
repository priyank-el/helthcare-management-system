import { Response } from "express";

const successResponse = (res:Response ,message:any , statusCode:number ) => {
    return res.status(statusCode).json(message)
}

const errorResponse = (res:Response ,message:any , statusCode:number) => {
    return res.status(statusCode).json({
        error:message
    })
}

export   {
    successResponse,
    errorResponse
}