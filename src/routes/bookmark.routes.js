const express = require('express');
const router = express.Router();
const { addBookmark, removeBookmark } = require('../controllers/bookmark.controller');
const authMiddleware = require('../middleware/auth');
// At the top with the other imports
const { getBookmarks } = require('../controllers/bookmark.controller');

// NEW: Get current user's bookmarks
router.get('/', authMiddleware, getBookmarks);


// Bookmark a blog
router.post('/', authMiddleware, addBookmark);

// Remove bookmark
router.delete('/:id', authMiddleware, removeBookmark);

module.exports = router;
