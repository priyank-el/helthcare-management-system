import express,{} from "express";
import { addAdmin, addMedications, allMedications, allUsers, blockPatient, login, makeRoles, updateRole, viewAllRoles } from "../../controllers/adminController";
import { allPriscription } from "../../controllers/userController";
import { addMedicationValidator, makeRoleValidator, updateRoleValidator } from "../../validators/userValidator";

const router = express.Router()

router.post('/register',addAdmin);
router.post('/login',login);

router.get('/get-priscription',allPriscription);
router.get('/medications',allMedications);
router.get("/all-users",allUsers);
router.get('/all-roles',viewAllRoles);

router.post('/role',makeRoleValidator,makeRoles);
router.post("/update-role",updateRoleValidator,updateRole);

router.post('/add-medication',addMedicationValidator,addMedications);

router.post("/block-user",blockPatient);

export default router;