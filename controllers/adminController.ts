import { Aggregate } from "mongoose";
import { errorResponse, successResponse } from "../handler/responseHandler";
import Medications from "../models/madications";
import Priscription from "../models/priscription";
import Role from "../models/roles";
import { Response,Request } from "express";
import i18n from "i18n";
import User from "../models/user";

const makeRoles = async (req:Request , res:Response) => {
    try {
        const role = req.body.role;
        await Role.create({ role });
        
        successResponse(res,`${role} ${i18n.__('created')} `,201)

    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
}

const updateRole = async (req:Request , res:Response) => {
    try {
        const oldRole = req.body.oldRole;
        const newRole = req.body.newRole;
        const isRole = await Role.findOneAndUpdate({ role:oldRole },{
          role:newRole
        });
        if(!isRole) throw "this role not in list please add role first.."
        const response = {
          message:req.body.language.CREATED
        }
        successResponse(res,response,201)

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
      const response = {
        message:"user Upadated successfully.."
      }
      successResponse(res,response,200)
  } catch (error:any) {
    console.log(error.message);
    errorResponse(res,error,400)
  }
}

const allUsers = async (req:Request,res:Response) => {
  try {
    const allUsers = await User.find()
    .select({
      "_id":1,
      "fullname":1,
      "email":1,
      "role":1,
      "createdAt":1,
      "activeStatus":1
    })
  
    successResponse(res,allUsers,200)
  } catch (error) {
    errorResponse(res,error,400)
  }
}

export  {
    makeRoles,
    viewAllRoles,
    allPriscription,
    addMedications,
    allMedications,
    allUsers,
    blockPatient,
    updateRole
}