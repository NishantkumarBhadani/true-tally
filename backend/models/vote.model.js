import mongoose from "mongoose";
import { Poll } from "./poll.models.js";

const voteSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        poll:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Poll",
            required:true
        },
        option:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Option",
            required:true,
        }
    },
    {
        timestamps:true,
    }
)
 //Prevanting user from voting only once
    voteSchema.index({
        user:1,
        poll:1
    },{unique:true})

export const Vote=mongoose.model("Vote",voteSchema);