# Vue3 RESTful API Demo

这是一个基于 Vue 3 的前端示例项目，演示了如何与 RESTful API 进行交互，支持 CSRF 保护，并可部署到不同环境。

## API 端点

本项目对接以下 API 端点：

- `GET /` – 服务器及客户端基本信息
- `GET /csrf-cookie` - 获取 CSRF Cookie
- `POST /login` - 用户登录
- `POST /logout` - 用户登出
- `GET /api/user` - 获取用户资料

## 技术栈

- Vue 3 + TypeScript
- Pinia 状态管理
- Vue Router
- Axios HTTP 客户端
- Vite 构建工具

## 开发设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 环境变量

项目使用环境变量来支持多环境部署。可以通过创建以下文件来配置：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

示例：

```
VITE_API_BASE_URL=https://dev.178778.xyz
VITE_APP_ENV=development
```

## 构建部署

```bash
# 构建生产环境
npm run build

# 本地预览构建结果
npm run preview
```

## GitHub Pages 部署

项目已配置 GitHub Actions 工作流，在推送到 main 分支时自动部署到 GitHub Pages。

## CSRF 保护

项目实现了针对跨站请求伪造(CSRF)的保护措施：

1. 通过 `/csrf-cookie` 端点获取 CSRF 令牌
2. 将令牌添加到后续请求的 `X-XSRF-TOKEN` 头中
3. 使用 `withCredentials: true` 确保跨域请求携带 cookie

## 使用指南

1. 访问首页，将自动重定向到登录页
2. 使用测试账号登录：
   - 邮箱: test@example.com
   - 密码: password
3. 登录成功后可查看用户信息
4. 点击"退出登录"按钮登出系统

## 许可证

MIT

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
