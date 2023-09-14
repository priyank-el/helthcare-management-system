import express,{} from "express";
import { addMedications, allMedications, allPriscription, makeRoles, viewAllRoles } from "../../controllers/adminController";
import { addMedicationValidator, makeRoleValidator } from "../../validators/userValidator";

const router = express.Router()

router.post('/role',makeRoleValidator,makeRoles);
router.get('/all-roles',viewAllRoles)
router.get('/get-priscription',allPriscription);
router.get('/medications',allMedications);
router.post('/add-medication',addMedicationValidator,addMedications)

export default router;