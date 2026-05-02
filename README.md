# Refine - Role-Based Task Manager

Refine is a modern, full-stack task management application built with React, Express, and Prisma. It supports role-based access control, project organization, and task tracking.

## 🚀 Features
- **Project Management**: Create and manage multiple projects.
- **Task Tracking**: Assign tasks, set statuses, and monitor progress.
- **Role-Based Access**: Different permissions for Admins and Members.
- **Modern UI**: Clean and responsive interface built with React.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Axios, Lucide React
- **Backend**: Node.js, Express, Prisma (SQLite)
- **Deployment**: Optimized for Railway using Docker

## 💻 Local Development

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## 🚂 Railway Deployment

This project is ready for deployment on Railway!

1. Connect your GitHub repository to Railway.
2. Railway will automatically detect the `Dockerfile` in the root.
3. It will build and deploy the app as a single container.
4. Ensure you set any necessary environment variables (like `DATABASE_URL` if you switch to PostgreSQL) in the Railway dashboard.

## 📄 License
MIT
