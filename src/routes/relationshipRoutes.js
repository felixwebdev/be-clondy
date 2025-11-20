import express from 'express';
import relationshipController from '../controller/relationshipController.js';
import chatRoomController from '../controller/chatRoomController.js';
import verifyRoles from '../middleware/verifyRoles.js';
import ROLE_LISTS from '../config/role_List.js';

const router = express.Router();

router.route("/friend").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.getFriends);
router.route("/friend/pending").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.getPendingFriends);
router.route("/pending").post(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.addFriend);
router.route("/accept").put(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.acceptRequest);
router.route("/cancel").put(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.cancelRequest);
router.route("/chat-room").get(verifyRoles(ROLE_LISTS.USER), chatRoomController.getAllChatRoom);
router.route("/search").get(verifyRoles(ROLE_LISTS.ADMIN, ROLE_LISTS.USER), relationshipController.findFriend);
router.route("/").get(relationshipController.index);

export default router;