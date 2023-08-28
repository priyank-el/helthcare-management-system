import express from "express";

import {registerUser,verifyotp,loginUser} from '../../controllers/userController'

import {registerUserValidator,loginUserValidator} from '../../validators/userValidator'

const router = express.Router()

router.post('/register',registerUserValidator,registerUser);
router.post('/verify',verifyotp);
router.post('/login',loginUserValidator,loginUser)

export default router;