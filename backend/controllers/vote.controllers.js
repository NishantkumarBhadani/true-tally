import {Vote} from "../models/vote.model.js"
import { Option } from "../models/option.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

const voteOption=asyncHandler (async(req,res)=>{
    console.log("Vote API Hit");
    const {pollId,optionId}=req.body;
    console.log({ pollId, optionId, user: req.user });

    if(!pollId || !optionId){
        throw new ApiError(400,"Poll and optionId is required");
    }

    //check if already voted
    const alreadyVoted=await Vote.findOne({
        user:req.user._id,poll:pollId
    })
    if(alreadyVoted){
        throw new ApiError(400,"You have already voted");
    }

    //create vote
    const vote=await Vote.create({
        user:req.user._id,
        poll:pollId,
        option:optionId
    })

    //Increment vote count
    const updatedOption=await Option.findByIdAndUpdate(
        optionId,
        { $inc:{voteCount:1}},
        {new:true}
    )

    //Emiting event through socket.io
    req.app.get("io").emit("voteUpdate",{
        pollId,
        optionId,
        newVoteCount:updatedOption.voteCount,
    })
    return res.status(201)
    .json(new ApiResponse(201,vote,"vote submitted"));
});

export {voteOption}