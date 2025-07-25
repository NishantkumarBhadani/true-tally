import { Option } from "../models/option.model.js";
import { Poll } from "../models/poll.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

//create options for a poll 
const createOption=asyncHandler(async(req,res)=>{
    const {text,pollId}=req.body;

    if(!text || !pollId){
        throw new ApiError(400,"Text and poll id are required");
    }

    const poll =await Poll.findById(pollId);

    if(!poll){
        throw new ApiError(404,"Poll not found");
    }
    const option=await Option.create({
        text,
        poll:pollId,
    })

    //adding option id to poll
    poll.options.push(option._id);
    await poll.save();

    return res
    .status(201)
    .json(new ApiResponse(201,option,"Option created successfully"));
});

//get all option of a poll
const getAllOptionsOfPollId=asyncHandler(async(req,res)=>{
    const {pollId}=req.params;

    const options=await Option.find({poll:pollId});
    return res
    .status(200)
    .json(new ApiResponse(200,options,"Option fetched Successfully"));
})

const deleteOption=asyncHandler(async(req,res)=>{
    const {optionId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(optionId)){
        throw new ApiError(400,"Invalid option id");
    }

    const option=await Option.findById(optionId);
    if(!option){
        throw new ApiError(404,"Option not found");
    }
    //get from which poll the option belongs to
    const pollId=option.poll;
    //removing option
    await option.deleteOne();

    //remove the option from poll
    await Poll.findByIdAndUpdate(pollId,{
        $pull:{options:optionId}
    })

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Option deleted successfully"));

})


export {createOption,getAllOptionsOfPollId,deleteOption};