# 1. Giai đoạn build
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# 2. Giai đoạn phục vụ file tĩnh với nginx
FROM nginx:stable-alpine

# Xóa file mặc định của nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file build sang nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Nếu dùng react-router-dom, cấu hình nginx fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
