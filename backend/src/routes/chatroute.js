import { Router } from "express";
import { getStreamToken } from "../controllers/chatcontroller.js";
import { protectRoute } from "../middleware/middleware.js";
const router = Router();

router.get("/token", protectRoute, getStreamToken);



export default router;