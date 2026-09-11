class AppError extends Error {
    statusCode;
    success;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;
