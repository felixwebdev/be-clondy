import imageController from "../controller/imageController.js";
import multer from "multer";
import verifyRoles from "../middleware/verifyRoles.js";
import ROLE_LISTS from "../config/role_List.js";
import express from 'express';

const upload = multer({dest: "tmp/"});
const router = express.Router();

router.route("/uploadImage").post(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER),upload.single("image"),imageController.uploadImage);
router.route("/myImages").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER),imageController.getMyImages);
router.route("/friendsImages").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER),imageController.getFriendsImages);
// router.route("/allImages").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER),imageController.getAllImages);
router.route("/").get(imageController.index);

export default router;
