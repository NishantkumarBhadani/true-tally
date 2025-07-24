import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models";

const adminAuth=asyncHandler(async(req,resizeBy,next)=>{
    try {
        const token=req.cookies?.accessToken ||
                    req.header("Authorization")?.replace("Bearer ", "");
        
        if(!token){
            throw new ApiError(401,"Acces token missing or invalid");
        }


        const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user=await User.findById(decodeToken?._id).select(
            "-password -refreshToken"
        );

        if(!user){
            throw new ApiError(401,"User not found");
        }
        //Check for admin
        if(user.role!=="admin"){
            throw new ApiError(403,"Forbidden:Admin access required");
        }
        req.user=user;
        next();
    } catch (error) {
        throw new ApiError(401,"Unauthorized Access Token",[error?.message],error?.stack);
    }
})

export {adminAuth};