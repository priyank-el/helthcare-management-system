
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
        dob:'required|string',
        address:'required|string',
        contact_no:'required|string',
        medical_history:'required|string',
        current_condition:'string',
        diagnosis:'required|string',
        allergies:'required|array'
    }
    validation.validaeWithCallback(registerPatient , req , res , next)
}

const makePriscriptionValidator = (req:Request,res:Response,next:any) => {
    const makePriscription = {
        patientId:'required|string',
        appointmentId:'required|string',
        totalmedicine:'required|array'
    }
    validation.validaeWithCallback(makePriscription , req , res , next)
}

const registerDoctorValidator = (req:Request,res:Response,next:any) => {
    const registerDoctor = {
        name:'required|string',
        address:'required|string',
        degree:'required|string',
        email:'required|string|isUniqueemail:Doctor,email',
        contact:'required|string'
    }
    validation.validaeWithCallback(registerDoctor , req , res , next)
}

const feedbackValidator = (req:Request,res:Response,next:any) => {
    const feedback = {
        feedback:'required|string',
        doctorId:"required|string"
    }
    validation.validaeWithCallback(feedback , req , res , next)
}

const emergencyValidator = (req:Request,res:Response,next:any) => {
    const emergency = {
        relative:'required|string',
        contact_number:'required|string',
        address:'required|string'
    }
    validation.validaeWithCallback(emergency , req , res , next)
}

const updatePatientValidator = (req:Request,res:Response,next:any) => {
    const updatePatient = {
        dob:'string',
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

const priscriptionValidator = (req:Request,res:Response,next:any) => {
    const priscription = {
        patientId:'required|string',
        medications:'required',
        dosages:'required',
        frequency:'required',
        durations:'required'
    }
    validation.validaeWithCallback(priscription , req , res , next)
}

const deleteAppointmentValidator = (req:Request,res:Response,next:any) => {
    const deleteAppointment = {
        id:'required|string',
        notes:'required|string'
    }
    validation.validaeWithCallback(deleteAppointment , req , res , next)
}

const seduleAppointmentValidator = (req:Request,res:Response,next:any) => {
    const seduleAppointment = {
        appointId:'required|string',
        status:'required|string',
        timeDuration:'required'
    }
    validation.validaeWithCallback(seduleAppointment , req , res , next)
}

const updateAppointmentValidator = (req:Request,res:Response,next:any) => {
    const updateAppointment = {
        id:'required|string',
        timeDuration:'required'
    }
    validation.validaeWithCallback(updateAppointment , req , res , next)
}

const requestAppointmentValidator = (req:Request,res:Response,next:any) => {
    const requestAppointment = {
        id:'required|string',
        appointmentDate:'required'
    }
    validation.validaeWithCallback(requestAppointment , req , res , next)
}

const makeRoleValidator = (req:Request,res:Response,next:any) => {
    const makeRole = {
        role:'required|string'
    }
    validation.validaeWithCallback(makeRole , req , res , next)
}

const updateRoleValidator = (req:Request,res:Response,next:any) => {
    const updateRole = {
        oldRole:'required|string',
        newRole:'required|string',
    }
    validation.validaeWithCallback(updateRole , req , res , next)
}

const addMedicationValidator = (req:Request,res:Response,next:any) => {
    const addMedication = {
        name:'required|string|isUnique:Medication,name'
    }
    validation.validaeWithCallback(addMedication , req , res , next)
}

export {
    registerUserValidator,
    loginUserValidator,
    registerPatientValidator,
    registerDoctorValidator,
    updatePatientValidator,
    feedbackValidator,
    emergencyValidator,
    priscriptionValidator,
    deleteAppointmentValidator,
    seduleAppointmentValidator,
    updateAppointmentValidator,
    requestAppointmentValidator,
    makeRoleValidator,
    addMedicationValidator,
    updateRoleValidator,
    makePriscriptionValidator
}