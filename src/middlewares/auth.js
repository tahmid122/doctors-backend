import { UserRole } from "../../prisma/generated/prisma/enums";
import jwt from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
const auth = (...roles) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access.",
            });
        }
        let decoded;
        try {
            decoded = jwt.verify(token, config.JWT_SECRET);
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }
        if (typeof decoded.id !== "string" ||
            typeof decoded.email !== "string" ||
            !Object.values(UserRole).includes(decoded.role)) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload.",
            });
        }
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }
        if (user.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Forbidden.",
            });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden access.",
            });
        }
        next();
    };
};
export default auth;
