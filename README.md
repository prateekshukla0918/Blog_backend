📘 Blog Backend — README

Project: Blog Backend
Repository: prateekshukla0918/Blog_backend
A production-ready Node.js + Express backend for a blog platform with user authentication, post CRUD, comments, search, pagination, and file uploads. Designed to work with Prisma ORM (SQLite by default) and simple JWT auth.

🚀 Project Overview

This backend provides a REST API for a blog application. It supports:

User registration & login (hashed passwords + JWT)

Create / read / update / delete blog posts

Commenting on posts

Pagination, search, and basic filters (author, tags)

Image/file uploads for post thumbnails (Multer)

Role-aware endpoints (user vs admin) — extendable

Simple, environment-driven configuration for different DB providers via Prisma

🌟 Features

✅ User auth (register, login) with bcrypt + JWT

✅ Post management: create, edit, delete, fetch single & lists

✅ Comments: add, edit, delete (owner-only)

✅ Search (title/content), pagination, sorting (newest/oldest)

✅ File uploads for post images using Multer (stored in src/uploads/)

✅ Prisma ORM for schema & DB migrations (SQLite by default)

✅ Input validation & simple error-handling middleware

✅ Ready to deploy (Heroku/Render/Vercel backends)

🛠 Tech Stack

Runtime: Node.js

Framework: Express.js

ORM: Prisma (SQLite by default; swap DATABASE_URL for Postgres/MySQL)

Auth: JSON Web Tokens (jsonwebtoken), BCrypt (bcryptjs)

File Uploads: Multer (disk storage)

Dev tools: nodemon, dotenv

⚙️ Run Locally

Clone

git clone https://github.com/prateekshukla0918/Blog_backend.git
cd Blog_backend


Install dependencies

npm install


Configure environment variables
Create a .env file in project root (see Environment Variables below).

Run Prisma migrations (creates SQLite by default)

npx prisma migrate dev --name init
# or npx prisma db push (if you don't want a migration)


Start development server

npm run dev
# or npm start
# Default: http://localhost:8000

📦 Environment Variables

Create .env with at least:

DATABASE_URL="file:./dev.db"      # Prisma connection string (SQLite). Replace for Postgres/MySQL.
JWT_SECRET="your_jwt_secret"
PORT=8000
NODE_ENV=development
UPLOAD_DIR=src/uploads            # Ensure this folder exists & is writable


If using a cloud DB:

DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"

🔗 API Outline (example)

All protected routes require header: Authorization: Bearer <JWT>

Auth

POST /api/auth/register — create user (username/email unique)

POST /api/auth/login — returns { token, user }

Posts

GET /api/posts — list posts (query: page, limit, search, author, tag, sort=newest|oldest)

POST /api/posts — create post (auth + multipart for image)

GET /api/posts/:id — get single post (includes comments)

PATCH /api/posts/:id — update post (owner only)

PATCH /api/posts/:id/image — replace thumbnail/image (owner only)

DELETE /api/posts/:id — delete post (owner or admin)

Comments

POST /api/posts/:id/comments — add comment (auth)

PATCH /api/comments/:id — update comment (owner)

DELETE /api/comments/:id — delete comment (owner or admin)

Admin (optional)

GET /api/admin/users — list users

DELETE /api/admin/users/:id — remove user

Adjust endpoints to match your codebase if routes differ.

🗂 Project Structure (typical)
src/
├─ app.js                # Express app, middleware, routes
├─ server.js             # Entry point
├─ prismaClient.js       # Prisma client singleton
├─ controllers/
│  ├─ authController.js
│  ├─ postsController.js
│  └─ commentsController.js
├─ routes/
│  ├─ authRoutes.js
│  ├─ postRoutes.js
│  └─ commentRoutes.js
├─ middleware/
│  ├─ authMiddleware.js
│  ├─ errorHandler.js
│  └─ validateRequest.js
├─ services/
│  └─ uploadService.js
├─ utils/
│  └─ pagination.js
├─ prisma/
│  └─ schema.prisma
└─ uploads/               # Multer disk storage (gitignored)

🧰 Deployment

Build steps: Ensure NODE_ENV=production and DATABASE_URL points to your production DB.

For Vercel/Render/Heroku: add env vars in dashboard, enable write access to src/uploads/ (use persistent disk on Render).

Prisma: run npx prisma migrate deploy during CI/deploy.

Static files: serve uploads with Express static or upload to S3 and store URLs in DB for scalability.

🩺 Troubleshooting & Tips

CORS errors — add your frontend origin to cors() in src/app.js.

Prisma DB errors — ensure DATABASE_URL is valid; run npx prisma generate and npx prisma migrate dev.

MySQL auth errors (e.g., sha256_password) — use a compatible auth plugin or use a different DB user with mysql_native_password.

Uploads not saving — ensure UPLOAD_DIR exists and is writable by the process.

JWT issues — verify JWT_SECRET matches across services; tokens expire per config.

Empty search results — verify text fields are indexed or your query logic matches stored fields.

🔐 Security Notes

Store JWT_SECRET securely (do not commit).

Prefer httpOnly cookies for tokens in production (avoid localStorage for access tokens).

Validate & sanitize incoming content (titles, HTML) to prevent XSS.

Limit file size & allowed MIME types in Multer for uploads.

✅ Helpful Scripts (package.json)

npm run dev — start with nodemon

npm start — start production server

npx prisma migrate dev — run migrations

npx prisma studio — view DB in browser

🧾 License & Author

Built with ❤️ by Prateek Shukla.
Repository: https://github.com/prateekshukla0918/Blog_backend