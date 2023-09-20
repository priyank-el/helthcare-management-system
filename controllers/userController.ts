import { errorResponse, successResponse } from "../handler/responseHandler";
import User from "../models/user";
import Patient from "../models/patients";

import { Request, Response, response } from "express";
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import data from '../security/keys';

import jwt from 'jsonwebtoken';
import Doctor from "../models/doctor";
import ReqAppointment from "../models/requestAppointment";
import mongoose from "mongoose";
import Priscription from "../models/priscription";
import MedicalHistory from '../models/medicalHistory';
import Feedback from "../models/feedBack";
import Emergency from "../models/emergency";
import Notification from "../models/notification";
import Role from "../models/roles";

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
      throw "mail not send because of invalid credentials.."
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
      msg: `${user.fullname} registered successfully..`,
      token
    }
    successResponse(res,response,201)
  } catch (error:any) {
    console.log(error.message);
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
  
    successResponse(res,"otp verification done successfully",200)
} catch (error) {
    errorResponse(res,error,400)
}
}

const loginUser = async (req:Request,res:Response) => {
  try {
    const email:string = req.body.email;
    const password:string = req.body.password;
  
    const isUser = await User.findOne({ email })
    const role = await Role.findById(isUser?.role)
    const pass = await bcrypt.compare(password,isUser?.password);
  
    if(!pass) throw 'password miss matched..';

    if(isUser?.otpVerification == false) throw 'otp verification required..'

    const token = jwt.sign({ email,role:role?.role }  , data.SECRET_KEY );
    res.cookie('JwtToken',token)  
    const response = {
      token
    }
    successResponse(res,response , 200)
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
        if(isPatient) throw req.body.language.EMAIL_ALREADY_EXIST

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

    successResponse(res,req.body.language.ADD_PATIENT,200)
  } catch (error:any) {
    errorResponse(res,error,401)
  }
}

