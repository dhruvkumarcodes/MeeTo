import { Router } from "express";
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/middleware.js";


const router = Router();

router.use(protectRoute)

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests)
router.get("outgoing-friend-requests", getOutgoingFriendReqs)
export default router;