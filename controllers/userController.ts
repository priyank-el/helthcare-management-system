import { errorResponse, successResponse } from "../handler/responseHandler";
import User from "../models/user";
import Patient from "../models/patients";

import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import data from '../security/keys';
import jwt from 'jsonwebtoken';
import {createClient} from 'redis';

const client = createClient()
client.on('error', err => console.log('Redis Client Error', err));

const TokenGenerator = require("token-generator")({
  salt: "your secret ingredient for this magic recipe",
  timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});
const bcrypt = require('bcrypt');

const registerUser = async (req: Request, res: Response) => {
  try {
    const fullname: string = req.body.fullname;
    const email: string = req.body.email;
    const pass: string = req.body.password;
    const role: string = req.body.role;

    const otp: string = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const password = await bcrypt.hash(pass,10);

    const token:string = TokenGenerator.generate();

    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<< SENDING MAIL >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data.ADMIN_EMAIL,
        pass: data.ADMIN_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: data.ADMIN_EMAIL, // sender address
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `Hello ${fullname}, Your otp is ${otp} `, // plain text body
      });
    } catch (error) {
      console.log(error);
      throw 'mail not send because of invalid credentials..'
    }
    const user = await User.create({
      fullname,
      email,
      password,
      role,
      otp,
      token
    });
    successResponse(res,`${user.fullname} registered..`,201)
  } catch (error) {
    errorResponse(res, error, 401)
  }
}

const verifyotp = async (req:Request,res:Response) => {
try {
    const otp:string = req.body.otp;
    const token = req.headers.token;

    const user = await User.findOne({ token })

    if(user?.otp !== otp) throw 'otp not matched..';

    await User.findOneAndUpdate({ token },{
      otpVerification :true
    })
  
    successResponse(res,'otp verified..',200)
} catch (error) {
    errorResponse(res,error,400)
}
}

const loginUser = async (req:Request,res:Response) => {
  try {
    const email:string = req.body.email;
    const password:string = req.body.password;
  
    const isUser = await User.findOne({ email })
    const pass = await bcrypt.compare(password,isUser?.password);
  
    if(!pass) throw 'password miss matched..';

    const token = jwt.sign({ email }  , data.SECRET_KEY );
    await client.connect();
    // res.cookie('JwtToken',token)    // store jwt token inside cookies
    await client.set('token', token);
  
    successResponse(res,`${isUser?.fullname} loged in..` , 200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const patiants = async (req:Request,res:Response) => {
  try {
    const user = req.body.user;
  
    const DOB:string = req.body.DOB;
    const address:string = req.body.address;
    const contact_no:string = req.body.contact_no;
    const medical_history:string = req.body.medical_history;
    const allergies:string = req.body.allergies;
    const current_condition:string = req.body.current_condition;
  
    if(user?.role == '64ec3894149724882c351e56') {
      const uniqueEmail = user.email
      const isPatient = await Patient.findOne({ email : uniqueEmail })

      if(isPatient) throw `email already in use..`;

      await Patient.create({
        nickname:user.fullname,
        DOB,
        address,
        contact_no,
        medical_history,
        allergies,
        current_condition,
        userId:user._id,
        email:user.email
      })
    }else{
      console.log("not patient..");
      throw "not patient.."
    }
    successResponse(res,'patient record inserted..',200)
  } catch (error:any) {
    errorResponse(res,error,401)
  }
}

const updatePatientsDetails = async (req:Request,res:Response) => {
  try {
    const user = req.body.user;
    
    const DOB:string = req.body.DOB;
    const address:string = req.body.address;
    const contact_no:string = req.body.contact_no;
    const medical_history:string = req.body.medical_history;
    const allergies:string = req.body.allergies;
    const current_condition:string = req.body.current_condition;
  
    if(user?.role == '64ec3894149724882c351e56') {
      
      await Patient.findOneAndUpdate( {email :user.email} ,{
        nickname:user.fullname,
        DOB,
        address,
        contact_no,
        medical_history,
        allergies,
        current_condition,
        userId:user._id,
        email:user.email
      })
    }else{
      console.log("not patient..");
      throw "not patient.."
    }
    successResponse(res,'patient data updated...',200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const deletePatientsDetails = async (req:Request,res:Response) => {
    try {
      await Patient.findByIdAndDelete(req.params.id)
      
      successResponse(res,'patient deleted..',200)
    } catch (error) {
      errorResponse(res,error,400)
    }
}

const viewPatient = async (req:Request,res:Response) => {
  try {
    const patient = await Patient.findOne({ email:req.body.user.email })
    .select(['nickname','DOB','contact_no','address','allergies','medical_history','current_condition','email'])
    
    const response = {
      msg:'user found..',
      patient
    }
    successResponse(res,response,200);
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const allDoctors = async (req:Request,res:Response) => {
   try {
    const doctors = await User.aggregate([
     { $match : { role : '64ec3838149724882c351e50' } },
     { $project : { 'fullname':1,'email':1 } }
    ])
    const message = doctors.length > 0 ? 'All doctors found..' : 'currently any doctor not available';
    const response = {
      message,
      doctors
    }
    successResponse(res,response,200)
   } catch (error) {
      errorResponse(res,error,400)
   }
}

// const applyAppointment = async (req:Request,res:Response) => {
//   const patient = await Patient.findOne({ email:req.body.email })

//   // const appointment = await 
// }

export {
  registerUser,
  verifyotp,
  loginUser,
  patiants,
  updatePatientsDetails,
  deletePatientsDetails,
  viewPatient,
  allDoctors
}