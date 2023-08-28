import express from "express";

import {registerUser} from '../../controllers/userController'

import {registerUserValidator} from '../../validators/userValidator'

const router = express.Router()

router.post('/register',registerUserValidator,registerUser);

export default router;