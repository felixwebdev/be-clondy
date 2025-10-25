import express from 'express';
import relationshipController from '../controller/relationshipController.js';
import verifyRoles from '../middleware/verifyRoles.js';
import ROLE_LISTS from '../config/role_List.js';

const router = express.Router();

router.route("/addFriend").post(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.addFriend);

router.route("/").get(relationshipController.index);

export default router;