import express from 'express';
import verificationController from "../controller/verificationController.js";
const router = express.Router();

router.route("/sendOTP").post(verificationController.sendOTP);

router.route("/").get(verificationController.index);
export default router;