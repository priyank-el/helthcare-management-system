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
    registerUser, 
    reqAppointmentByUser,
    verifyotp
} from "../controllers/userController";

import patientAuth from "../middleware/auth/patientsAuth";
import patientRoutes from '../routes/patients/index';
import adminRoutes from '../routes/admin/index';
import doctorRoutes from '../routes/doctors/index'
import jwtAuth from "../middleware/jwtAuth";
import adminAuth from "../middleware/auth/adminAuth";
import doctorAuth from "../middleware/auth/doctorAuth";
import languageAuth from "../middleware/auth/languageAuth";

const router = express.Router();

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser);

router.get('/view-all-doctors',jwtAuth,languageAuth,allDoctors);
router.post('/apply-appointment',jwtAuth,languageAuth,reqAppointmentByUser);
router.post('/emergency',jwtAuth,emergencyValidator,languageAuth,emergency);

// ? <<<<<<<<<<<<<<<<<<<<<<<<<< ALL ROUTES >>>>>>>>>>>>>>>>>>>>>>>>>>>>> ? // 
router.use('/patient',jwtAuth,languageAuth,patientAuth,patientRoutes);
router.use('/doctor',jwtAuth,languageAuth,doctorAuth,doctorRoutes);
router.use('/admin',jwtAuth,languageAuth,adminAuth,adminRoutes);

export default router;