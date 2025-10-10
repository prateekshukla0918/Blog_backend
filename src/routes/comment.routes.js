const express = require('express');
const router = express.Router();
const { addComment, deleteComment } = require('../controllers/comment.controller');
const authMiddleware = require('../middleware/auth');

// Add comment to a blog
router.post('/', authMiddleware, addComment);

// Delete a comment
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
