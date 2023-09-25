import express,{ Request, Response } from "express";
import { 
    emergencyValidator,
    loginUserValidator,
    makeRoleValidator,
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
// import adminRoutes from './administrator/index';
import doctorRoutes from '../routes/doctors/index';
import adminRoute from '../routes/admin/index'
import jwtAuth from "../middleware/jwtAuth";
import languageAuth from "../middleware/languageAuth";

const router = express.Router();

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser);

router.get('/view-all-doctors',allDoctors);
router.post('/apply-appointment',jwtAuth,languageAuth,reqAppointmentByUser);
router.post('/emergency',jwtAuth,emergencyValidator,languageAuth,emergency);

const use = (fn:any) => (req:Request, res:Response, next:any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

// ? <<<<<<<<<<<<<<<<<<<<<<<<<< ALL ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ? // 
router.use('/patient',use(jwtAuth(['1'])),languageAuth,patientRoutes);
router.use('/doctor',use(jwtAuth(['2'])),languageAuth,doctorRoutes);
router.use('/admin-auth',languageAuth,adminRoute)

export default router;