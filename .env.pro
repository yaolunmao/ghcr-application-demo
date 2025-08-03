# .env.pro

# 标识当前环境为开发环境 前端的环境变量自己管理 因为前端打包时会将环境变量写入到静态文件

NODE_ENV=production 

NODE_APP_VERSION=1.0.4 # 后端应用版本号

# MySQL 数据库凭证
MYSQL_ROOT_PASSWORD=your_strong_root_password
MYSQL_DATABASE=myapp_db
MYSQL_USER=myapp_user
MYSQL_PASSWORD=your_strong_user_password