import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import {apiError} from '../utils/apiError.js'
import {apiResponse} from '../utils/apiResponse.js'
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js'


const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken;

    return {accessToken, refreshToken}
}

const registerUser = asyncHandler(async (req, res, next) => {
    const {userName, fullName, email, password, phone, role} = req.body;
    console.log(req.body)

    if([userName, fullName, email, password, phone, role].some(el => el === ''))
        return next(new apiError(400, 'all fields are required'))

    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath) return next(new apiError(400, 'avatar is required'));

    const existingUser = await User.findOne({
        $or: [{userName},{email}]
    })
    if(existingUser) return next(new apiError(400, 'user with credentials already exists'));

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if(!avatar) return next(new apiError(400, 'avatar is required'));

    const createdUser = await User.create({
        userName,
        fullName,
        email,
        password,
        phone,
        role,
        avatar: avatar?.url
    })

    createdUser.password=undefined

    if(!createdUser)
        return next(new apiError(500, 'something went wrong while creating new user. try later'));

    res.status(201).json(new apiResponse(201, createdUser, 'user registered successfully'))
})


const loginUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if(email === '' || password === '')
        return next(new apiError(400, 'email password are required'));

    const user = await User.findOne({email})
    if(!user) return next(new apiError(404, 'user not found for these credentials'));

    if(!user.isPasswordCorrect(password, user.password))
        return next(new apiError(400, 'invalid request or user may changed his password.'));

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    user.password = undefined;

    const options = {
        httpOnly: true,
        secure: true
    }
    res.status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new apiResponse(200, {user, accessToken, refreshToken}, 'user logged in successfully'))
})

export {registerUser, loginUser}