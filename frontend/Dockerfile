FROM node:20-alpine

WORKDIR /app

# Install dependencies if package.json exists
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi

COPY . .

# Set ownership to node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["npm", "run", "dev"]
