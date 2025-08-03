# --- 第一阶段：构建阶段 (Builder Stage) ---
# 使用一个 Node.js 镜像来构建我们的 Vue 应用
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖
RUN npm install

# 复制所有前端源代码
COPY . .

# 执行构建命令，Vite/Vue-CLI 会将所有静态文件打包到 /app/dist 目录
RUN npm run build


# --- 第二阶段：生产阶段 (Production Stage) ---
# 从一个官方的、超轻量级的 Nginx 镜像开始
FROM nginx:1.21.0

# 将第一阶段 (builder) 构建出的静态文件，复制到 Nginx 的默认网站根目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 将我们自定义的 Nginx 配置文件复制到 Nginx 的配置目录下
# 这个文件将告诉 Nginx 如何处理单页应用的路由
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 1. 声明一个构建参数，并给它一个默认值
#    这个参数可以在构建时被覆盖，以使用不同的 Nginx 配置文件
#    例如：docker build --build-arg NGINX_CONF_FILE=nginx.staging.conf .
#    也可以在 docker-compose.yml 中指定
#    例如：
    #   args:
    #     # 明确告诉 Dockerfile，NGINX_CONF_FILE 的值是 nginx.staging.conf
    #     - NGINX_CONF_FILE=nginx.staging.conf
ARG NGINX_CONF_FILE=nginx.conf

# 2. 复制由构建参数指定的那个配置文件
COPY ${NGINX_CONF_FILE} /etc/nginx/conf.d/default.conf

# 暴露 Nginx 默认的 80 端口
EXPOSE 80

# Nginx 镜像会自带启动命令，我们无需额外指定 CMD