import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const generateTokens = async (user) => {
  try {
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, role } = req.body;

  //If any field is missing
  if ([fullname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please fill all the fields");
  }
  //Check if user already exists
  const exitUser = await User.findOne({
    $or: [{ fullname }, { email }],
  });

  if (exitUser) {
    throw new ApiError(409, "User already exists with this email or fullname");
  }

  //Create new user
  const user = await User.create({
    fullname,
    email,
    password,
    role,
  });

  //remove password and refreshToken from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  //sending the response

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

//login
const logInUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email || password)) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    $or: [{ email }, { password }],
  });
  if (!user) {
    throw new ApiError("No User found with this emmal", 404);
  }

  const passWordCorrect = await user.isPassWordCorrect(password);
  if (!passWordCorrect) {
    throw new ApiError("Password is incorrect", 401);
  }
  const { accessToken, refreshToken } = await generateTokens(user);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Login Successfull"
      )
    );
});

//logOut
const logOut = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

//refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.user?.refreshToken;

  try {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    console.log("Decode token:",decodeToken);

    const user = await User.findById(decodeToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken } = await generateTokens(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    let errorMessage = "Invalid refresh token";
    if (error instanceof jwt.TokenExpiredError) {
      errorMessage = "Refresh token expired";
    } else if (error instanceof jwt.JsonWebTokenError) {
      errorMessage = "Invalid refresh token";
    }

    throw new ApiError(401, errorMessage);
  }
});

const authenticateAdmin = asyncHandler((req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Access denied: Not an admin");
  }
  return res.status(200).json(
    new ApiResponse(200, { role: req.user.role }, "Admin authenticated")
  );
});



export { registerUser, logInUser, logOut, refreshAccessToken,authenticateAdmin };