const updatePatientsDetails = async (req:Request,res:Response) => {
  try {
    const user = req.body.user;
    
    const dob:string = req.body.dob;
    const address:string = req.body.address;
    const contact_no:string = req.body.contact_no;
    const medical_history:string = req.body.medical_history;
    const allergies:string = req.body.allergies;
    const current_condition:string = req.body.current_condition;
  
      await Patient.findOneAndUpdate( {email :user.email} ,{
        nickname:user.fullname,
        dob,
        address,
        contact_no,
        medical_history,
        allergies,
        current_condition,
        userId:user._id,
        email:user.email
      })
  
    successResponse(res,req.body.language.UPDATE_PATIENT,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const deletePatientsDetails = async (req:Request,res:Response) => {
    try {
      await Patient.findByIdAndDelete(req.params.id)
      
      successResponse(res,req.body.language.DELETE_PATIENT,200)
    } catch (error) {
      errorResponse(res,error,400)
    }
}

const viewPatient = async (req:Request,res:Response) => {
  try {
    const patient = await Patient.findOne({email:req.body.user.email})
    const isHistory = await MedicalHistory.findOne({patientId:patient?._id})
    if(isHistory){
    await Patient.findOneAndUpdate({ email:req.body.user.email },{ medical_history:isHistory })
    .select(['nickname','diagnosis','contact_no','address','allergies','medical_history','current_condition','email','dob'])
    const patient = await Patient.findOne({ email:req.body.user.email })
    successResponse(res,patient,200);
    }else{
      const patient = await Patient.findOne({ email:req.body.user.email })
      .select(['nickname','diagnosis','contact_no','address','allergies','medical_history','current_condition','email','dob'])  
      successResponse(res,patient,200);
    }
  } catch (error:any) {
    console.log(error.message);
    errorResponse(res,error,400)
  }
}

const viewAllPateints = async (req:Request,res:Response) => {
 try {
  const page:any = req.query.page ? req.query.page : 1;
  const actualpage = parseInt(page) - 1;
  const record = actualpage * 3;
  const data = `${req.query.search}*`
    const searchData = req.query.search
    ? {
          $match: {
            $or: [
              { nickname: { $regex: data, $options: 'i' } },
              { contact_no: { $regex: data, $options: 'i' } },
              { address: { $regex: data, $options: 'i' } },
              { diagnosis:{ $regex: data, $options: 'i' } },
              { allergies: { $regex: data, $options: 'i' } }
            ],
          },
        }
    : { $match: {} };
        
   const patien = await Patient.aggregate([
    searchData,
    { $project : {
      'userId': 0,
      'createdAt': 0,
      'email': 0,
      'updatedAt': 0,
      '__v': 0
    } },
   ])
   .skip(record)
   .limit(3);

   for(let i=0;i<patien.length;i++){
      const isMedical = await MedicalHistory.findOne({patientId:patien[i]._id});

      if(isMedical){
        patien[i].medical_history = isMedical
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

    const data = `${req.query.search}*`
    const searchData = req.query.search
    ? {
          $match: {
            $or: [
              { name: { $regex: data, $options: 'i' } },
              { degree: { $regex: data, $options: 'i' } },
              { address: { $regex: data, $options: 'i' } }
            ],
          },
        }
    : { $match: {} };
        

    const doctors = await Doctor.aggregate([
      searchData,
      { $project : {
        'createdAt':0,
        'updatedAt':0,
        '__v':0
      } }
    ])
    .skip(record)
    .limit(3);

    successResponse(res,doctors,200)
   } catch (error:any) {
    console.log(error.message);
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
      if(isEmail) throw req.body.language.EMAIL_ALREADY_EXIST
      
        await Doctor.create({
          name:req.body.name,
          email,
          address,
          degree,
          image,
          contact
        })
        const response = {
          message:"doctor created.."
        }
      successResponse(res,response,201)
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
   successResponse(res,req.body.language.REQUEST_APPOINTMENT,200)
 } catch (error) {
    errorResponse(res,error,400)
 }
}

const reqAppointmentByPatient = async (req:Request,res:Response) => {
  try {
    const doctorId = new mongoose.Types.ObjectId(req.body.id)
    const appointmentDate = req.body.appointmentDate;
    const patient = await Patient.findOne({email:req.body.user.email})
    const hasAlready = await ReqAppointment.findOne({
      doctorId,
      appointmentDate,
      patientId:patient?._id
    })
    if(hasAlready){
      throw "Your appointment already received.."
    }
    else{
    await ReqAppointment.create({
      patientId:patient?._id,
      doctorId,
      appointmentDate
    })
  }
  const response = {meg:req.body.language.REQUEST_APPOINTMENT}
    successResponse(res,response,200)
  } catch (error) {
     errorResponse(res,error,400)
  }
 }

const appointmentByDoctor = async (req:Request,res:Response) => {
  try {
    const status = req.body.status;
    const _id = new mongoose.Types.ObjectId(req.body.appointId)
    const doctor = await Doctor.findOne({email:req.body.user.email})

    const appointmentData = await ReqAppointment.findById(_id)
    if(appointmentData?.status == "approve") throw "status already changed.."
    else{
    const timeDuration = req.body.timeDuration 
    ? await ReqAppointment.findOneAndUpdate({ _id },{
      status,
      timeDuration:req.body.timeDuration
    })
    : await ReqAppointment.findOneAndUpdate({ _id },{
      status
    })
  }
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
          text: `Dr.${doctor?.name} accept your appointment..`, // plain text body
        });
      } catch (error) {
        console.log(error);
        throw req.body.language.SOMETHING_ERROR_IN_MAIL
      }
    }
    const response = {
      message:req.body.language.APPOINTMENT_EDIT_BY_DOCTOR
    }
    successResponse(res,response,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const viewAppointmentByDoctor = async (req:Request,res:Response) => { 
  try {
    const page:any = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 3;
    const doctor = await Doctor.findOne({
      email:req.body.user.email
    })

    const searchData =  req.query.search
      ? {
          $match: {
            $or: [
              { status: { $regex: req.query.search, $options: 'i' }},
              { appointmentDate: { $regex: req.query.search, $options: 'i' }}
            ],
          },
        }
      : { $match: {} };

    const appointments = await ReqAppointment.aggregate([
      { $match : { doctorId:doctor?._id} },
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
    if(!request) throw req.body.language.APPOINTMENT_ERROR
  
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

    successResponse(res,req.body.language.APPOINTMENT_EDIT_BY_DOCTOR,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const deleteAppointmentByDoctor = async (req:Request,res:Response) => {
  try {
    const notes:string = req.body.notes;
    const id = new mongoose.Types.ObjectId(req.body.id);
    const doctor = await Doctor.findOne({email:req.body.user.email})
    
    const appointmentData = await ReqAppointment.findById(id)
    if(appointmentData?.status == 'reject'){
      throw "appointment status already rejected.."
    }
    else{
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
          text: `Dr.${doctor?.name} temparary rejected your appointment.. ${notes}`, // plain text body
        });
      } catch (error) {
        console.log(error);
        throw req.body.language.SOMETHING_ERROR_IN_MAIL
      }
    }
  }
    const response = {message:req.body.language.UPDATE_APPOINTMENT}
    successResponse(res,response,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const prescriptionByDoctor = async (req:Request,res:Response) => {
 try {
   const patientId = new mongoose.Types.ObjectId(req.body.patientId);
   const totalmedicine = req.body.totalmedicine;
   const appointmentId = req.body.appointmentId;

   const doctor = await Doctor.findOne({email:req.body.user.email})
 
   await Priscription.create({
    totalMedicine:totalmedicine,
      appointmentId,
      doctorId:doctor?._id,
      patientId
   })

   successResponse(res,req.body.language.PRISCRIPTION_CREATED,200)
 } catch (error:any) {
  console.log(error.message);
    errorResponse(res,error,400)
 }
}

const medicalHistory = async (req:Request, res:Response) => {
  try {
    const patient = await Patient.findOne({ email: req.body.user.email });
    const id = new mongoose.Types.ObjectId(patient?.id);
    const appointments = await ReqAppointment.aggregate([
      { $match: { patientId: id } },
      {
        $match: {
          $or: [
            { status: 'approve' },
            { status: 'reject' },
          ],
        },
      },
      {
        $project: {
          'patientId': 0,
          'updatedAt': 0,
          '__v': 0,
        },
      },
    ]);

    const priscription = await Priscription.aggregate([{ $match: {} }]);

    // Create an array to hold the formatted history
    const formattedHistory:any = [];

    // Iterate through appointments and create formatted objects
    appointments.forEach((appointment, index) => {
      if(priscription.length == 0){
        const formattedAppointment = {
          [`appointment`]: {
            ...appointment
          },
          'priscription': [],
        };
        formattedHistory.push(formattedAppointment);
      }else{
        priscription.forEach((priscriptionData) => {
          const formattedAppointment = {
            [`appointment`]: {
              ...appointment,
            },
            ['priscription']: {...priscriptionData},
          };
        formattedHistory.push(formattedAppointment);
        })
      }
    });
    //Create medical History based on appointment and priscription
    const isHistoryData = await MedicalHistory.findOne({patientId:patient?.id})
    if(isHistoryData){
      const medicalHistory = await MedicalHistory.findOneAndUpdate({patientId:patient?._id},
        {
          history:formattedHistory,
          patientId:patient?._id
        })
    successResponse(res, medicalHistory, 200);

    }
    else{
      const medicalHistory = await MedicalHistory.create({
        history:formattedHistory,
        patientId:patient?._id
      })
    successResponse(res, medicalHistory, 200);
    }
    
  } catch (error:any) {
    console.error(error.message);
    errorResponse(res, error, 400);
  }
};

const feedbackBypatient = async (req:Request,res:Response) => {
  try {
    const feedback:string = req.body.feedback;
    const patient = await Patient.findOne({email:req.body.user.email});
    const doctorId = req.body.doctorId;

    const isPatient = await Feedback.findOne({patientId:patient?._id})

    if(isPatient){
      throw req.body.language.PATIENT_ALREADY_EXIST
    }

      await Feedback.create({
      patientId:patient?._id,
      doctorId,
      feedback
    })
  
    successResponse(res,req.body.language.MAKE_FEEDBACK,201)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

const updateFeedback = async (req:Request,res:Response) => {
  try {
    const feedback  = req.body.feedback;
    const doctorId = req.body.doctorId;
    const actualFeedback = feedback.toLowerCase().trim();
    const patient = await Patient.findOne({email:req.body.user.email});
  
    await Feedback.findOneAndUpdate({
      patientId:patient?._id
    },{
      feedback:actualFeedback,
      doctorId
    })
    const response = {
      message:"Feedback updated successfully.."
    }
    successResponse(res,response,200)
  } catch (error:any) {
    console.log(error.message);
      errorResponse(res,error,400)
  }
}

const emergency = async (req:Request,res:Response) => {
 try {
   const relative:string = req.body.relative;
   const contact_number:string  = req.body.contact_number;
   const address = req.body.address;

  const isExist = await Emergency.findOne({
    userId:req.body.user._id
  })

  if(isExist) throw req.body.language.PATIENT_ALREADY_EXIST

   await Emergency.create({
     userId:req.body.user._id,
     address,
     contact_number,
     relative,
     patientId:req.body.patient._id
   })
   
   successResponse(res,req.body.language.EMERGENCY_CREATED,200)
 } catch (error:any) {
    errorResponse(res,error,400)
 }
}

const allPriscription = async (req:Request,res:Response) => {
  try {
    const allPriscription = await Priscription.find();
    successResponse(res,allPriscription,200)
  } catch (error) {
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
  allPriscription,
  updateFeedback
}