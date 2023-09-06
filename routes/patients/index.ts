import express,{ Express } from "express";
import { 
    feedbackValidator,
    registerPatientValidator, 
    requestAppointmentValidator, 
    updatePatientValidator
 } from "../../validators/userValidator";
import {  
    deletePatientsDetails, 
    feedbackBypatient, 
    patiants, 
    reqAppointmentByPatient, 
    updatePatientsDetails, 
    viewPatient 
} from "../../controllers/userController";

const router = express.Router();

//**  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PATIENTS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.post('/patient',registerPatientValidator,patiants)
router.put('/update-patient',updatePatientValidator,updatePatientsDetails)
router.delete('/delete-patient/:id',deletePatientsDetails)
router.get('/view-patient',viewPatient)

router.post('/apply-appoint',requestAppointmentValidator,reqAppointmentByPatient)
router.post('/feedback',feedbackValidator,feedbackBypatient)

export default router;