import { errorResponse, successResponse } from "../handler/responseHandler";
import Role from "../models/roles";
import { Response,Request } from "express";

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

const viewAllRoles = async (req:Request,res:Response) => {
    try {
      const page:any = req.query.page ? req.query.page : 1;
      const actualpage = parseInt(page) - 1;
      const record = actualpage * 2;
  
      const searchData =  req.query.search
        ? {
            $match: {
              role: req.query.search             
            }
          }
        : { $match: {} };
  
      const allRoles = await Role.aggregate([
          searchData,
          {$project:{'__v':0}}
      ])
      .skip(record)
      .limit(2)
  
      successResponse(res,allRoles,200)
    } catch (error:any) {
        errorResponse(res,error,400)
    }
  }

export  {
    makeRoles,
    viewAllRoles
}