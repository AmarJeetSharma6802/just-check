import express from "express";
import { authUser } from "../middleware/authUser.ts";
import { auth,fetchUser } from "../controllers/auth.controller.ts";
import { rateLimit } from "../utils/rateLimit.ts";

const router = express.Router()

router.route("/auth").post(auth)
router.route("/allUser").get(rateLimit, fetchUser)

export default router