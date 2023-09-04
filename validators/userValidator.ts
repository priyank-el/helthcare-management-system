
import validation from '../validators/middleware'
import { Request,Response } from "express"

const registerUserValidator = (req:Request,res:Response,next:any) => {
    const registerUser = {
        fullname:'required|string',
        email:'required|isUniqueemail:User,email',
        password:'required|string',
        role:'required|string'
    }
    validation.validaeWithCallback(registerUser , req , res , next)
}

const registerPatientValidator = (req:Request,res:Response,next:any) => {
    const registerPatient = {
        DOB:'required|string',
        address:'required|string',
        contact_no:'required|string',
        medical_history:'required|string',
        current_condition:'required|string'
    }
    validation.validaeWithCallback(registerPatient , req , res , next)
}

const registerDoctorValidator = (req:Request,res:Response,next:any) => {
    const registerDoctor = {
        address:'required|string',
        degree:'required|string'
    }
    validation.validaeWithCallback(registerDoctor , req , res , next)
}

const feedbackValidator = (req:Request,res:Response,next:any) => {
    const feedback = {
        feedback:'required|string'
    }
    validation.validaeWithCallback(feedback , req , res , next)
}

const emergencyValidator = (req:Request,res:Response,next:any) => {
    const emergency = {
        reason:'required|string',
        age:'required|string',
        contact:'required|string'
    }
    validation.validaeWithCallback(emergency , req , res , next)
}

const updatePatientValidator = (req:Request,res:Response,next:any) => {
    const updatePatient = {
        DOB:'string',
        address:'string',
        contact_no:'string',
        medical_history:'string',
        current_condition:'string'
    }
    validation.validaeWithCallback(updatePatient , req , res , next)
}
const loginUserValidator = (req:Request,res:Response,next:any) => {
    const loginUser = {
        email:'required|email',
        password:'required|string'
    }
    validation.validaeWithCallback(loginUser , req , res , next)
}


export {
    registerUserValidator,
    loginUserValidator,
    registerPatientValidator,
    registerDoctorValidator,
    updatePatientValidator,
    feedbackValidator,
    emergencyValidator
}