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

    constructor(statusCode, message, errors=[], stack){
        super();
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.errors = errors;
        this.data = {};

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}