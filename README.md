# Dessert Recipes

A curated dessert recipes web app with user accounts, favorites, and image uploads.

## Tech Stack

- **Framework** — Next.js (App Router) + TypeScript
- **Database** — MongoDB Atlas via Mongoose
- **Auth** — Custom JWT stored in an httpOnly cookie (bcryptjs + jsonwebtoken)
- **UI** — MUI (@mui/material) with a soft iOS / pastel theme
- **Images** — Cloudinary
- **Email** — Nodemailer

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in MONGODB_URI, JWT_SECRET, Cloudinary keys, and SMTP credentials
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (with hot reload) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
