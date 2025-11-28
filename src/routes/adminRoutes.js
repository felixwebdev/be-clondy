import express from 'express';
import verifyRoles from '../middleware/verifyRoles.js';
import ROLE_LISTS from '../config/role_List.js';
import adminController from '../controller/adminController.js';

const router = express.Router();

// Public route - register first admin (protected by secret key)
router.route("/register").post(adminController.registerAdmin);

// Admin only routes
router.route("/reports").get(verifyRoles(ROLE_LISTS.ADMIN), adminController.getAllReports);
router.route("/reports/:id").delete(verifyRoles(ROLE_LISTS.ADMIN), adminController.deleteReport);

router.route("/").get(adminController.index);

export default router;
