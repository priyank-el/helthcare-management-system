import { errorResponse, successResponse } from "../handler/responseHandler";
import User from "../models/user";
import Patient from "../models/patients";

import { Request, Response } from "express";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import data from '../security/keys';
import jwt from 'jsonwebtoken';
import Doctor from "../models/doctor";
import ReqAppointment from "../models/requestAppointment";
import mongoose from "mongoose";
import Priscription from "../models/priscription";
import MedicalHistory from "../models/medicalHistory";
import i18n from "i18n";
import Feedback from "../models/feedBack";
import Emergency from "../models/emergency";
import Notification from "../models/notification";

const TokenGenerator = require("token-generator")({
  salt: "your secret ingredient for this magic recipe",
  timestampMap: "abcdefghij", // 10 chars array for obfuscation proposes
});
const bcrypt = require('bcrypt');

const setLanguage = (req:Request,res:Response) => {
  const lang:any = req.query.lang
  const language = i18n.setLocale(lang);
  
  return res.status(200).json({
      success:true,
      language:`${language} language seted..`
  })
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
    res.cookie('JwtToken',token)  
    successResponse(res,token , 200)
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
    
    successResponse(res,patient,200);
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const viewAllPateints = async (req:Request,res:Response) => {
 try {
  const page:any = req.query.page ? req.query.page : 1;
  const actualpage = parseInt(page) - 1;
  const record = actualpage * 3;

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
   ])
   .skip(record)
   .limit(2);

   for(let i=0;i<patien.length;i++){
      const isMedical = await MedicalHistory.findOne({patientId:patien[0]._id});

      if(isMedical){
        patien[0].medical_history = isMedical
      }
   }
 
   successResponse(res,patien,200)
 } catch (error:any) {
    console.log(error.message);
    errorResponse(res,error,400)
 }
}

const allDoctors = async (req:Request,res:Response) => {
   try {
    const page:any = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 3;

    const doctors = await Doctor
    .find()
    .select({
      updatedAt:0,
      createdAt:0,
      __v:0,
    })
    .skip(record)
    .limit(3);

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
    const email= req.body.email;
    const contact:string = req.body.contact;
    const image:any = req.file?.filename;
    
    const isEmail = await Doctor.findOne({email:req.body.email})
      if(isEmail) throw i18n.__('already-email-used');
      
        await Doctor.create({
          name:req.body.name,
          email,
          address,
          degree,
          image,
          contact
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
    const appoint = await ReqAppointment.findById(_id)

    if(appoint?.status === 'approve'){
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
    const page:any = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 3;

    const searchData =  req.query.search
      ? {
          $match: {
            $or: [
              { status: req.query.search },
              { appointmentDate: req.query.appointmentDate }
            ],
          },
        }
      : { $match: {} };

    const appointments = await ReqAppointment.aggregate([
      { $match : { doctorId: req.body.doctor?._id} },
      { $sort : { createdAt : -1 } },
      searchData
    ]).project({
      '__v':0
    })
    .skip(record)
    .limit(3)

    successResponse(res,appointments,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const updateAppointmentByDoctor = async (req:Request,res:Response) => {
  try {
    const id = new mongoose.Types.ObjectId(req.body.id);
    const timeDuration = req.body.timeDuration;

    const request = await ReqAppointment.findById(id);
    if(!request) throw i18n.__('not-valid-appointment')
  
    await ReqAppointment.findByIdAndUpdate(id,{
      timeDuration
    });
    try {
      await Notification.create({
        patientId:request?.patientId,
        notification:`Your appointment time change by doctor it is : ${timeDuration} `
      })
    } catch (error) {
      throw error;
    }

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
    const user = appointmentData?.patientId ?  await Patient.findById(appointmentData?.patientId) : await User.findById(appointmentData?.userId)
 
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
          to: user?.email, // list of receivers
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
   const totalmedicine = req.body.totalmedicine;
 
   await Priscription.create({
    totalMedicine:totalmedicine,
     doctorId:req.body.doctor?._id,
     patientId
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

const emergency = async (req:Request,res:Response) => {
 try {
   const reason:string = req.body.reason;
   const age:string  = req.body.age;
   const contactNO = req.body.contact;

  const isExist = await Emergency.findOne({
    userId:req.body.user._id
  })

  if(isExist) throw i18n.__('isPateint')

   await Emergency.create({
     userId:req.body.user._id,
     reason,
     age,
     contactNO
   })
   
   successResponse(res,i18n.__('created-emergency'),200)
 } catch (error:any) {
    errorResponse(res,error,400)
 }
}

export {
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
  feedbackBypatient,
  emergency,
  setLanguage
}