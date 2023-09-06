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
import multer from 'multer'

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
router.post('/doctor',upload.single('image'),registerDoctorValidator,doctorDetails)
router.get('/appointment-data',viewAppointmentByDoctor)
router.put('/appointment',seduleAppointmentValidator,appointmentByDoctor)
router.put('/update-appointment',updateAppointmentValidator,updateAppointmentByDoctor)
router.put('/delete-appointment',deleteAppointmentValidator,deleteAppointmentByDoctor)

router.post('/priscription',prescriptionByDoctor)

export default router;