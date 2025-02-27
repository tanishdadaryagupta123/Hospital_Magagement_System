import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutPatient,
  patientRegister,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";
import { validateApiKey } from "../middlewares/apiKeyValidation.js";

const router = express.Router();

router.route("/patient/register").post(patientRegister);
router.route("/login").post(login);

router.route("/admin/addnew").post(addNewAdmin);
router.route("/doctor/addnew").post(validateApiKey, addNewDoctor);
router.route("/doctor/getall").get(getAllDoctors);

router.route("/admin/me").get(isAdminAuthenticated, getUserDetails);
router.route("/admin/logout").get(logoutAdmin);
router.route("/patient/logout").get(logoutPatient);

export default router;