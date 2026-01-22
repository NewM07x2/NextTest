# Development environment for Next.js
FROM node:20-alpine

WORKDIR /app

# Install dependencies for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN npm install --legacy-peer-deps

# Copy Prisma schema
COPY src/lib/prisma ./src/lib/prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY src ./src
COPY public ./public
COPY next.config.mjs tsconfig.json postcss.config.js tailwind.config.ts ./

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]
