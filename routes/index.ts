import express,{ Request, Response } from "express";
import { 
    emergencyValidator,
    loginUserValidator,
    registerUserValidator
} from "../validators/userValidator";

import { 
    allDoctors,
    emergency,
    loginUser,
    registerUser, 
    reqAppointmentByUser,
    verifyotp
} from "../controllers/userController";

import patientRoutes from '../routes/patients/index';
import adminRoutes from '../routes/admin/index';
import doctorRoutes from '../routes/doctors/index'
import jwtAuth from "../middleware/jwtAuth";
import languageAuth from "../middleware/auth/languageAuth";
import { viewAllRoles } from "../controllers/adminController";

const router = express.Router();

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser);

router.get('/view-all-doctors',allDoctors);
router.post('/apply-appointment',jwtAuth,languageAuth,reqAppointmentByUser);
router.post('/emergency',jwtAuth,emergencyValidator,languageAuth,emergency);
router.get('/all-roles',viewAllRoles);

const use = (fn:any) => (req:Request, res:Response, next:any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

// ? <<<<<<<<<<<<<<<<<<<<<<<<<< ALL ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ? // 
router.use('/patient',use(jwtAuth(['Patient','Administrator'])),languageAuth,patientRoutes);
router.use('/doctor',use(jwtAuth(['Doctor','Administrator'])),languageAuth,doctorRoutes);
router.use('/admin',use(jwtAuth(['Administrator'])),languageAuth,adminRoutes);

export default router;