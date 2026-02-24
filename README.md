# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Vercel 自动部署排查（GitHub Push 后未触发）

如果你遇到「代码 push 到 GitHub 后没有自动触发 Vercel 构建」，可以按下面顺序排查：

1. **确认 Vercel 项目已连接正确仓库**：Vercel → Project → Settings → Git。
2. **确认 Production Branch**：应为你的主分支（`master` 或 `main`）。
3. **检查 Ignored Build Step**：如果配置为始终返回 `0`，Vercel 会跳过构建。
4. **检查 GitHub App 权限**：仓库权限变化后，常需在 GitHub 里重新授权 Vercel App。
5. **检查 Auto Assign 相关设置**：确保 Push 到主分支可触发 Production 部署。

本仓库额外提供了 GitHub Actions 兜底部署流程：
- 配置文件：`.github/workflows/vercel-deploy.yml`
- 作用：当 push 到 `master/main` 或发起 PR 时，直接通过 Vercel CLI 触发部署。

使用前请在 GitHub 仓库 `Settings → Secrets and variables → Actions` 新增：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

> 获取 `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`：在本地执行 `vercel link` 后查看 `.vercel/project.json`，或在 Vercel 项目设置中查看。
