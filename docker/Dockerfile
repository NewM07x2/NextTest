# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for Prisma and build tools
RUN apk add --no-cache openssl python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with npm ci for reproducibility
RUN npm ci --legacy-peer-deps

# Copy Prisma schema
COPY src/lib/prisma ./src/lib/prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY public ./public
COPY next.config.mjs tsconfig.json postcss.config.js tailwind.config.ts ./

# Build Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies for Prisma
RUN apk add --no-cache openssl

# Set environment to production
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy Prisma schema and generated client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/src/lib/prisma ./src/lib/prisma

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "run", "start"]
