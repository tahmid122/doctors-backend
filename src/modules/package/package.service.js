import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
const createPackage = async (data) => {
    const createdPackage = await prisma.package.create({ data });
    return createdPackage;
};
const updatePackage = async (payload, id) => {
    const { title, description, features, startPrice } = payload;
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (features !== undefined)
        updateData.features = features;
    if (startPrice && typeof startPrice !== "number") {
        throw new AppError("Start price must be number type.");
    }
    if (startPrice !== undefined)
        updateData.startPrice = startPrice;
    const updatedData = await prisma.package.update({
        where: { id },
        data: updateData,
    });
    return updatedData;
};
const getAllPackages = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const packages = await prisma.package.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
    const total = await prisma.package.count();
    return {
        meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
        data: packages,
    };
};
const getSinglePackage = async (id) => {
    const singlePackage = await prisma.package.findUnique({ where: { id } });
    return singlePackage;
};
const deleteSinglePackage = async (id) => {
    const deletedPackage = await prisma.package.delete({ where: { id } });
    return deletedPackage;
};
export const packageService = {
    createPackage,
    updatePackage,
    getAllPackages,
    getSinglePackage,
    deleteSinglePackage,
};
