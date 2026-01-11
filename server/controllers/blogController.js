const Blog = require('../models/blogModel');

// @desc    Get all blogs
const getBlogs = async (req, res) => {
  const blogs = await Blog.find({}).sort({ createdAt: -1 });
  res.json(blogs);
};

// @desc    Create blog (Admin Only)
const createBlog = async (req, res) => {
  const { title, content, image, category } = req.body;
  const blog = await Blog.create({ title, content, image, category });
  res.status(201).json(blog);
};

// @desc    Update blog (Admin Only)
const updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    Object.assign(blog, req.body);
    const updated = await blog.save();
    res.json(updated);
  } else {
    res.status(404); throw new Error('Blog not found');
  }
};

// @desc    Delete blog (Admin Only)
const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) { await blog.deleteOne(); res.json({ message: 'Removed' }); }
  else { res.status(404); throw new Error('Not found'); }
};
// fetchSingleBlog
const getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404); throw new Error('Blog not found');
  }
};
module.exports = { getBlogs, createBlog, updateBlog, deleteBlog, getBlogById };