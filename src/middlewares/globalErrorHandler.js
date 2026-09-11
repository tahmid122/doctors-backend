// middleware/globalErrorHandler.ts
import AppError from "../utils/AppError";
import { Prisma } from "../../prisma/generated/prisma/client";
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong";
    // Prisma: Record not found
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                statusCode = 409;
                message = "Duplicate value found.";
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found.";
                break;
            case "P2003":
                statusCode = 400;
                message = "Invalid relation.";
                break;
            default:
                statusCode = 400;
                message = err.message;
        }
    }
    // Custom App Error
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: process.env.NODE_ENV === "development" ? err : undefined,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
export default globalErrorHandler;
