
import validation from '../validators/middleware'
import { Request,Response } from "express"

const registerUserValidator = (req:Request,res:Response,next:any) => {
    const registerUser = {
        fullname:'required',
        email:'required|isUniqueemail:User,email',
        password:'required',
        role:'required'
    }
    validation.validaeWithCallback(registerUser , req , res , next)
}
const loginUserValidator = (req:Request,res:Response,next:any) => {
    const loginUser = {
        email:'required|email',
        password:'required'
    }
    validation.validaeWithCallback(loginUser , req , res , next)
}


export {
    registerUserValidator,
    loginUserValidator
}