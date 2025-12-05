const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBlog = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.userId;
  try {
    const blog = await prisma.blog.create({
      data: { title, description, userId },
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    let {
      search = "",
      author = "all",
      sort = "newest", // "newest" | "oldest"
      page = "1",
      limit = "6",
    } = req.query;

    // Convert to numbers and sanitize
    const pageNum = Math.max(parseInt(page) || 1, 1);
    const pageSize = Math.max(parseInt(limit) || 6, 1);

    const where = {};

    // Author filter
    if (author && author !== "all") {
      if (author === "Anonymous") {
        // assuming anonymous = no user linked
        where.userId = null;
      } else {
        // Prisma relation filter (for Blog -> User)
        where.user = {
          is: {
            email: author,
          },
        };
      }
    }

    // Search in title OR description
    if (search.trim() !== "") {
      where.OR = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    // Sorting
    const orderBy = {
      createdAt: sort === "oldest" ? "asc" : "desc",
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          user: { select: { id: true, email: true } },
          comments: true,
          likes: true,
          bookmarks: true,
        },
        orderBy,
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blog.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    res.json({
      blogs,
      total,
      page: pageNum,
      totalPages,
      limit: pageSize,
    });
  } catch (err) {
    console.error("getAllBlogs error:", err);
    res.status(500).json({ error: "Server error" });
  }
};




const getBlogById = async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        user: { select: { id: true, email: true } },
        comments: true,
        likes: true,
        bookmarks: true,
      },
    });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const updateBlog = async (req, res) => {
  const blogId = Number(req.params.id);
  const { title, description } = req.body;
  const userId = req.userId;

  try {
    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    if (blog.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this blog" });
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: { title, description },
    });

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

const deleteBlog = async (req, res) => {
  const id = Number(req.params.id);
  const userId = req.userId;
  try {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.userId !== userId)
      return res.status(403).json({ error: "Not allowed" });
    await prisma.blog.delete({ where: { id } });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
