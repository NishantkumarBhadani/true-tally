import {Router} from "express"
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import {adminAuth} from "../middlewares/adminAuth.middleware.js"

const router=Router();

//create poll
import { createPoll } from "../controllers/poll.controller.js";
router.route("/createpoll").post(adminAuth,createPoll);

//getAllPoll
import { getAllPolls } from "../controllers/poll.controller.js";
router.route("/allPolls").get(verifyJWT,getAllPolls);

//getPollById
import { getPollById } from "../controllers/poll.controller.js";
router.route("/:id").get(verifyJWT,getPollById)
//deactivate poll
import { deactivatePoll } from "../controllers/poll.controller.js";
router.route("/deactivate/:id").patch(adminAuth,deactivatePoll);




export default router;