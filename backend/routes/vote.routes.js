import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router=Router();

import { voteOption } from "../controllers/vote.controllers.js";
router.route("/vote").post(verifyJWT,voteOption)

export default router;