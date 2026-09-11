import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
import asyncHandler from "../../utils/asyncHandler";
import { analyticsController } from "./analytics.controller";
const router = Router();
//get analytics
router.get("/", auth(UserRole.ADMIN), asyncHandler(analyticsController.getAnalytics));
export const analyticsRoutes = router;
