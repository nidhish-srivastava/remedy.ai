import User from "../models/auth.model.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const register = asyncHandler(async (req, res) => {
    const { email, password, name, photo, gender, occupation, economicStatus, phoneNumber,age } = req.body
    const existedUser = await User.findOne({ email })
    console.log(existedUser);
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    const user = new User({
        name,
        email,
        password,
        photo,
        gender,
        occupation,
        economicStatus,
        phoneNumber,
        age
    })
    const createdUser = await user.save()
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
}
)

const generateToken = user=> {
	return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: "10d",
	});
};

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email) throw new ApiError(400, "email is required")
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400,"Invalid credentials")
    }
    const accessToken = generateToken(user);
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None' // Required for cross-site cookies
    };
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user, accessToken
            },
            "User logged In Successfully"
        )   
    )
})

const logout = asyncHandler(async(req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None' // Required for cross-site cookies
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

export { register, login,logout,getCurrentUser }