import { errorResponse, successResponse } from "../handler/responseHandler";
import User from "../models/user";
import Patient from "../models/patients";

import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import data from '../security/keys';
import jwt from 'jsonwebtoken';
import {createClient} from 'redis';
import Doctor from "../models/doctor";
import ReqAppointment from "../models/requestAppointment";
import mongoose from "mongoose";
import Priscription from "../models/priscription";
import Role from "../models/roles";
import MedicalHistory from "../models/medicalHistory";
import i18n from "i18n";
import Feedback from "../models/feedBack";

const client = createClient()
client.on('error', err => console.log('Redis Client Error', err));

const TokenGenerator = require("token-generator")({
  salt: "your secret ingredient for this magic recipe",
  timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});
const bcrypt = require('bcrypt');

const viewAllRoles = async (req:Request,res:Response) => {
  try {
    const allRoles = await Role.find().select({
      '__v' : 0
    })

    successResponse(res,allRoles,200)
  } catch (error:any) {
      errorResponse(res,error,400)
  }
}

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

    const response = {
      msg: `${user.fullname} ${i18n.__('register')}`,
      token
    }
    successResponse(res,response,201)
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
  
    successResponse(res,i18n.__('verify-otp'),200)
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

    if(isUser?.otpVerification == false) throw 'otp verification required..'

    const token = jwt.sign({ email }  , data.SECRET_KEY );
    await client.connect();
    // res.cookie('JwtToken',token)    // store jwt token inside cookies
    await client.set('token', token);
    await client.disconnect()
    successResponse(res,`${isUser?.fullname} ${i18n.__('login')}..` , 200)
  } catch (error:any) {
    console.log(error.message);
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
    const diagnosis = req.body.diagnosis;

        const isPatient = await Patient.findOne({ email : req.body.user.email })
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
        email:user.email,
        diagnosis
      })

    successResponse(res,i18n.__('add-patient'),200)
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
  
    successResponse(res,i18n.__('update-patient'),200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const deletePatientsDetails = async (req:Request,res:Response) => {
    try {
      await Patient.findByIdAndDelete(req.params.id)
      
      successResponse(res,i18n.__('delete-patient'),200)
    } catch (error) {
      errorResponse(res,error,400)
    }
}

const viewPatient = async (req:Request,res:Response) => {
  try {
    const patient = await Patient.findOne({ email:req.body.user.email })
    .select(['nickname','DOB','contact_no','address','allergies','medical_history','current_condition','email'])
    
    const response = {
      msg:i18n.__('found'),
      patient
    }
    successResponse(res,response,200);
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const viewAllPateints = async (req:Request,res:Response) => {
 try {
    const searchData = req.query.search
    ? {
          $match: {
            $or: [
              { nickname: req.query.search },
              { contact_no: req.query.search },
              { address: req.query.search },
              { diagnosis: req.query.search },
              { allergies: req.query.search }
            ],
          },
        }
    : { $match: {} };

   const patien = await Patient.aggregate([
    { $match:{} },
    { $project : {
      'userId': 0,
      'createdAt': 0,
      'email': 0,
      'updatedAt': 0,
      '__v': 0
    } },
    searchData
   ]);

   for(let i=0;i<patien.length;i++){
      const isMedical = await MedicalHistory.findOne({patientId:patien[0]._id});

      if(isMedical){
        patien[0].medical_history = isMedical
      }
   }
 
   const response = {
     msg:i18n.__('all-patients'),
     patien
   } 
   successResponse(res,response,200)
 } catch (error:any) {
    console.log(error.message);
    errorResponse(res,error,400)
 }
}

const allDoctors = async (req:Request,res:Response) => {
   try {
    const doctors = await Doctor
    .find()
    .select({
      updatedAt:0,
      createdAt:0,
      __v:0,
    });
    const message = doctors.length > 0 ? i18n.__('all-doctors') : i18n.__('doctor-not-available');
    const response = {
      message,
      doctors
    }
    successResponse(res,response,200)
   } catch (error) {
      errorResponse(res,error,400)
   }
}

const doctorDetails = async (req:Request,res:Response) => {
  try {
    const address:string = req.body.address;
    const degree:string = req.body.degree;
    
    const isEmail = await Doctor.findOne({email:req.body.user.email})
      if(isEmail) throw i18n.__('already-email-used');
      
        await Doctor.create({
          name:req.body.user.fullname,
          email:req.body.user.email,
          address,
          degree
        })

      successResponse(res,i18n.__('doctor-created'),201)
  } catch (error) {
    errorResponse(res,error,401)
  }
}

const reqAppointmentByUser = async (req:Request,res:Response) => {
 try {
   const doctorId = new mongoose.Types.ObjectId(req.body.id)
   const appointmentDate = req.body.appointmentDate;
 
   await ReqAppointment.create({
     userId:req.body.user?._id,
     doctorId,
     appointmentDate
   })
   successResponse(res,i18n.__('appointment-req'),200)
 } catch (error) {
    errorResponse(res,error,400)
 }
}

const reqAppointmentByPatient = async (req:Request,res:Response) => {
  try {
    const doctorId = new mongoose.Types.ObjectId(req.body.id)
    const appointmentDate = req.body.appointmentDate;
  
    await ReqAppointment.create({
      patientId:req.body.patient?._id,
      doctorId,
      appointmentDate
    })
    successResponse(res,i18n.__('appointment-req'),200)
  } catch (error) {
     errorResponse(res,error,400)
  }
 }

const appointmentByDoctor = async (req:Request,res:Response) => {
  try {
    const status = req.body.status;
    const _id = new mongoose.Types.ObjectId(req.body.appointId)

    const appointmentData = await ReqAppointment.findById(_id)

    const timeDuration = req.body.timeDuration 
    ? await ReqAppointment.findOneAndUpdate({ _id },{
      status,
      timeDuration:req.body.timeDuration
    })
    : await ReqAppointment.findOneAndUpdate({ _id },{
      status
    })

    const user = appointmentData?.patientId ? await Patient.findById(appointmentData?.patientId) : await User.findById(appointmentData?.userId)

    if(status == 'approve'){
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
          to: user?.email, // list of receivers
          subject: "Appointment approved ✔", // Subject line
          text: `Dr.${req.body.doctor.name} accept your appointment..`, // plain text body
        });
      } catch (error) {
        console.log(error);
        throw i18n.__('mail-error')
      }
    }

    successResponse(res,i18n.__('appointment-edit-by-doctor'),200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const viewAppointmentByDoctor = async (req:Request,res:Response) => { 
  try {
    const searchData =  req.query.search
      ? {
          $match: {
            $or: [
              { status: req.query.search },
              { appointmentDate: req.query.search }
            ],
          },
        }
      : { $match: {} };

    const appointments = await ReqAppointment.aggregate([
      { $match : { doctorId: req.body.doctor?._id} },
      // { $lookup : {
      //   from: "patients",
      //   localField: "patientId",
      //   foreignField: "_id",
      //   as: "patient"
      //   } 
      // },
      // { $project : {
      //    "appointmentDate" : 1, 
      //    "timeDuration" : 1 , 
      //    "status" : 1 , 
      //    "patient" :1 ,
      //    "createdAt" : 1 ,
      //    "notesForRejection":1
      //   } 
      // },
      // { $unwind : "$patient"},
      { $sort : { createdAt : -1 } },
      searchData
    ]).project({
      "patient._id" : 0,
      "patient.createdAt" : 0,
      "patient.updatedAt" : 0,
      "patient.__v" : 0,
      "patient.userId" : 0,
      "patient.email" : 0,
    })
  
    const response = {
      msg:i18n.__('appointment-by-doctorId'),
      appointments
    }

    successResponse(res,response,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const updateAppointmentByDoctor = async (req:Request,res:Response) => {
  try {
    const id = new mongoose.Types.ObjectId(req.body.id);
    const timeDuration = req.body.timeDuration;
  
    await ReqAppointment.findByIdAndUpdate(id,{
      timeDuration
    })

    successResponse(res,i18n.__('update-appointment'),200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const deleteAppointmentByDoctor = async (req:Request,res:Response) => {
  try {
    const notes:string = req.body.notes;
    const id = new mongoose.Types.ObjectId(req.body.id);
    
    const appointmentData = await ReqAppointment.findById(id)

    await ReqAppointment.findByIdAndUpdate(id,{
      timeDuration:null,
      status:'reject',
      notesForRejection:notes
    })
    const newAppointment = await ReqAppointment.findById(id)
    const patient = await Patient.findById(appointmentData?.userId)

    if(newAppointment?.status == 'reject'){
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
          to: patient?.email, // list of receivers
          subject: "Appointment rejected ✔", // Subject line
          text: `Dr.${req.body.doctor.name} temparary rejected your appointment.. ${notes}`, // plain text body
        });
      } catch (error) {
        console.log(error);
        throw i18n.__('mail-error')
      }
    }


    successResponse(res,i18n.__('update-appointment'),200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const prescriptionByDoctor = async (req:Request,res:Response) => {
 try {
   const patientId = new mongoose.Types.ObjectId(req.body.patientId);

   const patient = await Patient.findById(patientId)

   const medications = req.body.medications;
   const dosages = req.body.dosages;
   const frequency = req.body.frequency;
   const durations = req.body.durations;
 
   await Priscription.create({
     medications,
     dosages,
     frequency,
     durations,
     doctorId:req.body.doctor?._id,
     patientId,
     diagnosis:patient?.diagnosis
   })

   successResponse(res,i18n.__('priscription-created'),200)
 } catch (error:any) {
  console.log(error.message);
    errorResponse(res,error,400)
 }
}

const medicalHistory = async (req:Request,res:Response) => {
  try {
    const patientId = new mongoose.Types.ObjectId(req.body.patientId);
  
    const appointments = await ReqAppointment.aggregate([
      { $match : { patientId:patientId } },
      { $project:{
          'patientId':0,
          'updatedAt':0,
          '__v':0
      } }
    ])

    const priscription = await Priscription.findOne({patientId})
    .select({
      '_id':0,
      'patientId':0,
      '__v':0
    })
    const medicalHistory = await MedicalHistory.create({
      appointments,
      priscription,
      patientId:patientId
    })
    successResponse(res,medicalHistory,200)
  } catch (error:any) {
    console.log(error.message);
      errorResponse(res,error,400)
  } 
}

const feedbackBypatient = async (req:Request,res:Response) => {
  try {
    const feedback:string = req.body.feedback;
    const patientId = req.body.patient._id;

    const isPatient = await Feedback.findOne({patientId})

    if(isPatient){
      throw i18n.__('isPateint')
    }

      await Feedback.create({
      patientId:req.body.patient._id,
      feedback
    })
  
    successResponse(res,i18n.__('create-feedback'),201)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

export {
  viewAllRoles,
  registerUser,
  verifyotp,
  loginUser,
  patiants,
  updatePatientsDetails,
  deletePatientsDetails,
  viewPatient,
  allDoctors,
  doctorDetails,
  reqAppointmentByUser,
  appointmentByDoctor,
  viewAppointmentByDoctor,
  updateAppointmentByDoctor,
  deleteAppointmentByDoctor,
  prescriptionByDoctor,
  viewAllPateints,
  medicalHistory,
  reqAppointmentByPatient,
  feedbackBypatient
}