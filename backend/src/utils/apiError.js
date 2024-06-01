/***
 * @description common error class that'll throw error form anywhere
 */

export class apiError extends Error {
  /**
   *
   * @param {number} statusCode
   * @param {string} message
   * @param {string} stack
   */

  constructor(statusCode, message = 'something went wrong', errors = [], stack) {
    console.log(statusCode);
    console.log(message);
    console.log(errors);

    super();
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = {};

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
