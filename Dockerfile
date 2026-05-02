# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend and assemble the final image
FROM node:20-alpine
# Install openssl for Prisma compatibility on alpine
RUN apk add --no-cache openssl

WORKDIR /app/backend

# Copy backend dependencies
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Install backend dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Copy the rest of the backend files (including src, .env, and dev.db if needed)
COPY backend/ ./

# Copy the built frontend files to the expected location
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose the port the app runs on
EXPOSE 5001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET="refine_super_secret_key_123!"

# Start the application
CMD ["npm", "start"]
