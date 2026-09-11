import { BlogStatus } from "../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
//create blog
const createBlog = async (data) => {
    const { title, content, thumbnail, status = "PUBLISHED" } = data;
    const createdBlog = await prisma.blog.create({
        data: {
            title,
            content,
            thumbnail,
            status,
        },
    });
    return {
        success: true,
        message: "Blog created successfully",
        data: createdBlog,
    };
};
//update blog
const updateBlog = async (id, payload) => {
    const { thumbnail, title, content, status } = payload;
    const blog_status = Object.keys(BlogStatus);
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (content !== undefined)
        updateData.content = content;
    if (thumbnail !== undefined)
        updateData.thumbnail = thumbnail;
    if (status && !blog_status.includes(status)) {
        throw new AppError(`Invalid status. Status must be ${blog_status.join(" | ")}`);
    }
    if (status !== undefined)
        updateData.status = status;
    if (Object.keys(updateData).length === 0) {
        throw new AppError("At least one field required for update blog.");
    }
    const updatedBlog = await prisma.blog.update({
        where: { id: id },
        data: updateData,
    });
    return {
        success: true,
        message: "Blog updated successfully",
        data: updatedBlog,
    };
};
const getAllBlogs = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 12;
    const blogs = await prisma.blog.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
    });
    const totalBlogs = await prisma.blog.count();
    return {
        success: true,
        message: "Blogs fetched successfully",
        meta: {
            page,
            limit,
            total: totalBlogs,
            totalPage: Math.ceil(totalBlogs / limit),
        },
        data: blogs,
    };
};
const getSingleBlog = async (id) => {
    if (!id) {
        throw new AppError("Id is required to get single blog details");
    }
    const blog = await prisma.blog.findUnique({ where: { id } });
    return { success: true, message: "Blog details retrieved", data: blog };
};
const deleteBlog = async (id) => {
    if (!id)
        throw new AppError("Id is required to delete blog");
    const deletedBlog = await prisma.blog.delete({ where: { id } });
    return { success: true, message: "Blog is deleted", data: deletedBlog };
};
export const blogService = {
    createBlog,
    updateBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
};
