import { Request, Response } from "express";
import bcrypt from "bcrypt"
import Admin from "../models/admin";
import jwt from 'jsonwebtoken';
import data from "../security/keys";
import { errorResponse, successResponse } from "../handler/responseHandler";
import Role from "../models/roles";
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
const makeRoles = async (req:Request , res:Response) => {
    try {
        const role = req.body.role;
        const isAlreadyExist = await Role.findOne({role})
        if(isAlreadyExist) throw "Role already in list.."
        await Role.create({ role });
        
        successResponse(res,req.body.language.CREATED,201)

    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

const updateRole = async (req:Request , res:Response) => {
    try {
        const oldRole = req.body.oldRole;
        const newRole = req.body.newRole;
        if(oldRole === newRole) throw "Both roles are same.."
        const isRole = await Role.findOneAndUpdate({ role:oldRole },{
          role:newRole
        });
        if(!isRole) throw "this role not in list please add role first.."
        successResponse(res,req.body.language.ROLE_UPDATED,201)

    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

const viewAllRoles = async (req:Request,res:Response) => {
    try {
      const page:any = req.query.page ? req.query.page : 1;
      const actualpage = parseInt(page) - 1;
      const record = actualpage * 2;
  
      const searchData =  req.query.search
        ? {
            $match: {
              role: { $regex: req.query.search, $options: 'i' }          
            }
          }
        : { $match: {} };
  
      const allRoles = await Role.aggregate([
          searchData
      ])
      .skip(record)
      .limit(2)
      .project({
        "__v":0
      })

      successResponse(res,allRoles,200)
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
    const medicine = await Medications.create({
      name
    })

    successResponse(res,medicine,200)
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
    makeRoles,
    viewAllRoles,
    allPriscription,
    addMedications,
    allMedications,
    allUsers,
    blockPatient,
    updateRole
}