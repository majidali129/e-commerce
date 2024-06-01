import mongoose from 'mongoose';
import { apiError } from '../utils/apiError.js';
import { logger } from '../logger/winstron.logger.js';

/**
 *
 * @param {Error | apiError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // check if error is instance of apiError class which extends native Error class
  if (!(error instanceof apiError)) {
    // if no
    // create new apiError instance for consistency

    // assign appropriate status code
    const statusCode = error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    // set error message for native error instance or custom one
    const message = error.message || 'something went wrong';
    error = new apiError(statusCode, message, err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  logger.error(`${error.message}`);

  return res.status(error.statusCode).json(response);
};
