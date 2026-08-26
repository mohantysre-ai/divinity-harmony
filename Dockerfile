FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache python3 ca-certificates
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY server/live_darshan_api.py /app/server/live_darshan_api.py
EXPOSE 80
CMD ["sh", "-c", "python3 /app/server/live_darshan_api.py & exec nginx -g 'daemon off;'"]
