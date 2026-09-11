import { Router } from "express";
import { userController } from "./user.controller";
import asyncHandler from "../../utils/asyncHandler";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../prisma/generated/prisma/enums";
const router = Router();
//get all users
router.get("/", auth(UserRole.ADMIN), asyncHandler(userController.getAllUsers));
//update status
router.patch("/:id", auth(UserRole.ADMIN), asyncHandler(userController.updateUserStatus));
export const userRoutes = router;
