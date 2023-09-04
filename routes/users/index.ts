import express from "express";

import {viewAllRoles,medicalHistory,registerUser,verifyotp,loginUser,reqAppointmentByPatient,patiants,updatePatientsDetails,deletePatientsDetails,viewPatient,allDoctors,doctorDetails,viewAllPateints,reqAppointmentByUser,appointmentByDoctor,viewAppointmentByDoctor,updateAppointmentByDoctor,deleteAppointmentByDoctor,prescriptionByDoctor,feedbackBypatient} from '../../controllers/userController'

import {registerUserValidator,loginUserValidator,registerPatientValidator,updatePatientValidator,registerDoctorValidator} from '../../validators/userValidator'

const jwtAuth = require('../../middleware/jwtAuth')
const patientAuth = require('../../middleware/auth/patientsAuth')
const doctorAuth = require('../../middleware/auth/doctorAuth')

const router = express.Router()
router.get('/all-roles' , viewAllRoles )
router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser)
router.post('/apply-appointment',jwtAuth,reqAppointmentByUser)

//**  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< PATIENTS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.post('/patient',jwtAuth,registerPatientValidator,patiants)
router.put('/update-patient',jwtAuth,patientAuth,updatePatientValidator,updatePatientsDetails)
router.delete('/delete-patient/:id',jwtAuth,deletePatientsDetails)
router.get('/view-patient',jwtAuth,patientAuth,viewPatient)
router.post('/apply-appoint',jwtAuth,patientAuth,reqAppointmentByPatient)

router.get('/view-all-doctors',jwtAuth,allDoctors)

// ** <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< DOCTORS APIs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  */

router.get('/all-patients',jwtAuth,viewAllPateints)
router.post('/doctor',jwtAuth,registerDoctorValidator,doctorDetails)
router.get('/appointment-data',jwtAuth,doctorAuth,viewAppointmentByDoctor)
router.put('/appointment',jwtAuth,doctorAuth,appointmentByDoctor)
router.put('/update-appointment',jwtAuth,doctorAuth,updateAppointmentByDoctor)
router.put('/delete-appointment',jwtAuth,doctorAuth,deleteAppointmentByDoctor)

router.post('/priscription',jwtAuth,doctorAuth,prescriptionByDoctor)

router.post('/medical-history',jwtAuth,medicalHistory)

router.post('/feedback',jwtAuth,patientAuth,feedbackBypatient)

export default router;