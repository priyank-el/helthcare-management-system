import express,{ Express } from "express";
import { 
    emergencyValidator,
    feedbackValidator,
    registerPatientValidator, 
    requestAppointmentValidator, 
    updatePatientValidator
 } from "../../validators/userValidator";
import { 
    emergency, 
    feedbackBypatient, 
    medicalHistory, 
    patiants, 
    reqAppointmentByPatient, 
    updatePatientsDetails, 
    viewPatient,
    updateFeedback,
    priscription
} from "../../controllers/userController";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
      cb(null, new Date().getTime() + '_' + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })

//**  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PATIENTS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.post('/patient',registerPatientValidator,patiants)
router.put('/update-patient',upload.single('image'),updatePatientsDetails)

router.get('/view-patient',viewPatient)
router.get('/medical-history',medicalHistory);
router.get("/priscription",priscription)

router.post('/apply-appointment',requestAppointmentValidator,reqAppointmentByPatient)
router.post('/emergency',emergencyValidator,emergency)
router.post('/feedback',feedbackValidator,feedbackBypatient);
router.put("/update-feedback",updateFeedback)


export default router;