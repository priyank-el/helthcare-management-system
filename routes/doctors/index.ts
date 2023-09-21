import express,{} from "express";
import { 
    appointmentByDoctor, 
    deleteAppointmentByDoctor, 
    doctorDetails, 
    prescriptionByDoctor, 
    updateAppointmentByDoctor, 
    viewAllPateints, 
    viewAppointmentByDoctor,
    updateDoctorProfile
} from "../../controllers/userController";
import { 
    deleteAppointmentValidator,
    registerDoctorValidator, 
    seduleAppointmentValidator, 
    updateAppointmentValidator 
} from "../../validators/userValidator";
import multer from 'multer'
import { allMedications } from "../../controllers/adminController";

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() + '_' + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })

// ** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DOCTORS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.get('/all-patients',viewAllPateints)
router.get('/medications',allMedications)
router.get('/appointment-data',viewAppointmentByDoctor)

router.post('/doctor',upload.single('image'),registerDoctorValidator,doctorDetails)
router.put('/update-profile',upload.single('image'),updateDoctorProfile)

router.put('/appointment',seduleAppointmentValidator,appointmentByDoctor)
router.put('/update-appointment',updateAppointmentValidator,updateAppointmentByDoctor)
router.put('/delete-appointment',deleteAppointmentValidator,deleteAppointmentByDoctor)

router.post('/priscription',prescriptionByDoctor)

export default router;