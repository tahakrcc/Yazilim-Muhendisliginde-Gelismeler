# Frontend için nginx kullanarak statik dosyaları serve etme
FROM nginx:alpine

# Frontend dosyalarını nginx'in html dizinine kopyala
COPY . /usr/share/nginx/html

# Nginx konfigürasyonu (CORS ve proxy ayarları için)
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://pazar-backend:8080; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

