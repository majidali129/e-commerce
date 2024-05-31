export class apiError extends Error {
    constructor(statusCode, message, stack){
        super();
        this.statusCode = statusCode;
        this.success = false;
        this.message = message
        this.data = {};

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}