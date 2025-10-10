const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeBlog = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.userId;
  try {
    // Prevent duplicate likes by user on the same blog
    const exists = await prisma.like.findFirst({ where: { blogId, userId } });
    if (exists) return res.status(400).json({ error: 'Already liked this blog' });

    const like = await prisma.like.create({ data: { blogId, userId } });
    res.status(201).json(like);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const unlikeBlog = async (req, res) => {
  const likeId = Number(req.params.id);
  try {
    await prisma.like.delete({ where: { id: likeId } });
    res.json({ message: 'Unlike successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { likeBlog, unlikeBlog };
