import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { adminAuth } from "../middlewares/adminAuth.middleware.js";


const router=Router();
//create option
import { createOption } from "../controllers/option.controllers.js";
router.route("/createOption").post(adminAuth,createOption);

//get all option of a poll
import { getAllOptionsOfPollId } from "../controllers/option.controllers.js";
router.route("/poll/:pollId").get(getAllOptionsOfPollId);

//delete option
import { deleteOption } from "../controllers/option.controllers.js";
router.route("/:optionId").delete(adminAuth,deleteOption);

export default router;