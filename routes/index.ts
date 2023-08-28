import express,{Request,Response} from "express";
import Role from "../models/roles";
import {errorResponse, successResponse} from '../handler/responseHandler';
import userRoutes from '../routes/users/index'

const router = express.Router()

router.post('/role' , async (req:Request , res:Response) => {
    try {
        const role = req.body.role;
        await Role.create({ role });
        
        successResponse(res,`${role} created..`,201)

    } catch (error:any) {
        errorResponse(res,error,401)
    }
})

router.use('/users' , userRoutes)

export default router