import jwt from 'jsonwebtoken';

import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    let token;
    if (req.cookies?.accessToken || req.headers.authorization.startsWith('Bearer'))
      token = req.cookies.accessToken || req.headers.authorization.replace('Bearer ', '');

    if (!token) return next(new apiError(401, 'unauthorizedd access'));

    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const currentUser = await User.findById(decoded._id).select(
      '-password -refreshToken'
    );
    if (!currentUser)
      return next(new apiError(401, 'user belong to this token no longer exist'));

    req.user = currentUser;
    next();
  } catch (error) {
    console.log(error);
    return next(new apiError(401, 'invalid access token'));
  }
});
