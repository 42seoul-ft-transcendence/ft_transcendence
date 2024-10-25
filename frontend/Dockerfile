FROM nginx:latest

COPY . /usr/share/nginx/html

# Nginx는 기본적으로 80번 포트를 사용하므로 해당 포트를 노출
EXPOSE 80

# Step 4: Nginx를 실행
CMD ["nginx", "-g", "daemon off;"]
