# Build stage
FROM node:22.11.0-bookworm-slim AS builder

# Build arguments for metadata
ARG BUILD_NUMBER
ARG GIT_COMMIT

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Production stage
FROM node:22.11.0-bookworm-slim

# Build arguments (re-declare for this stage)
ARG BUILD_NUMBER
ARG GIT_COMMIT

# Add labels for metadata
LABEL org.opencontainers.image.title="MyDigiNetworkAPI"
LABEL org.opencontainers.image.description="Social Network API"
LABEL org.opencontainers.image.version="${BUILD_NUMBER}"
LABEL org.opencontainers.image.revision="${GIT_COMMIT}"
LABEL org.opencontainers.image.source="https://github.com/BumblePlumz/MyDigiNetworkAPI"

# Install dumb-init for proper signal handling
RUN apt-get update && \
    apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Set working directory
WORKDIR /app

# Copy dependencies from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=nodejs:nodejs . .

# Create uploads directory with proper permissions
RUN mkdir -p public/uploads && \
    chown -R nodejs:nodejs public/uploads

# Expose ports
EXPOSE 3000 3001

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/docs', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "app.js"]
