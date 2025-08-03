# GHCR 全栈应用部署模板

该项目是一个完整的全栈应用示例，使用 GitHub Container Registry (GHCR) 进行镜像管理和部署。项目采用前后端分离架构，包含 Vue3 前端和 Fastify 后端。

文档地址：https://blog.yaolm.top/2025/08/03/GHCR%E5%85%A8%E6%A0%88%E5%BA%94%E7%94%A8%E9%83%A8%E7%BD%B2%E6%A8%A1%E6%9D%BF/

## 技术栈

### 前端 ([ghcr-application-vue3](ghcr-application-vue3))
- Vue 3
- TypeScript
- Vite
- Vue Router
- Nginx (用于生产环境)

### 后端 ([ghcr-application-fastify](ghcr-application-fastify))
- Fastify
- TypeScript
- MySQL
- Docker

## 项目结构

```
.
├── ghcr-application-vue3/    # Vue3 前端项目
├── ghcr-application-fastify/ # Fastify 后端项目
├── docker-compose.yml        # 开发环境配置
├── docker-compose-staging.yml # 预发布环境配置
├── docker-compose.prod.yml   # 生产环境配置
├── .env.dev                 # 开发环境变量
└── .env.pro                 # 生产环境变量
```

## 开始使用

### 开发环境

1. 克隆项目:
```sh
git clone <repository-url>
```

2. 启动开发环境:
```sh
docker compose up -d
```

访问:
- 前端: http://localhost:5173
- 后端: http://localhost:5174

### 预发布环境

```sh
docker compose -f docker-compose-staging.yml up -d
```

访问:
- 前端: http://localhost:5173
- 后端: http://localhost:5174

### 生产环境

1. 确保已正确配置域名和SSL证书

2. 部署:
```sh
docker compose -f docker-compose.prod.yml up -d
```

## 环境变量配置

### 开发环境 (.env.dev)
```sh
NODE_ENV=development
NODE_APP_VERSION=1.0.2
MYSQL_ROOT_PASSWORD=your_strong_root_password
MYSQL_DATABASE=myapp_db
MYSQL_USER=myapp_user
MYSQL_PASSWORD=your_strong_user_password
```

### 生产环境 (.env.pro)
```sh
NODE_ENV=production
NODE_APP_VERSION=1.0.4
MYSQL_ROOT_PASSWORD=your_strong_root_password
MYSQL_DATABASE=myapp_db
MYSQL_USER=myapp_user
MYSQL_PASSWORD=your_strong_user_password
```

## CI/CD

项目使用 GitHub Actions 自动构建和发布 Docker 镜像到 GHCR。当推送新的版本标签 (如 v1.0.0) 时，会自动触发构建流程。

### 发布新版本

```sh
git tag v1.0.0
git push origin v1.0.0
```

## 功能特性

- 完整的前后端分离架构
- 自动化的 CI/CD 流程
- 多环境部署支持
- SSL 证书自动化管理
- 容器化部署
- 数据持久化

## 注意事项

1. 生产环境部署前请修改所有敏感信息，包括：
   - 数据库密码
   - 环境变量
   - 域名配置

2. 确保 GHCR 仓库权限设置正确

3. 首次部署需要正确配置 SSL 证书

```
docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path /var/www/certbot -d ghcr.yaolm.top --email yaolunmao@gmail.com --agree-tos --no-eff-email --force-renewal
```

```
docker compose -f docker-compose.prod.yml restart ghcr-application-vue3-prod

```
## License

MIT
