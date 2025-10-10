const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addComment = async (req, res) => {
  const { blogId, content } = req.body;
  const userId = req.userId;
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        blogId,
        userId,
      }
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteComment = async (req, res) => {
  const commentId = Number(req.params.id);
  try {
    await prisma.comment.delete({ where: { id: commentId } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addComment, deleteComment };
