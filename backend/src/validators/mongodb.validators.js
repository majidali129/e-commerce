import { body, param } from 'express-validator';

/**
 *
 * @param {string} idName
 * @returns True | False
 *
 * @description  A common validator responsible to validate mongodb ids passed in URLs path variable
 */
export const mongoIdPathValidator = (idName) => {
  return [param(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`)];
};

/**
 *
 * @param {string} idName
 * @returns True | False
 *
 * @description  A common validator responsible to validate mongodb ids passed request body
 */
export const mongoIdRequestBodyValidator = (idName) => {
  return [body(idName).notEmpty().isMongoId().withMessage(`Invalid ${idName}`)];
};
