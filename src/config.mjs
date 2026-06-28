// src/config.mjs — 配置加载（.env + 环境变量）

import { readFileSync, existsSync } from 'node:fs';

function loadEnvFile() {
  const env = {};
  if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
  }
  return env;
}

const ENV = loadEnvFile();

export const config = {
  // Tabbit 登录态 Cookie（web.tabbit.ai 域下，含 HttpOnly token）
  cookie: ENV.TABBIT_COOKIE || process.env.TABBIT_COOKIE,
  // Tabbit 版本号，用于 x-req-ctx 头（来自 getDeviceInfo().tabbitVersion）
  version: ENV.TABBIT_VERSION || process.env.TABBIT_VERSION || '1.1.39(10101039)',
  // 签名 key（留空则自动从 /chat/sign-key 拉取并定期刷新）
  signKey: ENV.TABBIT_SIGN_KEY || process.env.TABBIT_SIGN_KEY || '',
  // HTTP 服务端口
  port: Number(ENV.PORT || process.env.PORT || 8787),
  // 可选：保护代理端点的 API Key（客户端用 Authorization: Bearer <KEY>）
  apiKey: ENV.API_KEY || process.env.API_KEY || '',
  // 可选：出站网络代理（访问 web.tabbit.ai 用，解决地域封锁 403）
  // 形如 http://127.0.0.1:7897 或 https://user:pass@host:port
  // 留空则直连。Tabbit 会按出口 IP 判定地区，被拦时会返回 403 "Service Unavailable in Your Region"
  proxy: ENV.HTTPS_PROXY || ENV.TABBIT_PROXY || process.env.HTTPS_PROXY || process.env.TABBIT_PROXY || '',
};

if (!config.cookie) {
  console.error('✗ 缺少 TABBIT_COOKIE，请在 .env 中填入 web.tabbit.ai 的 Cookie');
  process.exit(1);
}
