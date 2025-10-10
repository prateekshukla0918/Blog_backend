const express = require('express');
const router = express.Router();
const { likeBlog, unlikeBlog } = require('../controllers/like.controller');
const authMiddleware = require('../middleware/auth');

// Like a blog
router.post('/', authMiddleware, likeBlog);

// Unlike a blog
router.delete('/:id', authMiddleware, unlikeBlog);

module.exports = router;
