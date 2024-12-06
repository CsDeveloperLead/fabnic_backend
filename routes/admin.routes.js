import { Router } from "express";
import { addAdmin, allUsers, changeRolesToCustomer, changeRolesToStaff, login } from "../controllers/admin.controller.js";

const router = Router()

router.route("/add-admin").post(addAdmin)
router.route("/admin-login").post(login)

router.route("/all-users").post(allUsers)

router.route("/change-role-staff").post(changeRolesToStaff)
router.route("/change-role-customer").post(changeRolesToCustomer)


export default router