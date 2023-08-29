import express from "express";

import {registerUser,verifyotp,loginUser,patiants,updatePatientsDetails,deletePatientsDetails,viewPatient} from '../../controllers/userController'

import {registerUserValidator,loginUserValidator,registerPatientValidator,updatePatientValidator} from '../../validators/userValidator'

const jwtAuth = require('../../middleware/jwtAuth')
const router = express.Router()

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser)

router.post('/patient',jwtAuth,registerPatientValidator,patiants)
router.put('/update-patient',jwtAuth,updatePatientValidator,updatePatientsDetails)
router.delete('/delete-patient/:id',jwtAuth,deletePatientsDetails)
router.get('/view-patient',jwtAuth,viewPatient)

export default router;