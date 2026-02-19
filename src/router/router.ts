import express from "express";
import { authUser } from "../middleware/authUser.ts";
import { auth,fetchUser,updateAccount,changePassword,deleteAccount } from "../controllers/auth.controller.ts";
import { rateLimit } from "../utils/rateLimit.ts";
import{postCreate} from "../controllers/post.controller.ts"

const router = express.Router()

router.route("/auth").post(auth)
router.route("/allUser").get(rateLimit, fetchUser)
router.route("/update-account").put(authUser, updateAccount)
router.route("/change-pass").post(authUser,changePassword)
router.route("/deleteAccount").delete(authUser,deleteAccount)

router.route("/post-create").post(authUser,postCreate)



export default router