import { blogService } from "./blog.service";
//create blog
const createBlog = async (req, res) => {
    const result = await blogService.createBlog(req.body);
    res.status(201).send(result);
};
const updateBlog = async (req, res) => {
    const { blogId } = req.params;
    const result = await blogService.updateBlog(blogId, req.body);
    res.status(201).send(result);
};
const getAllBlogs = async (req, res) => {
    const result = await blogService.getAllBlogs(req.query);
    res.status(200).send(result);
};
const getSingleBlog = async (req, res) => {
    const result = await blogService.getSingleBlog(req.params.blogId);
    res.status(200).send(result);
};
const deleteBlog = async (req, res) => {
    const result = await blogService.deleteBlog(req.params.blogId);
    res.status(200).send(result);
};
export const blogController = {
    createBlog,
    updateBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
};
