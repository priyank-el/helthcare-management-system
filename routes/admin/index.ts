import express,{} from "express";
import { addMedications, allPriscription, makeRoles, viewAllRoles } from "../../controllers/adminController";
import { addMedicationValidator, makeRoleValidator } from "../../validators/userValidator";

const router = express.Router()

router.post('/role',makeRoles);
router.get('/all-roles',makeRoleValidator,viewAllRoles)
router.get('/get-priscription',allPriscription);
router.post('/add-medication',addMedicationValidator,addMedications)

export default router;