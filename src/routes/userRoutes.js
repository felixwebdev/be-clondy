import express from 'express';
import verifyRoles from '../middleware/verifyRoles.js';
import ROLE_LISTS from '../config/role_List.js';
import userController from '../controller/userController.js';
import multer from 'multer';
const router = express.Router();

const upload = multer({dest: "tmp/"});

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/forgotPassword").post(userController.forgotPassword);
router.route("/verifyChangePassword").post(userController.verifyCodeForgotPassword);
router.route("/verify").put(userController.verifyUser);
router.route("/changePassword").put(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER),userController.changePassword);
router.route("/myInfo").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), userController.getMyInfo);
router.route("/updateAvatar").put(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), upload.single("image"),userController.updateAvatar);

router.route("/").get(userController.index);
export default router;