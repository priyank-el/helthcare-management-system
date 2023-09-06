import express,{} from "express";
import { makeRoles, viewAllRoles } from "../../controllers/adminController";
import { makeRoleValidator } from "../../validators/userValidator";

const router = express.Router()

router.post('/role',makeRoles);
router.get('/all-roles',makeRoleValidator,viewAllRoles)

export default router;