const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBlog = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;
  try {
    const blog = await prisma.blog.create({
      data: { title, description, userId }
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      include: { user: { select: { email: true } }, comments: true, likes: true, bookmarks: true }
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: { select: { email: true } }, comments: true, likes: true, bookmarks: true }
    });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBlog = async (req, res) => {
  const blogId = Number(req.params.id);
  const { title, description } = req.body;
  try {
    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: { title, description }
    });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteBlog = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.userId;
  try {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.userId !== userId) return res.status(403).json({ error: "Not allowed" });
    await prisma.blog.delete({ where: { id } });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
