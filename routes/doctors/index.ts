import express,{} from "express";
import { 
    appointmentByDoctor, 
    deleteAppointmentByDoctor, 
    doctorDetails, 
    prescriptionByDoctor, 
    updateAppointmentByDoctor, 
    viewAllPateints, 
    viewAppointmentByDoctor 
} from "../../controllers/userController";
import { 
    deleteAppointmentValidator, 
    priscriptionValidator,  
    registerDoctorValidator, 
    seduleAppointmentValidator, 
    updateAppointmentValidator 
} from "../../validators/userValidator";

const router = express.Router()

// ** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DOCTORS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.get('/all-patients',viewAllPateints)
router.post('/doctor',registerDoctorValidator,doctorDetails)
router.get('/appointment-data',viewAppointmentByDoctor)
router.put('/appointment',seduleAppointmentValidator,appointmentByDoctor)
router.put('/update-appointment',updateAppointmentValidator,updateAppointmentByDoctor)
router.put('/delete-appointment',deleteAppointmentValidator,deleteAppointmentByDoctor)

router.post('/priscription',priscriptionValidator,prescriptionByDoctor)

export default router;