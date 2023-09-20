import express,{ Express } from "express";
import { 
    emergencyValidator,
    feedbackValidator,
    registerPatientValidator, 
    requestAppointmentValidator, 
    updatePatientValidator
 } from "../../validators/userValidator";
import {  
    deletePatientsDetails, 
    emergency, 
    feedbackBypatient, 
    medicalHistory, 
    patiants, 
    reqAppointmentByPatient, 
    updatePatientsDetails, 
    viewPatient,
    updateFeedback
} from "../../controllers/userController";

const router = express.Router();

//**  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PATIENTS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.post('/patient',registerPatientValidator,patiants)
router.put('/update-patient',updatePatientValidator,updatePatientsDetails)
router.delete('/delete-patient/:id',deletePatientsDetails)
router.get('/view-patient',viewPatient)
router.post('/medical-history',medicalHistory);

router.post('/apply-appointment',requestAppointmentValidator,reqAppointmentByPatient)
router.post('/feedback',feedbackValidator,feedbackBypatient);
router.put("/update-feedback",updateFeedback)
router.post('/emergency',emergencyValidator,emergency)

export default router;