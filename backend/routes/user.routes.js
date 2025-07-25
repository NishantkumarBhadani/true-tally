import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { adminAuth } from "../middlewares/adminAuth.middleware.js";

const router=Router();
import { registerUser } from "../controllers/user.controller.js";
router.route("/register").post(registerUser);

import { logInUser } from "../controllers/user.controller.js";
router.route("/login").post(logInUser);

import { logOut } from "../controllers/user.controller.js";
router.route("/logout").post(verifyJWT,logOut)

import { refreshAccessToken } from "../controllers/user.controller.js";
router.route("/refreshAccessToken").post(refreshAccessToken);

import { authenticateAdmin } from "../controllers/user.controller.js";
router.route("/auth").post(adminAuth,authenticateAdmin);



export default router;