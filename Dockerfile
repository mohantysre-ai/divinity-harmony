FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Vite bakes these into the browser bundle at build time.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_LIVE_DARSHAN_FEED_URL
ARG VITE_SUPPORT_URL
ARG VITE_SITE_URL=https://mantra.sigq.in
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_LIVE_DARSHAN_FEED_URL=$VITE_LIVE_DARSHAN_FEED_URL \
    VITE_SUPPORT_URL=$VITE_SUPPORT_URL \
    VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache python3 py3-pip ca-certificates gcc g++ musl-dev python3-dev build-base
COPY server/requirements.txt /tmp/requirements.txt
RUN pip3 install --no-cache-dir -r /tmp/requirements.txt --break-system-packages
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY server /app/server
EXPOSE 80
CMD ["sh", "-c", "python3 /app/server/live_darshan_api.py & exec nginx -g 'daemon off;'"]
