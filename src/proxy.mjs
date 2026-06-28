// src/proxy.mjs — 出站网络代理设置
//
// Node 原生 fetch（基于 undici）不读 HTTP_PROXY / HTTPS_PROXY 环境变量，
// 必须显式 setGlobalDispatcher 才能让所有 fetch 走代理。
// Tabbit 会按出口 IP 判定地区，被封地区直连会拿到 403 HTML（Service Unavailable in Your Region）。
//
// 用法：在进程入口、第一次 fetch 之前调用 setupProxy(url)。
//   url 为空则保持直连，返回 false。

import { setGlobalDispatcher, ProxyAgent } from 'undici';

export function setupProxy(url) {
  if (!url) return false;
  try {
    setGlobalDispatcher(new ProxyAgent(url));
    return true;
  } catch (e) {
    // 地址格式错误（如漏写 http://）会让 ProxyAgent 构造直接抛错，
    // 在启动期失败比让 fetch 在运行期随机崩溃更易定位。
    console.error(`[proxy] 代理地址无效: ${url}（${e.message}）`);
    process.exit(1);
  }
}
