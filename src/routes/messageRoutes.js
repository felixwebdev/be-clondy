import express from 'express';
import messageController from "../controller/messageController.js";
import verifyRoles from "../middleware/verifyRoles.js";
import ROLE_LISTS from "../config/role_List.js";
const router = express.Router();

router.route("/newMessage").post(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), messageController.sendMessage);
router.route("/chatRooms").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), messageController.getAllChatRooms);
router.route("/messages/:chatRoomId").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), messageController.getMessagesByChatRoomId);
router.route("/").get(messageController.index);

export default router;