require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const cors = require('cors');

// Allow frontend local dev + production
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-url.onrender.com'],
  credentials: true
}));

app.use(express.json());

// Placeholder for routes (we'll add these next!)
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const blogRoutes = require('./routes/blog.routes');
app.use('/api/blogs', blogRoutes);

const commentRoutes = require('./routes/comment.routes');
const likeRoutes = require('./routes/like.routes');
const bookmarkRoutes = require('./routes/bookmark.routes');

app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);


app.get('/', (req, res) => {
  res.send('API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
