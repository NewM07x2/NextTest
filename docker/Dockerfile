# Development environment for Next.js
FROM node:20-alpine

WORKDIR /app

# Install dependencies for Prisma and build tools
RUN apk add --no-cache openssl

# Copy package files and configuration
COPY package.json package-lock.json* ./
COPY next.config.mjs tsconfig.json postcss.config.js tailwind.config.ts ./

# Install all dependencies (including dev dependencies)
RUN npm install --legacy-peer-deps

# Note: Application code is mounted as a volume in docker-compose.yml

# Expose the port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]
