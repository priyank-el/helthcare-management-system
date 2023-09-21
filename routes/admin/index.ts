import express,{} from "express";
import { addMedications, allMedications, allPriscription, makeRoles, viewAllRoles,allUsers,blockPatient,updateRole } from "../../controllers/adminController";
import { addMedicationValidator, makeRoleValidator,updateRoleValidator } from "../../validators/userValidator";

const router = express.Router()

router.post('/role',makeRoleValidator,makeRoles);
router.post("/update-role",updateRoleValidator,updateRole)
router.get('/all-roles',viewAllRoles)
router.get('/get-priscription',allPriscription);
router.get('/medications',allMedications);
router.post('/add-medication',addMedicationValidator,addMedications)
router.get("/all-users",allUsers)
router.post("/block-user",blockPatient)

export default router;