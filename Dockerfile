FROM node:22-alpine

WORKDIR /app

# 复制项目文件（零依赖，无需 npm install）
COPY package.json ./
COPY src/ ./src/
COPY scripts/ ./scripts/

# 默认端口
EXPOSE 8787

# 通过环境变量传入配置，也可挂载 .env 文件
ENTRYPOINT ["node", "src/server.mjs"]
