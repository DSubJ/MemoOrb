# Frontend build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_PB_URL=http://localhost:8090
ENV VITE_PB_URL=${VITE_PB_URL}
RUN npx svelte-kit sync
RUN npm run build

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
