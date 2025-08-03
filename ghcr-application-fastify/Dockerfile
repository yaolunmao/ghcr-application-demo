# --- 第一阶段：构建阶段 (Builder Stage) ---
# 使用一个完整的 Node.js 镜像，命名为 'builder'
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖，包括构建 TypeScript 所需的 devDependencies
RUN npm install

# 复制所有源代码 (包括 .ts 文件)
COPY . .

# 执行构建命令，将 TypeScript 编译成 JavaScript
# 假设你的 package.json 中有一个名为 "build" 的脚本，例如 "build": "tsc"
RUN npm run build:ts


# --- 第二阶段：生产阶段 (Production Stage) ---
# 从一个全新的、轻量的 Node.js 镜像开始
FROM node:22-alpine

# 设置工作目录
WORKDIR /app


# 只复制生产运行所必需的文件
COPY package*.json ./

# 只安装生产依赖 (忽略 devDependencies)，这会使 node_modules 体积大大减小
RUN npm install --omit=dev

# 从第一阶段 (builder) 中，只复制出编译好的 JavaScript 代码
# 假设编译后的文件放在 /app/dist 目录下
COPY --from=builder /app/dist ./dist

# 暴露你的应用在容器内监听的端口
EXPOSE 3000

# 定义容器启动时运行的命令 注意 后端的package.json要加上   "prod": "fastify start -l info dist/app.js"
CMD ["npm", "run", "prod"] 