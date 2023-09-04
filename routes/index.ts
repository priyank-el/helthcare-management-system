import express,{Request,Response} from "express";
import Role from "../models/roles";
import {errorResponse, successResponse} from '../handler/responseHandler';
import userRoutes from '../routes/users/index';
import i18n from 'i18n';

const router = express.Router()

router.get('/set-locale',(req:Request,res:Response) => {
    const lang:any = req.query.lang
    const language = i18n.setLocale(lang);
    
    return res.status(200).json({
        success:true,
        language:`${language} language seted..`
    })
})

router.post('/role' , async (req:Request , res:Response) => {
    try {
        const role = req.body.role;
        await Role.create({ role });
        
        successResponse(res,`${role} ${i18n.__('created')} `,201)

    } catch (error:any) {
        console.log(error.message);
        errorResponse(res,error,401)
    }
})

router.use('/users' , userRoutes)

export default router