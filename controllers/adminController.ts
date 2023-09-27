import { Request, Response } from "express";
import bcrypt from "bcrypt"
import Admin from "../models/admin";
import jwt from 'jsonwebtoken';
import data from "../security/keys";
import { errorResponse, successResponse } from "../handler/responseHandler";
import Medications from "../models/madications";
import User from "../models/user";
import Priscription from "../models/priscription";

const addAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const hasedPassword = await bcrypt.hash(password, 10)
        const admin = await Admin.create({
            name,
            email,
            password: hasedPassword
        })
        if (!admin) throw "Admin not created.."
        successResponse(res, "Admin created..", 201)
    } catch (error) {
        errorResponse(res, error, 400)
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const isAdmin: any = await Admin.findOne({ email })
        const isValidPassword = await bcrypt.compare(password, isAdmin?.password)
        if (!isAdmin) throw "Admin not found..";
        if (!isValidPassword) throw "Admin password missmatch..";
        const token = jwt.sign({ email }, data.SECRET_KEY);
        res.cookie('JwtToken', token)
        successResponse(res, token, 201)
    } catch (error) {
        errorResponse(res, error, 400)
    }
}
// ======================= MAIN APIs ========================

const allPriscription = async (req:Request,res:Response) => {
  try {
    const allPriscription = await Priscription.aggregate([
      {
        $lookup: {
          from: "doctors",
          localField: "doctorId",
          foreignField: "_id",
          as: "doctor_data",
        }
      },
      {
        $unwind:"$doctor_data"
      },
      {
        $lookup: {
          from: "patients",
          localField: "patientId",
          foreignField: "_id",
          as: "patient",
        }
      },
      {
        $unwind:"$patient"
      }
    ]).project({
      "_id":1,
      "totalMedicine":1,
      "appointmentId":1,
      "notes":1,
      "doctor_data._id":1,
      "doctor_data.image":1,
      "doctor_data.name":1,
      "doctor_data.degree":1,
      "patient._id":1,
      "patient.nickname":1,
      "patient.image":1
    })
    successResponse(res,allPriscription,200)
  } catch (error) {
      errorResponse(res,error,400) 
  }
}

const allMedications = async (req:Request,res:Response) => {
  try {
    const page:any = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 2;
    const searchData = req.query.search
    ? {
          $match: {
            $or: [
              { name: { $regex: req.query.search, $options: 'i' } }
            ],
          },
        }
    : { $match: {} };
    const allMedications = await Medications
    .aggregate([
      searchData
    ])
    .project({
      "__v":0
    })
    .skip(record)
    .limit(2)

    successResponse(res,allMedications,200)
  } catch (error) {
      errorResponse(res,error,400) 
  }
}

const addMedications = async (req:Request,res:Response) => {
try {
    const name:string = req.body.name;
    const isAlreadyInList = await Medications.findOne({name});
    if(isAlreadyInList) throw "This medication is already available in store.."
    const medicine = await Medications.create({
      name
    })

    successResponse(res,"medicine added..",200)
} catch (error:any) {
  console.log(error.message);
    errorResponse(res,error,400)
}
}

const updateMedications = async (req:Request,res:Response) => {
try {
  const medicationId = req.body.medicationId;
    const name:string = req.body.name;
    const medicine = await Medications.findById(medicationId)
    if(medicine?.name === name) throw "You enter same name which is aleady available.."
    await Medications.findByIdAndUpdate(medicationId,{
      name
    })
    successResponse(res,"Medication updated",200)
} catch (error:any) {
  console.log(error.message);
    errorResponse(res,error,400)
}
}

const blockPatient = async (req:Request,res:Response) => {
  try {
    const userId = req.body.id;
  
    const updateUser = await User.findByIdAndUpdate(userId,
      {
        activeStatus:0
      })
      successResponse(res,"user Upadated successfully..",200)
  } catch (error:any) {
    console.log(error.message);
    errorResponse(res,error,400)
  }
}

const allUsers = async (req:Request,res:Response) => {
  try {
    const page:any = req.query.page ? req.query.page : 1;
    const actualpage = parseInt(page) - 1;
    const record = actualpage * 2;

    const data = `${req.query.search}*`
    const searchData = req.query.search
    ? {
          $match: {
            $or: [
              { fullname: { $regex: data, $options: 'i' } },
              { email: { $regex: data, $options: 'i' } },
              { role: { $regex: data, $options: 'i' } }
            ],
          },
        }
    : { $match: {} };
  
    const allUsers = await User.aggregate([
      searchData
    ])
    .project({
      "_id":1,
      "fullname":1,
      "email":1,
      "role":1,
      "createdAt":1,
      "activeStatus":1
    })
    .skip(record)
    .limit(2)
  
    successResponse(res,allUsers,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

    
export {
    addAdmin,
    login,
    // makeRoles,
    // viewAllRoles,
    allPriscription,
    addMedications,
    updateMedications,
    allMedications,
    allUsers,
    blockPatient,
    // updateRole
}