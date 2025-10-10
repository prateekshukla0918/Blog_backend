const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addBookmark = async (req, res) => {
  const { blogId } = req.body;
  const userId = req.userId;
  try {
    // Prevent duplicate bookmarks
    const exists = await prisma.bookmark.findFirst({ where: { blogId, userId } });
    if (exists) return res.status(400).json({ error: 'Already bookmarked this blog' });

    const bookmark = await prisma.bookmark.create({ data: { blogId, userId } });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const removeBookmark = async (req, res) => {
  const bookmarkId = Number(req.params.id);
  try {
    await prisma.bookmark.delete({ where: { id: bookmarkId } });
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const userId = req.userId;
    // Option 1: Basic (only ids)
    // const bookmarks = await prisma.bookmark.findMany({ where: { userId } });

    // Option 2 (Recommended): Bookmark with Blog info
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { blog: { include: { user: true } } }
    });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addBookmark, removeBookmark, getBookmarks };
