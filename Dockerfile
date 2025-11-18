# Frontend build
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Set build args
ARG VITE_PB_URL=http://localhost:8090
ENV VITE_PB_URL=${VITE_PB_URL}

# Generate SvelteKit types and build
RUN npx svelte-kit sync && \
    npm run build && \
    ls -la build/

# Production runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ARG VITE_PB_URL=http://localhost:8090
ENV VITE_PB_URL=${VITE_PB_URL}
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build
RUN npm ci --omit=dev
EXPOSE 3000
ENV PORT=3000
CMD ["node", "build"]
