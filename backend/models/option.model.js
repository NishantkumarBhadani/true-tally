import mongoose from "mongoose";
const optionSchema=new mongoose.Schema(
    {
        text:{
            type:String,
            required:true,
        },
        poll:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Poll",
            required:true,
        },
        voteCount:{
            type:Number,
            default:0,
        },
        
    },
    {
            timestamps:true,
    }
)

export const Option=mongoose.model("Option",optionSchema);