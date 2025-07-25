import { Poll } from "../models/poll.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Option } from "../models/option.model.js";

const createPoll = asyncHandler(async (req, res) => {
  const { title, description, endsAt } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const poll = await Poll.create({
    title,
    description,
    createdBy: req.user._id,
    endsAt,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, poll, "Poll created successfully"));
});

//get all polls
const getAllPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find({ isActive: true })
    .populate("createdBy", "fullname email")
    .populate("options");

  return res.status(200).json(new ApiResponse(200, polls));
});

//get poll by id
const getPollById = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id)
    .populate("createdBy", "fullname email")
    .populate("options");

  if (!poll) {
    throw new ApiError(404, "Poll not found");
  }
  return res.status(200).json(new ApiResponse(200, poll));
});

//deactivate poll
const deactivatePoll=asyncHandler(async(req,res)=>{
    const poll=await Poll.findByIdAndUpdate(
        req.params.id,
        {isActive:false},
        {new:true}
    );
    if(!poll) throw new ApiError(404,"Poll not found");

    return res
        .status(200)
        .json(new ApiResponse(200,poll,"Poll deactivated Successfully"));
})

export { createPoll, getAllPolls, getPollById,deactivatePoll };
