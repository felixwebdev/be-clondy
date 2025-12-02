import express from 'express';
import verifyRoles from '../middleware/verifyRoles.js';
import ROLE_LISTS from '../config/role_List.js';
import userController from '../controller/userController.js';
import multer from 'multer';
const router = express.Router();

const upload = multer({dest: "tmp/"});
// User routes
router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/forgotPassword").post(userController.forgotPassword);
router.route("/verifyChangePassword").post(userController.verifyCodeForgotPassword);
router.route("/verify").put(userController.verifyUser);
router.route("/changePassword").put(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER),userController.changePassword);
router.route("/myInfo").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), userController.getMyInfo);
router.route("/updateAvatar").put(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), upload.single("image"),userController.updateAvatar);
router.route("/sendReport").post(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), userController.sendReport);
router.route("/sendFeedback").post(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), userController.sendFeedback);

// Admin routes
router.route("/adminRegister").post(userController.adminRegister);
router.route("/adminLogin").post(userController.adminLogin);
router.route("/getAllReports").get(verifyRoles(ROLE_LISTS.ADMIN), userController.getAllReports);
router.route("/deleteReport").delete(verifyRoles(ROLE_LISTS.ADMIN), userController.deleteReport);
router.route("/setAreaAdmin").post(verifyRoles(ROLE_LISTS.ADMIN), userController.setAreaAdmin);
router.route("/getAdmin").get(verifyRoles(ROLE_LISTS.ADMIN), userController.getMyInfo);
router.route("/getArea").get(verifyRoles(ROLE_LISTS.ADMIN), userController.getArea);
router.route("/getUsersByLocation").get(verifyRoles(ROLE_LISTS.ADMIN), userController.getUsersByLocation);
router.route("/disableUser").post(verifyRoles(ROLE_LISTS.ADMIN), userController.lockUser);

router.route("/").get(userController.index);
export default router; 