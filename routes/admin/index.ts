import express,{} from "express";
import { addMedications, allMedications, allPriscription, makeRoles, viewAllRoles,allUsers,blockPatient,updateRole } from "../../controllers/adminController";
import { addMedicationValidator, makeRoleValidator,updateRoleValidator } from "../../validators/userValidator";

const router = express.Router()

router.get('/get-priscription',allPriscription);
router.get('/medications',allMedications);
router.get("/all-users",allUsers);
router.get('/all-roles',viewAllRoles);

router.post('/role',makeRoleValidator,makeRoles);
router.post("/update-role",updateRoleValidator,updateRole);

router.post('/add-medication',addMedicationValidator,addMedications);

router.post("/block-user",blockPatient);

export default router;