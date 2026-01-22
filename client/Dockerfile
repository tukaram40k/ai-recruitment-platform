FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Copy nginx config template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy original nginx.conf as fallback for local docker-compose
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Railway will override this with PORT env var)
EXPOSE 80

# Use entrypoint for Railway (handles PORT substitution)
ENTRYPOINT ["/docker-entrypoint.sh"]
