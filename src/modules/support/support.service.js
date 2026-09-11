import { SupportStatus, UserRole, } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
//create support
const createSupport = async (data, user) => {
    const createdSupport = await prisma.support.create({
        data: { problem: data.problem, userId: user.id },
    });
    return createdSupport;
};
//get all support tickets
const getAllSupportTickets = async (user, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const status = query.status || undefined;
    if (user.role === UserRole.USER) {
        const result = await prisma.support.findMany({
            where: { userId: user.id },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        const total = await prisma.support.count({ where: { userId: user.id } });
        return {
            meta: { page, limit, total: total, totalPage: Math.ceil(total / limit) },
            data: result,
        };
    }
    const result = await prisma.support.findMany({
        where: { status: status },
        include: { user: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
    const total = await prisma.support.count();
    return {
        meta: { page, limit, total: total, totalPage: Math.ceil(total / limit) },
        data: result,
    };
};
//update support ticket
const updateSupportTicket = async (payload, id) => {
    const { status, adminReply } = payload;
    if (status && !Object.keys(SupportStatus).includes(status)) {
        throw new AppError(`Status must be ${Object.keys(SupportStatus).join(" | ")}`);
    }
    const updateData = {};
    if (status !== undefined)
        updateData.status = status;
    if (adminReply !== undefined)
        updateData.adminReply = adminReply;
    const updatedSupportTicket = await prisma.support.update({
        where: { id: id },
        data: updateData,
    });
    return updatedSupportTicket;
};
export const supportService = {
    createSupport,
    getAllSupportTickets,
    updateSupportTicket,
};
