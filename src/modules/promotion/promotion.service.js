import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
//create promotion
const createPromotion = async (data) => {
    const promotion = await prisma.promotion.create({ data });
    return promotion;
};
//update promotion
const updatePromotion = async (id, payload) => {
    const { name, availability, chamber, degree, description, designation, image, phone, serves, yearOfExperience, } = payload;
    const promotion = await prisma.promotion.findUnique({ where: { id } });
    if (!promotion)
        throw new AppError("Promotion data not found");
    const updateData = {};
    if (name !== undefined)
        updateData.name = name;
    if (availability !== undefined)
        updateData.availability = availability;
    if (chamber !== undefined)
        updateData.chamber = chamber;
    if (degree !== undefined)
        updateData.degree = degree;
    if (description !== undefined)
        updateData.description = description;
    if (designation !== undefined)
        updateData.designation = designation;
    if (phone !== undefined)
        updateData.phone = phone;
    if (image !== undefined)
        updateData.image = image;
    if (serves !== undefined)
        updateData.serves = serves;
    if (yearOfExperience !== undefined)
        updateData.yearOfExperience = yearOfExperience;
    const updatedPromotion = await prisma.promotion.update({
        where: { id },
        data: updateData,
    });
    return updatedPromotion;
};
//get all promotions
const getAllPromotions = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const category = query.category || undefined;
    const searchTerm = query.searchTerm || undefined;
    const promotions = await prisma.promotion.findMany({
        where: {
            designation: category ? { equals: category } : undefined,
            OR: searchTerm
                ? [
                    { name: { contains: searchTerm, mode: "insensitive" } },
                    { designation: { contains: searchTerm, mode: "insensitive" } },
                ]
                : undefined,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
    });
    const total = await prisma.promotion.count();
    return {
        meta: {
            page,
            limit,
            totalData: total,
            totalPages: Math.ceil(total / limit),
        },
        data: promotions,
    };
};
// get single promotion
const getSinglePromotion = async (id) => {
    const promotion = await prisma.promotion.findUnique({ where: { id } });
    return promotion;
};
//delete a promotion
const deleteAPromotion = async (id) => {
    const deletedPromotion = await prisma.promotion.delete({ where: { id } });
    return deletedPromotion;
};
//get all categories
const getAllCategories = async () => {
    const categories = await prisma.promotion.findMany({
        distinct: ["designation"],
        select: { designation: true },
    });
    const uniqueCategories = [
        ...new Set(categories.map((cat) => cat.designation)),
    ];
    return uniqueCategories;
};
export const promotionService = {
    createPromotion,
    updatePromotion,
    getAllPromotions,
    getSinglePromotion,
    deleteAPromotion,
    getAllCategories,
};
