import { ServiceRequestStatus, UserRole, } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
const createRequest = async (data, user) => {
    const result = await prisma.serviceRequest.create({
        data: { ...data, userId: user.id },
    });
    return result;
};
const getAllRequests = async (query, user) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    let result;
    let total;
    if (user.role === UserRole.USER) {
        result = await prisma.serviceRequest.findMany({
            where: { userId: user.id },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        total = await prisma.serviceRequest.count({ where: { userId: user.id } });
    }
    else {
        result = await prisma.serviceRequest.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: { user: true, package: true },
        });
        total = await prisma.serviceRequest.count();
    }
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: result,
    };
};
const deleteRequest = async (id, user) => {
    const request = await prisma.serviceRequest.findUnique({ where: { id } });
    if (!request) {
        throw new AppError("Record not found");
    }
    if (request && user.role === UserRole.USER && request.userId !== user.id) {
        throw new AppError("Only admin can delete other users request");
    }
    const deletedRequest = await prisma.serviceRequest.delete({ where: { id } });
    return deletedRequest;
};
const updateStatus = async (id, status) => {
    const request = await prisma.serviceRequest.findUnique({ where: { id } });
    if (!request) {
        throw new AppError("Record not found");
    }
    console.log(status);
    if (status && !Object.keys(ServiceRequestStatus).includes(status)) {
        throw new AppError(`Status must be ${Object.keys(ServiceRequestStatus).join(" | ")}`);
    }
    const updatedRequest = await prisma.serviceRequest.update({
        where: { id },
        data: { status },
    });
    return updatedRequest;
};
export const serviceRequestService = {
    createRequest,
    getAllRequests,
    deleteRequest,
    updateStatus,
};
