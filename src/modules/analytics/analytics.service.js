import { prisma } from "../../lib/prisma";
const getAnalytics = async () => {
    const totalUsers = await prisma.user.count();
    const totalServiceRequests = await prisma.serviceRequest.count();
    const totalPackages = await prisma.package.count();
    const totalBlogs = await prisma.blog.count();
    const totalPromotions = await prisma.promotion.count();
    const totalUnResolvedSupportTickets = await prisma.support.count({
        where: { OR: [{ status: "PENDING" }, { status: "IN_PROGRESS" }] },
    });
    const newUsers = await prisma.user.findMany({
        skip: 0,
        take: 5,
        orderBy: { createdAt: "desc" },
    });
    return {
        totalUsers,
        totalServiceRequests,
        totalPackages,
        totalBlogs,
        totalPromotions,
        totalUnResolvedSupportTickets,
        newUsers,
    };
};
export const analyticsService = { getAnalytics };
