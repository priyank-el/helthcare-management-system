import express from "express";

import {registerUser,verifyotp,loginUser,patiants,updatePatientsDetails,deletePatientsDetails,viewPatient,allDoctors,doctorDetails,reqAppointmentByPatient} from '../../controllers/userController'

import {registerUserValidator,loginUserValidator,registerPatientValidator,updatePatientValidator,registerDoctorValidator} from '../../validators/userValidator'

const jwtAuth = require('../../middleware/jwtAuth')
const router = express.Router()

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser)

router.post('/patient',jwtAuth,registerPatientValidator,patiants)
router.post('/doctor',jwtAuth,registerDoctorValidator,doctorDetails)
router.put('/update-patient',jwtAuth,updatePatientValidator,updatePatientsDetails)
router.delete('/delete-patient/:id',jwtAuth,deletePatientsDetails)
router.get('/view-patient',jwtAuth,viewPatient)
router.get('/view-all-doctors',jwtAuth,allDoctors)

router.post('/apply-appointment',jwtAuth,reqAppointmentByPatient)

export default router;