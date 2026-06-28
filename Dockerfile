FROM node:22-alpine

WORKDIR /app

# 先复制依赖清单单独一层，利用缓存
COPY package.json package-lock.json ./

# 安装运行时依赖（proxy.mjs 需要 undici 的 ProxyAgent）
RUN npm install --omit=dev

# 复制项目源码
COPY src/ ./src/
COPY scripts/ ./scripts/

# 默认端口
EXPOSE 8787

# 通过环境变量传入配置，也可挂载 .env 文件
ENTRYPOINT ["node", "src/server.mjs"]
