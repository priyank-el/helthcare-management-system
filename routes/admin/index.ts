import express from "express"
import { addAdmin, addMedications, allMedications, allPriscription, allUsers, blockPatient, login, updateMedications } from "../../controllers/adminController"

import { addMedicationValidator } from "../../validators/userValidator"

const router = express.Router()

router.post('/register', addAdmin)
router.post('/login', login)

router.get('/get-priscription', allPriscription)
router.get('/medications', allMedications)
router.get("/all-users", allUsers)

router.post('/add-medication', addMedicationValidator, addMedications)
router.post('/update-medication', updateMedications)

router.post("/block-user", blockPatient)

export default router