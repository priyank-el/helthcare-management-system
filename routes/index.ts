import express,{} from "express";
import { 
    emergencyValidator,
    loginUserValidator,
    registerUserValidator
} from "../validators/userValidator";

import { 
    allDoctors,
    emergency,
    loginUser,
    medicalHistory,
    registerUser, 
    reqAppointmentByUser, 
    setLanguage, 
    verifyotp
} from "../controllers/userController";
import patientAuth from "../middleware/auth/patientsAuth";
import patientRoutes from '../routes/patients/index';
import adminRoutes from '../routes/admin/index';
import doctorRoutes from '../routes/doctors/index'
import jwtAuth from "../middleware/jwtAuth";
import adminAuth from "../middleware/auth/adminAuth";
import doctorAuth from "../middleware/auth/doctorAuth";

const router = express.Router()

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser)

router.get('/set-locale-language',jwtAuth,setLanguage)
router.get('/view-all-doctors',jwtAuth,allDoctors)
router.post('/apply-appointment',jwtAuth,reqAppointmentByUser)
router.post('/medical-history',jwtAuth,medicalHistory)
router.post('/emergency',jwtAuth,emergencyValidator,emergency)

// ? <<<<<<<<<<<<<<<<<<<<<<<<<< ALL ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.use('/patient',jwtAuth,patientAuth,patientRoutes);
router.use('/doctor',jwtAuth,doctorAuth,doctorRoutes);
router.use('/admin',jwtAuth,adminAuth,adminRoutes);

export default router;