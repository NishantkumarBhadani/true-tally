import mongoose from "mongoose"

const pollSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        options:[
            {
                type:mongoose.Schema.ObjectId,
                ref:"Option",
            }
        ],
        isActive:{
            type:Boolean,
            default:true,
        },
        endsAt:Date,
    },
    {
        timestamps:true,
    }
 )
 export const Poll=mongoose.model("Poll",pollSchema);