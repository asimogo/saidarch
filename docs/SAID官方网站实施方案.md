# SAID | 上境设计

## Summit Architecture & Interior Design

# 官方网站实施方案 Implementation Plan

**版本：V1.0**
**基于需求文档：V4.2 Final**
**编制日期：2026年2月24日**

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术架构方案](#2-技术架构方案)
3. [数据库设计方案](#3-数据库设计方案)
4. [前端架构方案](#4-前端架构方案)
5. [后台管理系统方案](#5-后台管理系统方案)
6. [第三方服务集成方案](#6-第三方服务集成方案)
7. [多语言方案](#7-多语言方案)
8. [性能优化方案](#8-性能优化方案)
9. [SEO 方案](#9-seo-方案)
10. [分阶段实施计划](#10-分阶段实施计划)
11. [部署方案](#11-部署方案)
12. [质量保障](#12-质量保障)

---

## 1. 项目概述

### 1.1 项目背景

SAID（Summit Architecture & Interior Design，上境设计）是一个位于柬埔寨金边和西港的中柬跨国小型精英建筑设计团队（3-5人），核心业务涵盖豪宅别墅、精品办公、星级酒店和高端公寓。目标受众为在柬中国人/华人及柬埔寨本地客户。

本项目为 SAID 建设官方展示网站，用于展示设计作品、传递品牌理念、提供联系渠道。

### 1.2 项目目标

- 建立专业的线上品牌形象，传达"K-M Fusion（高棉现代融合）"设计风格
- 通过沉浸式全屏视觉体验展示设计作品
- 支持中英文双语，服务多元客户群体
- 提供易用的后台管理系统，让主创设计师可独立维护内容
- 实现高性能、高 SEO 评分的现代化网站

### 1.3 核心架构决策

| 决策项 | 结论 | 说明 |
|--------|------|------|
| 网站架构 | 单页主体 + 项目详情子页 | 参考 Studio MEMM，首页一镜到底 |
| 导航方式 | 混合式 | 首页锚点导航 + 项目详情独立路由 |
| UI 风格 | K-M Fusion | 布局学 MEMM，灵魂属高棉 |
| 默认语言 | 英文 | `/` 显示英文，`/zh/` 显示中文 |
| 内容创作语言 | 中文 | 中文→英文，DeepSeek AI 辅助翻译 |

### 1.4 当前项目状态

| 项目 | 状态 |
|------|------|
| Nuxt 4.3.1 | ✅ 已安装，仅有默认 `app/app.vue` |
| Vue 3.5.28 / Vue Router 4.6.4 | ✅ 已安装 |
| `nuxt.config.ts` | 仅有 `compatibilityDate` 和 `devtools` 配置 |
| 实际页面/组件/API/样式 | ❌ 无 |

---

## 2. 技术架构方案

### 2.1 技术栈总览

| 层级 | 技术 | 版本 | 职责 |
|------|------|------|------|
| 前端框架 | Nuxt 4 | ^4.3.1 | SSR/SSG/ISR 混合渲染 |
| UI 框架 | Vue 3 | ^3.5.28 | 响应式 UI |
| 样式 | Tailwind CSS 4 | ^4.x | 原子化 CSS + 自定义设计令牌 |
| 动画 | GSAP + ScrollTrigger | ^3.12 | 滚动动画、页面过渡、Ken Burns 效果 |
| 图片优化 | @nuxt/image | ^1.x | 自动 WebP 转换、响应式图片 |
| 多语言 | @nuxtjs/i18n | ^9.x | 多语言路由管理 |
| 数据库客户端 | @supabase/supabase-js | ^2.x | PostgREST API + Auth + 类型安全 |
| 数据库 | Supabase PostgreSQL | — | 数据持久化 |
| 文件存储 | Cloudflare R2 | — | 图片/资源存储（零出站流量费） |
| AI 翻译 | DeepSeek API | — | 中文→英文批量翻译 |
| 数据分析 | Plausible Analytics | — | 轻量隐私友好分析 |
| 部署 | Vercel | — | Edge Network + Serverless Functions |

### 2.2 渲染策略

| 页面 | 策略 | 配置 | 理由 |
|------|------|------|------|
| 首页 | SSG（静态生成） | `prerender: true` | 内容变更频率低，CDN 直出性能最优 |
| 项目归档/详情 | ISR（增量静态再生） | `isr: 60` | 60秒缓存 + 后台操作触发 On-demand Revalidation |
| 隐私政策 | SSG | `prerender: true` | 纯静态内容 |
| 后台管理 | SPA（客户端渲染） | `ssr: false` | 无 SEO 需求，纯管理界面 |

```typescript
// nuxt.config.ts 中的 routeRules 配置
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/zh': { prerender: true },
    '/projects': { isr: 60 },
    '/zh/projects': { isr: 60 },
    '/project/**': { isr: 60 },
    '/zh/project/**': { isr: 60 },
    '/privacy': { prerender: true },
    '/zh/privacy': { prerender: true },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true },
  },
})
```

### 2.3 项目目录结构

```
saidarch/
├── app/                           # 应用代码（Nuxt 4 标准）
│   ├── assets/
│   │   └── css/
│   │       └── main.css           # Tailwind 入口 + @theme 设计令牌
│   ├── components/
│   │   ├── common/                # 全局通用组件
│   │   │   ├── AppHeader.vue      # 导航栏（桌面+移动端自适应）
│   │   │   ├── AppFooter.vue      # 页脚
│   │   │   ├── FloatingContact.vue # 浮动咨询按钮
│   │   │   ├── ThemeToggle.vue    # 明暗主题切换
│   │   │   ├── LanguageSwitcher.vue # 语言切换 EN|中
│   │   │   ├── LoadingScreen.vue  # 首屏 Logo 加载动画
│   │   │   └── SkipNavigation.vue # 无障碍跳过导航链接
│   │   ├── home/                  # 首页五大模块
│   │   │   ├── HeroSection.vue    # A. Hero 全屏轮播
│   │   │   ├── FeaturedProjects.vue # B. 精选项目全屏切换
│   │   │   ├── AboutSection.vue   # C. 关于 SAID
│   │   │   ├── ContactSection.vue # D. 联系我们 + Google Maps
│   │   │   └── BrandClosing.vue   # E. 品牌尾声
│   │   ├── project/               # 项目相关组件
│   │   │   ├── ProjectCard.vue    # 项目卡片（归档页+推荐）
│   │   │   ├── ProjectGallery.vue # 图片画廊
│   │   │   ├── ProjectInfo.vue    # 项目信息卡片
│   │   │   ├── ProjectNav.vue     # 上一个/下一个导航
│   │   │   ├── RelatedProjects.vue # 相关项目推荐
│   │   │   ├── SocialShare.vue    # 社交分享按钮
│   │   │   ├── Lightbox.vue       # 图片灯箱（焦点陷阱）
│   │   │   ├── CategoryFilter.vue # 分类筛选标签
│   │   │   └── StatusBadge.vue    # 项目状态标签
│   │   ├── ui/                    # UI 基础组件
│   │   │   ├── BaseButton.vue     # 按钮（多变体）
│   │   │   ├── BaseImage.vue      # 渐进式加载图片
│   │   │   ├── BaseCarousel.vue   # 通用轮播组件
│   │   │   └── KhmerPattern.vue   # 高棉几何装饰纹样 SVG
│   │   └── admin/                 # 后台管理组件
│   │       ├── AdminSidebar.vue   # 侧边栏导航
│   │       ├── AdminHeader.vue    # 顶部栏（面包屑+操作）
│   │       ├── BilingualEditor.vue # 并排双语文本编辑器
│   │       ├── ImageUploader.vue  # 图片上传（R2）
│   │       ├── SortableList.vue   # 拖拽排序列表
│   │       ├── TranslateButton.vue # AI 一键翻译按钮
│   │       ├── PreviewButton.vue  # 预览按钮
│   │       ├── PublishWorkflow.vue # 发布状态切换
│   │       └── DataTable.vue      # 数据表格
│   ├── composables/
│   │   ├── useSupabase.ts         # Supabase 客户端单例 + 类型封装
│   │   ├── useTheme.ts            # 明暗主题（手动>系统>时区）
│   │   ├── useScrollSpy.ts        # 锚点滚动监听 + 导航高亮
│   │   ├── useAnimation.ts        # GSAP 动画封装 + reduced-motion
│   │   ├── useR2Upload.ts         # Cloudflare R2 上传封装
│   │   ├── useTranslation.ts      # DeepSeek AI 翻译封装
│   │   ├── usePreviewMode.ts      # 草稿预览模式
│   │   ├── useLocalizedField.ts   # 多语言字段读取辅助
│   │   └── useSiteSettings.ts     # 全局站点设置缓存
│   ├── layouts/
│   │   ├── default.vue            # 前端默认布局（Header+Footer+FloatingContact）
│   │   └── admin.vue              # 后台管理布局（Sidebar+Header+Content）
│   ├── middleware/
│   │   ├── auth.ts                # 后台认证守卫
│   │   └── slug-redirect.ts       # 旧 slug 301 重定向
│   ├── pages/
│   │   ├── index.vue              # 首页（五大模块组合）
│   │   ├── projects.vue           # 项目归档（网格+筛选）
│   │   ├── project/
│   │   │   └── [slug].vue         # 项目详情（沉浸式）
│   │   ├── privacy.vue            # 隐私政策
│   │   ├── admin/
│   │   │   ├── index.vue          # Dashboard 仪表盘
│   │   │   ├── login.vue          # 登录页
│   │   │   ├── settings.vue       # 全局设置管理
│   │   │   ├── hero.vue           # Hero 轮播管理
│   │   │   ├── projects/
│   │   │   │   ├── index.vue      # 项目列表
│   │   │   │   └── [id].vue       # 项目编辑（新建/编辑共用）
│   │   │   ├── categories.vue     # 分类管理
│   │   │   └── translation.vue    # AI 翻译提示词管理
│   │   └── [...slug].vue          # 404 捕获页
│   ├── plugins/
│   │   ├── gsap.client.ts         # GSAP + ScrollTrigger 注册
│   │   └── plausible.client.ts    # Plausible Analytics 初始化
│   ├── utils/
│   │   ├── constants.ts           # 颜色、断点等常量
│   │   └── helpers.ts             # 工具函数（slug 生成等）
│   ├── app.vue                    # 根组件
│   ├── app.config.ts              # 应用运行时配置
│   └── error.vue                  # 全局错误页面
├── public/
│   ├── favicon.ico
│   └── robots.txt                 # SEO robots 规则
├── server/                        # 服务端代码
│   ├── api/
│   │   ├── revalidate.post.ts     # ISR On-demand Revalidation
│   │   ├── translate.post.ts      # DeepSeek 翻译代理
│   │   ├── upload/
│   │   │   ├── presign.post.ts    # R2 预签名 URL 生成
│   │   │   └── confirm.post.ts    # 上传确认 + 图片处理
│   │   └── preview/
│   │       └── [slug].get.ts      # 草稿预览验证
│   ├── middleware/
│   │   └── slug-redirect.ts       # 服务端 slug 重定向
│   └── utils/
│       ├── supabase.ts            # 服务端 Supabase Admin 客户端
│       └── r2.ts                  # R2 S3 客户端初始化
├── shared/                        # 前后端共享代码
│   └── types/
│       ├── database.ts            # supabase gen types 生成
│       └── index.ts               # 自定义共享类型
├── supabase/                      # Supabase 本地开发 + Migration
│   ├── migrations/                # SQL Migration 文件
│   │   ├── 00001_create_site_settings.sql
│   │   ├── 00002_create_hero_slides.sql
│   │   ├── 00003_create_categories.sql
│   │   ├── 00004_create_projects.sql
│   │   ├── 00005_create_project_images.sql
│   │   ├── 00006_create_translation_prompts.sql
│   │   ├── 00007_create_page_contents.sql
│   │   ├── 00008_create_slug_redirects.sql
│   │   ├── 00009_seed_initial_data.sql
│   │   └── 00010_rls_policies.sql
│   └── config.toml                # Supabase 本地配置
├── i18n/                          # 国际化文件
│   ├── locales/
│   │   ├── en.json                # 英文 UI 翻译
│   │   └── zh.json                # 中文 UI 翻译
│   └── i18n.config.ts             # i18n 配置
├── nuxt.config.ts                 # Nuxt 主配置
├── package.json
├── tsconfig.json
├── .env.example                   # 环境变量模板
└── .gitignore
```

### 2.4 核心 nuxt.config.ts 配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // 模块
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  // 运行时配置（环境变量）
  runtimeConfig: {
    // 仅服务端
    supabaseServiceKey: '',
    deepseekApiKey: '',
    r2AccessKeyId: '',
    r2SecretAccessKey: '',
    r2Endpoint: '',
    r2BucketName: '',
    revalidateSecret: '',
    // 客户端可访问
    public: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      r2PublicUrl: '',
      plausibleDomain: '',
      plausibleApiHost: '',
      siteUrl: '',
    },
  },

  // 路由规则（混合渲染）
  routeRules: {
    '/': { prerender: true },
    '/zh': { prerender: true },
    '/projects': { isr: 60 },
    '/zh/projects': { isr: 60 },
    '/project/**': { isr: 60 },
    '/zh/project/**': { isr: 60 },
    '/privacy': { prerender: true },
    '/zh/privacy': { prerender: true },
    '/admin/**': { ssr: false },
    '/api/**': { cors: true },
  },

  // i18n 配置
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'EN', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'i18n/locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'said_lang',
      redirectOn: 'root',
    },
  },

  // Nuxt Image 配置
  image: {
    provider: 'ipx',
    format: ['webp', 'avif'],
    quality: 80,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // CSS
  css: ['~/assets/css/main.css'],

  // App 配置
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
          as: 'style',
        },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap',
          as: 'style',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Sitemap
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    exclude: ['/admin/**'],
  },

  // Robots
  robots: {
    disallow: ['/admin', '/api'],
  },
})
```

### 2.5 环境变量清单

```bash
# .env.example

# === Supabase ===
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# === Cloudflare R2 ===
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_BUCKET_NAME=said-assets
NUXT_PUBLIC_R2_PUBLIC_URL=https://assets.saidarch.com

# === DeepSeek API ===
DEEPSEEK_API_KEY=sk-xxx

# === Plausible ===
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=saidarch.com
NUXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io

# === 站点 ===
NUXT_PUBLIC_SITE_URL=https://saidarch.com

# === ISR Revalidation ===
REVALIDATE_SECRET=your-secret-token
```

---

## 3. 数据库设计方案

### 3.1 数据库表结构

#### 3.1.1 site_settings — 全局站点设置

采用 Key-Value 模式存储，灵活扩展无需改表结构。

```sql
-- supabase/migrations/00001_create_site_settings.sql

CREATE TABLE site_settings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value_zh    TEXT,
  value_en    TEXT,
  value_km    TEXT,                           -- 高棉语值（V1 预留）
  type        TEXT NOT NULL DEFAULT 'text'
                CHECK (type IN ('text', 'image', 'json', 'number')),
  group_name  TEXT NOT NULL DEFAULT 'general'
                CHECK (group_name IN ('brand', 'contact', 'seo', 'theme', 'about', 'social', 'general')),
  description TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_site_settings_group ON site_settings(group_name);
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_site_settings_updated
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**预置数据键名清单**：

| group_name | key | type | 说明 |
|------------|-----|------|------|
| brand | site_title | text | 网站标题 |
| brand | site_subtitle | text | 网站副标题 |
| brand | slogan | text | 品牌 Slogan |
| brand | logo_light_url | image | 明亮模式 Logo URL |
| brand | logo_dark_url | image | 暗黑模式 Logo URL |
| theme | timezone | text | 时区（默认 Asia/Phnom_Penh） |
| theme | day_start_hour | number | 日间开始（默认 6） |
| theme | day_end_hour | number | 日间结束（默认 18） |
| contact | telegram_link | text | Telegram 链接 |
| contact | whatsapp_link | text | WhatsApp 链接 |
| contact | email | text | 邮箱 |
| contact | address | text | 办公地址 |
| contact | google_maps_embed | text | Google Maps 嵌入 URL |
| social | instagram_url | text | Instagram |
| social | facebook_url | text | Facebook |
| social | tiktok_url | text | TikTok |
| seo | seo_title | text | 站点 SEO 标题 |
| seo | seo_description | text | 站点 SEO 描述 |
| seo | og_image_url | image | 站点 OG 图片 |
| about | avatar_url | image | 主创头像 |
| about | intro | text | 主创介绍 |
| about | team_desc | text | 团队简述 |
| about | services | text | 业务范围 |
| about | areas | text | 服务区域 |

#### 3.1.2 hero_slides — Hero 轮播图

```sql
-- supabase/migrations/00002_create_hero_slides.sql

CREATE TABLE hero_slides (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url     TEXT NOT NULL,
  title_zh      TEXT,
  title_en      TEXT,
  subtitle_zh   TEXT,
  subtitle_en   TEXT,
  cta_text_zh   TEXT DEFAULT '查看作品',
  cta_text_en   TEXT DEFAULT 'View Projects',
  cta_link      TEXT DEFAULT '#projects',
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_hero_slides_active_sort ON hero_slides(is_active, sort_order);

CREATE TRIGGER trigger_hero_slides_updated
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### 3.1.3 categories — 项目分类

```sql
-- supabase/migrations/00003_create_categories.sql

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh     TEXT NOT NULL,
  name_en     TEXT NOT NULL,
  name_km     TEXT,                           -- V1 预留
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_sort ON categories(sort_order);

CREATE TRIGGER trigger_categories_updated
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### 3.1.4 projects — 项目

```sql
-- supabase/migrations/00004_create_projects.sql

CREATE TYPE project_status_enum AS ENUM (
  'designing',    -- 设计中
  'constructing', -- 施工中
  'completed',    -- 已竣工
  'awarded'       -- 已获奖
);

CREATE TYPE publish_status_enum AS ENUM (
  'draft',        -- 草稿
  'published',    -- 已发布
  'archived'      -- 已下线
);

CREATE TABLE projects (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh          TEXT NOT NULL,
  title_en          TEXT,
  slug              TEXT NOT NULL UNIQUE,
  cover_url         TEXT,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  location          TEXT,
  area              TEXT,
  year              INT,
  materials_zh      TEXT,
  materials_en      TEXT,
  project_status    project_status_enum DEFAULT 'designing',
  description_zh    TEXT,
  description_en    TEXT,
  seo_title_zh      TEXT,
  seo_title_en      TEXT,
  seo_description_zh TEXT,
  seo_description_en TEXT,
  og_image_url      TEXT,
  sort_order        INT NOT NULL DEFAULT 0,
  is_featured       BOOLEAN NOT NULL DEFAULT false,
  publish_status    publish_status_enum NOT NULL DEFAULT 'draft',
  preview_token     TEXT,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_publish_status ON projects(publish_status);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_featured ON projects(is_featured, sort_order)
  WHERE publish_status = 'published';
CREATE INDEX idx_projects_sort ON projects(sort_order);
CREATE INDEX idx_projects_slug ON projects(slug);

CREATE TRIGGER trigger_projects_updated
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### 3.1.5 project_images — 项目图片

```sql
-- supabase/migrations/00005_create_project_images.sql

CREATE TABLE project_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  caption_zh  TEXT,                           -- 兼做无障碍 alt 文本
  caption_en  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_images_project ON project_images(project_id, sort_order);
```

#### 3.1.6 translation_prompts — AI 翻译提示词

```sql
-- supabase/migrations/00006_create_translation_prompts.sql

CREATE TYPE section_type_enum AS ENUM (
  'project',   -- 项目描述
  'brand',     -- 品牌文案
  'about',     -- 主创/团队介绍
  'contact',   -- 联系信息
  'hero',      -- Hero 文案
  'general'    -- 通用文案
);

CREATE TABLE translation_prompts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type  section_type_enum NOT NULL UNIQUE,
  prompt_text   TEXT NOT NULL,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_translation_prompts_updated
  BEFORE UPDATE ON translation_prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### 3.1.7 page_contents — 静态页面内容

```sql
-- supabase/migrations/00007_create_page_contents.sql

CREATE TABLE page_contents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title_zh    TEXT,
  title_en    TEXT,
  content_zh  TEXT,
  content_en  TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_page_contents_updated
  BEFORE UPDATE ON page_contents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

#### 3.1.8 slug_redirects — Slug 重定向

```sql
-- supabase/migrations/00008_create_slug_redirects.sql

CREATE TABLE slug_redirects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  old_slug   TEXT NOT NULL UNIQUE,
  new_slug   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_slug_redirects_old ON slug_redirects(old_slug);
```

### 3.2 种子数据

```sql
-- supabase/migrations/00009_seed_initial_data.sql

-- 默认分类
INSERT INTO categories (name_zh, name_en, slug, sort_order) VALUES
  ('别墅', 'Villa', 'villa', 1),
  ('办公', 'Office', 'office', 2),
  ('酒店', 'Hotel', 'hotel', 3),
  ('公寓', 'Apartment', 'apartment', 4);

-- 默认翻译提示词
INSERT INTO translation_prompts (section_type, prompt_text) VALUES
  ('project', '你是一位资深建筑设计行业翻译专家。请将以下中文内容翻译为英文。要求：使用建筑/室内设计专业术语；语言简洁优雅；保持原文的设计意图和空间描述的准确性。不要添加额外解释。'),
  ('brand', '你是一位高端品牌文案翻译专家。请将以下中文品牌文案翻译为英文。要求：保持品牌调性；适当使用诗意表达；传达东方美学与现代设计的融合感。不要添加额外解释。'),
  ('about', '你是一位专业简历翻译专家。请将以下中文个人/团队介绍翻译为英文。要求：专业简历风格；突出学术背景和专业成就；语言正式但不生硬。不要添加额外解释。'),
  ('contact', '你是一位商务翻译专家。请将以下中文联系信息翻译为英文。要求：商务正式风格；地址按国际惯例格式化。不要添加额外解释。'),
  ('hero', '你是一位品牌文案翻译专家。请将以下中文 Hero 区域文案翻译为英文。要求：精炼有力；品牌宣言感；每句不超过10个英文单词。不要添加额外解释。'),
  ('general', '你是一位中英翻译专家。请将以下中文内容翻译为英文。要求：准确通顺；保持原意；适合网页展示。不要添加额外解释。');

-- 默认站点设置
INSERT INTO site_settings (key, value_zh, value_en, type, group_name, description, sort_order) VALUES
  ('site_title', 'SAID | 上境设计', 'SAID | Summit Architecture & Interior Design', 'text', 'brand', '网站标题', 1),
  ('site_subtitle', '柬埔寨精英建筑设计团队', 'Elite Architecture Design Team in Cambodia', 'text', 'brand', '网站副标题', 2),
  ('slogan', 'Less is More, but with Local Soul.', 'Less is More, but with Local Soul.', 'text', 'brand', '品牌 Slogan', 3),
  ('logo_light_url', NULL, NULL, 'image', 'brand', '明亮模式 Logo', 4),
  ('logo_dark_url', NULL, NULL, 'image', 'brand', '暗黑模式 Logo', 5),
  ('timezone', 'Asia/Phnom_Penh', 'Asia/Phnom_Penh', 'text', 'theme', '站点时区', 1),
  ('day_start_hour', '6', '6', 'number', 'theme', '日间开始时间', 2),
  ('day_end_hour', '18', '18', 'number', 'theme', '日间结束时间', 3),
  ('telegram_link', NULL, NULL, 'text', 'contact', 'Telegram 链接', 1),
  ('whatsapp_link', NULL, NULL, 'text', 'contact', 'WhatsApp 链接', 2),
  ('email', NULL, NULL, 'text', 'contact', '邮箱地址', 3),
  ('address', NULL, NULL, 'text', 'contact', '办公地址', 4),
  ('google_maps_embed', NULL, NULL, 'text', 'contact', 'Google Maps 嵌入链接', 5),
  ('instagram_url', NULL, NULL, 'text', 'social', 'Instagram', 1),
  ('facebook_url', NULL, NULL, 'text', 'social', 'Facebook', 2),
  ('tiktok_url', NULL, NULL, 'text', 'social', 'TikTok', 3),
  ('seo_title', NULL, NULL, 'text', 'seo', '默认 SEO 标题', 1),
  ('seo_description', NULL, NULL, 'text', 'seo', '默认 SEO 描述', 2),
  ('og_image_url', NULL, NULL, 'image', 'seo', '默认 OG 图片', 3),
  ('avatar_url', NULL, NULL, 'image', 'about', '主创头像', 1),
  ('intro', NULL, NULL, 'text', 'about', '主创介绍', 2),
  ('team_desc', NULL, NULL, 'text', 'about', '团队简述', 3),
  ('services', NULL, NULL, 'text', 'about', '业务范围', 4),
  ('areas', NULL, NULL, 'text', 'about', '服务区域', 5);

-- 默认隐私政策页
INSERT INTO page_contents (slug, title_zh, title_en, content_zh, content_en) VALUES
  ('privacy', '隐私政策', 'Privacy Policy', '隐私政策内容待填写...', 'Privacy policy content to be filled...');
```

### 3.3 RLS（Row Level Security）策略

```sql
-- supabase/migrations/00010_rls_policies.sql

-- 启用 RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE slug_redirects ENABLE ROW LEVEL SECURITY;

-- === 匿名用户（前端）策略 ===

CREATE POLICY "anon_read_settings" ON site_settings
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_active_slides" ON hero_slides
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "anon_read_categories" ON categories
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_published_projects" ON projects
  FOR SELECT TO anon USING (publish_status = 'published');

CREATE POLICY "anon_read_project_images" ON project_images
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
      AND projects.publish_status = 'published'
    )
  );

CREATE POLICY "anon_read_pages" ON page_contents
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_redirects" ON slug_redirects
  FOR SELECT TO anon USING (true);

-- translation_prompts: 匿名不可访问（无策略 = 默认拒绝）

-- === 认证用户（后台管理）策略 ===

CREATE POLICY "auth_full_access_settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_slides" ON hero_slides
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_images" ON project_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_prompts" ON translation_prompts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_pages" ON page_contents
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_full_access_redirects" ON slug_redirects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

### 3.4 Migration 管理策略

**工作流程**：

1. 使用 Supabase CLI 管理 Migration：`supabase migration new <name>`
2. 所有 Migration 文件纳入 Git 版本控制（`supabase/migrations/` 目录）
3. 本地开发使用 `supabase db reset` 重建数据库
4. 部署时通过 `supabase db push` 应用到远程

**类型生成**：

```bash
# 从远程 Supabase 项目生成 TypeScript 类型
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/database.ts
```

生成的类型在前后端均可使用，确保类型安全：

```typescript
// shared/types/database.ts（自动生成示例片段）
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title_zh: string
          title_en: string | null
          slug: string
          // ...完整字段
        }
        Insert: { /* ... */ }
        Update: { /* ... */ }
      }
      // ...其他表
    }
    Enums: {
      project_status_enum: 'designing' | 'constructing' | 'completed' | 'awarded'
      publish_status_enum: 'draft' | 'published' | 'archived'
      section_type_enum: 'project' | 'brand' | 'about' | 'contact' | 'hero' | 'general'
    }
  }
}
```

---

## 4. 前端架构方案

### 4.1 样式体系：Tailwind CSS 4 + K-M Fusion 设计令牌

```css
/* app/assets/css/main.css */

@import "tailwindcss";

/* 暗黑模式变体：使用 class 控制 */
@custom-variant dark (&:where(.dark, .dark *));

/* === K-M Fusion 设计令牌 === */
@theme {
  /* 品牌色 */
  --color-sandstone: #F2F0E9;          /* 砂岩色（明亮模式背景） */
  --color-deep-rock: #1A1A1A;          /* 深矿岩（暗黑模式背景） */
  --color-bronze: #B89352;             /* 古铜金（强调色） */
  --color-bronze-hover: #A07D3F;       /* 古铜金悬停 */
  --color-subtle-light: #595959;       /* 明亮模式辅助文字 */
  --color-subtle-dark: #999999;        /* 暗黑模式辅助文字 */
  --color-border-light: #E5E2DB;       /* 明亮模式边框 */
  --color-border-dark: #2A2A2A;        /* 暗黑模式边框 */
  --color-deep-rock-soft: #0D0D0D;     /* 品牌尾声深背景 */

  /* 字体 */
  --font-heading: "Cormorant Garamond", Georgia, serif;
  --font-sans: "Inter", "Helvetica Neue", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  --font-zh: "Noto Sans SC", "Source Han Sans SC", sans-serif;

  /* 字号（桌面端） */
  --text-h1: 3.5rem;       /* 56px */
  --text-h2: 2.25rem;      /* 36px */
  --text-h3: 1.5rem;       /* 24px */
  --text-body: 1.125rem;   /* 18px */
  --text-small: 0.875rem;  /* 14px */

  /* 间距（8px 网格） */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
  --spacing-section: 6rem; /* 96px - 模块间距 */

  /* 圆角 */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* 过渡 */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* 投影 */
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.1);
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* === 全局基础样式 === */
@layer base {
  body {
    @apply bg-sandstone text-deep-rock font-sans antialiased;
    @apply dark:bg-deep-rock dark:text-sandstone;
    font-feature-settings: "kern" 1;
  }

  hr {
    @apply border-border-light dark:border-border-dark;
    border-width: 0.5px;
  }

  h1, h2 {
    @apply font-heading;
    line-height: 1.15;
  }

  :lang(zh) {
    font-family: var(--font-zh), var(--font-sans);
  }
}

/* === 高棉装饰线条 === */
@layer components {
  .khmer-divider {
    @apply relative w-full h-px bg-border-light dark:bg-border-dark;
  }
  .khmer-divider::after {
    content: '';
    @apply absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2;
    @apply w-8 h-8 border border-bronze rotate-45 bg-sandstone dark:bg-deep-rock;
  }
}

/* === 页面过渡动画 === */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s var(--ease-smooth), transform 0.4s var(--ease-smooth);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 4.2 核心 Composables 设计

#### useSupabase.ts — Supabase 客户端

```typescript
// app/composables/useSupabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/shared/types/database'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  )
  return supabase
}
```

#### useTheme.ts — 明暗主题

优先级：手动切换 > 系统偏好 > 时区判断

```typescript
// app/composables/useTheme.ts
export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light')
  const manualOverride = useState<boolean>('themeManual', () => false)

  const initTheme = async () => {
    // 1. 检查 localStorage 手动偏好
    if (import.meta.client) {
      const saved = localStorage.getItem('said_theme')
      if (saved === 'light' || saved === 'dark') {
        theme.value = saved
        manualOverride.value = true
        applyTheme(saved)
        return
      }
    }
    // 2. 检查系统偏好
    if (import.meta.client && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark.matches) {
        theme.value = 'dark'
        applyTheme('dark')
        return
      }
      if (prefersDark.media !== 'not all') {
        theme.value = 'light'
        applyTheme('light')
        return
      }
    }
    // 3. 时区自动判断（从 site_settings 读取配置）
    const settings = await useSiteSettings()
    const tz = settings.timezone || 'Asia/Phnom_Penh'
    const dayStart = Number(settings.day_start_hour) || 6
    const dayEnd = Number(settings.day_end_hour) || 18
    const now = new Date()
    const hour = Number(now.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false }))
    const isDaytime = hour >= dayStart && hour < dayEnd
    theme.value = isDaytime ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme
    manualOverride.value = true
    if (import.meta.client) {
      localStorage.setItem('said_theme', newTheme)
    }
    applyTheme(newTheme)
  }

  const applyTheme = (t: 'light' | 'dark') => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', t === 'dark')
    }
  }

  return { theme, toggleTheme, initTheme }
}
```

#### useScrollSpy.ts — 滚动监听

```typescript
// app/composables/useScrollSpy.ts
export const useScrollSpy = (sectionIds: string[]) => {
  const activeSection = ref('')

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    onUnmounted(() => observer.disconnect())
  })

  return { activeSection }
}
```

#### useAnimation.ts — GSAP 动画

```typescript
// app/composables/useAnimation.ts
export const useAnimation = () => {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    prefersReducedMotion.value =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  const fadeInOnScroll = (el: HTMLElement, options = {}) => {
    if (prefersReducedMotion.value) return
    const { gsap, ScrollTrigger } = useNuxtApp().$gsap
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
      ...options,
    })
  }

  const kenBurns = (el: HTMLElement) => {
    if (prefersReducedMotion.value) return
    const { gsap } = useNuxtApp().$gsap
    gsap.fromTo(el,
      { scale: 1 },
      { scale: 1.05, duration: 8, ease: 'none', repeat: -1, yoyo: true }
    )
  }

  return { fadeInOnScroll, kenBurns, prefersReducedMotion }
}
```

#### useLocalizedField.ts — 多语言字段辅助

```typescript
// app/composables/useLocalizedField.ts
export const useLocalizedField = () => {
  const { locale } = useI18n()

  const l = (obj: any, field: string): string => {
    if (!obj) return ''
    const primary = locale.value === 'zh' ? `${field}_zh` : `${field}_en`
    const fallback = locale.value === 'zh' ? `${field}_en` : `${field}_zh`
    return obj[primary] || obj[fallback] || ''
  }

  return { l }
}
```

### 4.3 关键页面组件设计

#### 首页 pages/index.vue

```vue
<template>
  <div>
    <LoadingScreen v-if="isLoading" />
    <template v-else>
      <HeroSection :slides="heroSlides" />
      <FeaturedProjects :projects="featuredProjects" />
      <AboutSection :settings="aboutSettings" />
      <ContactSection :settings="contactSettings" />
      <BrandClosing :settings="brandSettings" />
    </template>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabase()

const { data: heroSlides } = await useAsyncData('hero-slides', () =>
  supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .then(({ data }) => data)
)

const { data: featuredProjects } = await useAsyncData('featured-projects', () =>
  supabase
    .from('projects')
    .select('*, category:categories(*)')
    .eq('publish_status', 'published')
    .eq('is_featured', true)
    .order('sort_order')
    .then(({ data }) => data)
)
</script>
```

#### 项目详情页 pages/project/[slug].vue

```vue
<template>
  <article v-if="project">
    <!-- 全屏封面 -->
    <section class="relative h-screen">
      <BaseImage :src="project.cover_url" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-black/40 flex items-end p-8 lg:p-16">
        <div>
          <StatusBadge :status="project.project_status" />
          <h1 class="font-heading text-h1 text-white mt-4">
            {{ l(project, 'title') }}
          </h1>
        </div>
      </div>
    </section>

    <ProjectInfo :project="project" />

    <section class="max-w-3xl mx-auto px-6 py-section">
      <p class="text-body leading-relaxed">{{ l(project, 'description') }}</p>
    </section>

    <ProjectGallery :images="project.project_images" />
    <SocialShare :project="project" />
    <RelatedProjects :current="project" :projects="relatedProjects" />
    <ProjectNav :current="project" />
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const supabase = useSupabase()
const { l } = useLocalizedField()

// slug 重定向检查
const { data: redirect } = await useAsyncData(`redirect-${slug}`, () =>
  supabase
    .from('slug_redirects')
    .select('new_slug')
    .eq('old_slug', slug)
    .single()
    .then(({ data }) => data)
)
if (redirect.value) {
  navigateTo(`/project/${redirect.value.new_slug}`, { redirectCode: 301 })
}

// 获取项目数据（含图片）
const { data: project } = await useAsyncData(`project-${slug}`, () =>
  supabase
    .from('projects')
    .select('*, category:categories(*), project_images(*)')
    .eq('slug', slug)
    .eq('publish_status', 'published')
    .single()
    .then(({ data }) => data)
)

if (!project.value) {
  throw createError({ statusCode: 404, message: 'Project not found' })
}

// SEO
useSeoMeta({
  ogTitle: l(project.value, 'title'),
  ogDescription: l(project.value, 'seo_description'),
  ogImage: project.value.og_image_url || project.value.cover_url,
})
</script>
```

### 4.4 布局设计

#### 前端默认布局

```vue
<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-screen bg-sandstone dark:bg-deep-rock transition-colors duration-300">
    <SkipNavigation />
    <AppHeader />
    <main id="main-content">
      <slot />
    </main>
    <AppFooter />
    <FloatingContact />
  </div>
</template>
```

#### 后台管理布局

```vue
<!-- app/layouts/admin.vue -->
<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <AdminSidebar :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <div class="flex-1 flex flex-col overflow-hidden">
      <AdminHeader />
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'auth' })
const sidebarCollapsed = ref(false)
</script>
```

---

## 5. 后台管理系统方案

### 5.1 认证流程

```
用户访问 /admin
    │
    ├── 未登录 → 重定向到 /admin/login
    │               │
    │               └── 输入邮箱+密码 → Supabase Auth signInWithPassword
    │                       │
    │                       ├── 成功 → 跳转 /admin（Dashboard）
    │                       └── 失败 → 显示错误提示
    │
    └── 已登录 → 直接展示 Dashboard
                    │
                    ├── 7 天 Token 自动刷新（onAuthStateChange）
                    └── Token 过期 → 自动重定向到 /admin/login
```

**认证中间件**：

```typescript
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return
  if (!to.path.startsWith('/admin')) return

  const supabase = useSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return navigateTo('/admin/login')
  }
})
```

### 5.2 后台页面结构

| 路由 | 页面 | 功能 |
|------|------|------|
| `/admin/login` | 登录页 | Supabase Auth 邮箱+密码登录 |
| `/admin` | 仪表盘 | 项目数量统计、最近编辑、快捷入口、Plausible 嵌入概览 |
| `/admin/settings` | 全局设置 | 分组 Tab：品牌 / 主题 / 联系 / 社交 / SEO / 关于 |
| `/admin/hero` | Hero 管理 | 轮播图列表、拖拽排序、添加/编辑/删除、启用/禁用 |
| `/admin/projects` | 项目列表 | 数据表格、状态筛选、批量操作 |
| `/admin/projects/new` | 新建项目 | 双语编辑器、图片上传、AI 翻译 |
| `/admin/projects/[id]` | 编辑项目 | 同上 + 发布工作流 + 预览 |
| `/admin/categories` | 分类管理 | 分类 CRUD、排序 |
| `/admin/translation` | 翻译设置 | 6 个板块的系统提示词编辑 |

### 5.3 项目编辑页核心交互

```
┌─ 项目编辑页面 ─────────────────────────────────────┐
│                                                      │
│  [← 返回列表]              [预览] [保存草稿] [发布]   │
│                                                      │
│  ┌─ 基本信息 ─────────────────────────────────────┐  │
│  │ 项目名称    [______中文______] [______英文_____]│  │
│  │ URL Slug    [luxury-villa-phnom-penh_________] │  │
│  │ 分类        [▼ 别墅 ]   地点   [______]       │  │
│  │ 面积        [______]   年份   [______]        │  │
│  │ 材质        [______中文______] [______英文_____]│  │
│  │ 项目状态    (●设计中 ○施工中 ○已竣工 ○已获奖)   │  │
│  │ 精选展示    [✓] 显示在首页精选轮播              │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ 封面图 ──────────────────────────────────────┐  │
│  │  [点击上传或拖拽图片]  建议 1920x1080 (16:9)    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ 设计理念 ──────────── [🤖 AI 翻译全部] ──────┐  │
│  │  中文                    │  英文                 │  │
│  │  [________________]      │  [________________]   │  │
│  │  [________________]      │  [________________]   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ 项目图片（拖拽排序） ────────────────────────┐  │
│  │  [+添加图片]                                    │  │
│  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐              │  │
│  │  │ img │ │ img │ │ img │ │ img │  ...          │  │
│  │  │ [×] │ │ [×] │ │ [×] │ │ [×] │              │  │
│  │  └─────┘ └─────┘ └─────┘ └─────┘              │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌─ SEO 设置（折叠面板） ────────────────────────┐  │
│  │  SEO 标题   [______中文______] [______英文_____]│  │
│  │  SEO 描述   [______中文______] [______英文_____]│  │
│  │  OG 图片    [上传/使用封面图]                    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  发布状态：[草稿 ▼]  排序权重：[0]                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 5.4 发布工作流

```typescript
const updatePublishStatus = async (projectId: string, newStatus: 'draft' | 'published' | 'archived') => {
  const supabase = useSupabase()
  const updateData: any = { publish_status: newStatus }

  // 首次发布时记录时间
  if (newStatus === 'published') {
    const { data: existing } = await supabase
      .from('projects')
      .select('published_at')
      .eq('id', projectId)
      .single()
    if (!existing?.published_at) {
      updateData.published_at = new Date().toISOString()
    }
  }

  await supabase.from('projects').update(updateData).eq('id', projectId)

  // 触发 ISR On-demand Revalidation
  if (newStatus === 'published' || newStatus === 'archived') {
    await $fetch('/api/revalidate', {
      method: 'POST',
      body: { secret: revalidateSecret, paths: ['/projects', `/project/${slug}`] },
    })
  }
}
```

### 5.5 预览功能

```typescript
// server/api/preview/[slug].get.ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const token = getQuery(event).token as string

  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('preview_token')
    .eq('slug', slug)
    .single()

  if (!project || project.preview_token !== token) {
    throw createError({ statusCode: 403, message: 'Invalid preview token' })
  }

  const { data } = await supabaseAdmin
    .from('projects')
    .select('*, category:categories(*), project_images(*)')
    .eq('slug', slug)
    .single()

  return data
})
```

---

## 6. 第三方服务集成方案

### 6.1 Cloudflare R2 图片存储

**Bucket 结构**：

```
said-assets/
├── hero/                      # Hero 轮播图
├── projects/{slug}/           # 项目图片（封面 + 展示图）
├── team/                      # 团队素材
└── brand/                     # 品牌素材（Logo 明/暗两版）
```

**上传流程（预签名 URL 方式，前端直传 R2）**：

```
后台前端                  Server API              Cloudflare R2
  │                         │                        │
  │  1. 请求预签名 URL       │                        │
  │ ──────────────────────> │                        │
  │                         │  2. 生成 Presigned URL  │
  │                         │ ─────────────────────> │
  │  3. 返回 Presigned URL  │                        │
  │ <────────────────────── │                        │
  │                         │                        │
  │  4. 直接上传文件到 R2    │                        │
  │ ────────────────────────────────────────────── > │
  │                         │                        │
  │  5. 上传完成，确认       │                        │
  │ ──────────────────────> │                        │
  │                         │  6. 验证文件存在         │
  │                         │ ─────────────────────> │
  │  7. 返回公开 URL         │                        │
  │ <────────────────────── │                        │
```

**服务端 R2 客户端**：

```typescript
// server/utils/r2.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const config = useRuntimeConfig()

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: config.r2Endpoint,
  credentials: {
    accessKeyId: config.r2AccessKeyId,
    secretAccessKey: config.r2SecretAccessKey,
  },
})

export const generatePresignedUrl = async (key: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: config.r2BucketName,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(r2Client, command, { expiresIn: 600 }) // 10分钟有效
}
```

**预签名 URL API**：

```typescript
// server/api/upload/presign.post.ts
export default defineEventHandler(async (event) => {
  // 认证检查（省略）

  const { fileName, contentType, folder } = await readBody(event)

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(contentType)) {
    throw createError({ statusCode: 400, message: 'Invalid file type' })
  }

  const ext = contentType.split('/')[1]
  const key = `${folder}/${Date.now()}-${fileName}.${ext}`

  const presignedUrl = await generatePresignedUrl(key, contentType)
  const publicUrl = `${config.public.r2PublicUrl}/${key}`

  return { presignedUrl, publicUrl, key }
})
```

### 6.2 DeepSeek API 翻译集成

```typescript
// server/api/translate.post.ts
export default defineEventHandler(async (event) => {
  // 认证检查（省略）

  const { texts, sectionType } = await readBody(event)
  // texts: Array<{ field: string, content: string }>
  // sectionType: 'project' | 'brand' | 'about' | ...

  const config = useRuntimeConfig()

  // 获取对应板块的翻译提示词
  const supabase = createServerSupabase(event)
  const { data: prompt } = await supabase
    .from('translation_prompts')
    .select('prompt_text')
    .eq('section_type', sectionType)
    .single()

  const systemPrompt = prompt?.prompt_text || '请将以下中文翻译为英文。'

  // 构造批量翻译请求
  const userContent = texts.map((t: any) =>
    `[${t.field}]\n${t.content}`
  ).join('\n\n---\n\n')

  // 调用 DeepSeek API（OpenAI 兼容格式）
  const response = await $fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.deepseekApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `请翻译以下中文内容为英文，保持 [字段名] 标记不变：\n\n${userContent}`
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    },
  })

  const translatedText = response.choices[0].message.content
  const results = parseTranslationResult(translatedText, texts)

  return { translations: results }
})
```

**分板块翻译提示词**：

| 板块类型 | 翻译风格 |
|---------|---------|
| project | 建筑/室内设计专业术语，简洁优雅 |
| brand | 品牌调性，诗意表达 |
| about | 专业简历风格 |
| contact | 商务正式风格 |
| hero | 精炼有力，品牌宣言感 |
| general | 默认通用风格 |

### 6.3 Plausible Analytics 集成

```typescript
// app/plugins/plausible.client.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  if (!config.public.plausibleDomain) return

  useHead({
    script: [
      {
        defer: true,
        'data-domain': config.public.plausibleDomain,
        'data-api': `${config.public.plausibleApiHost}/api/event`,
        src: `${config.public.plausibleApiHost}/js/script.js`,
      },
    ],
  })

  return {
    provide: {
      plausible: {
        trackEvent: (name: string, props?: Record<string, string>) => {
          if (window.plausible) {
            window.plausible(name, { props })
          }
        },
      },
    },
  }
})
```

**追踪事件清单**：

| 事件名 | 触发时机 | 属性 |
|--------|---------|------|
| `project_click` | 点击项目卡片 | `{ slug, title, source: 'home'/'archive' }` |
| `contact_click` | 点击联系按钮 | `{ type: 'telegram'/'whatsapp'/'email' }` |
| `language_switch` | 切换语言 | `{ from, to }` |
| `theme_switch` | 切换主题 | `{ theme: 'light'/'dark' }` |
| `share_click` | 点击社交分享 | `{ platform, slug }` |
| `view_all_projects` | 点击"查看所有项目" | `{ source: 'hero'/'featured' }` |

### 6.4 Google Maps 嵌入

```vue
<!-- ContactSection.vue 中的地图部分 -->
<div class="relative aspect-[4/3] rounded-md overflow-hidden">
  <iframe
    v-if="mapsUrl"
    :src="mapsUrl"
    class="absolute inset-0 w-full h-full border-0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    :title="$t('contact.mapTitle')"
    allow="fullscreen"
  />
</div>
```

嵌入 URL 从 `site_settings` 表的 `google_maps_embed` 键读取，后台可编辑。使用 `loading="lazy"` 延迟加载以优化性能。

---

## 7. 多语言方案

### 7.1 i18n 配置

```typescript
// i18n/i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en',
  missingWarn: false,
  fallbackWarn: false,
}))
```

### 7.2 多语言策略对照

| 类型 | 策略 | 说明 |
|------|------|------|
| UI 文字（按钮/标签/导航） | `@nuxtjs/i18n` JSON 文件 | 静态，跟随代码部署 |
| 数据库内容（项目/设置等） | `_zh` / `_en` 双字段 | 动态，后台管理 |

### 7.3 UI 翻译文件

```json
// i18n/locales/en.json
{
  "nav": {
    "projects": "Projects",
    "about": "About",
    "contact": "Contact"
  },
  "hero": {
    "viewProjects": "View Projects",
    "contactUs": "Contact Us"
  },
  "projects": {
    "title": "Our Projects",
    "all": "All",
    "viewAll": "View All Projects"
  },
  "project": {
    "location": "Location",
    "area": "Area",
    "year": "Year",
    "materials": "Materials",
    "status": "Status",
    "description": "Design Concept",
    "gallery": "Gallery",
    "related": "Related Projects",
    "prev": "Previous Project",
    "next": "Next Project",
    "backToHome": "Back to Home",
    "viewAll": "View All Projects"
  },
  "status": {
    "designing": "In Design",
    "constructing": "Under Construction",
    "completed": "Completed",
    "awarded": "Award Winning"
  },
  "contact": {
    "title": "Get in Touch",
    "mapTitle": "Our Office Location"
  },
  "footer": {
    "copyright": "© SAID {year}. All rights reserved.",
    "privacy": "Privacy Policy"
  },
  "error": {
    "notFound": "Page Not Found",
    "notFoundDesc": "The page you're looking for doesn't exist.",
    "backHome": "Back to Home"
  }
}
```

```json
// i18n/locales/zh.json
{
  "nav": {
    "projects": "项目",
    "about": "关于",
    "contact": "联系"
  },
  "hero": {
    "viewProjects": "查看作品",
    "contactUs": "联系我们"
  },
  "projects": {
    "title": "我们的项目",
    "all": "全部",
    "viewAll": "查看所有项目"
  },
  "project": {
    "location": "地点",
    "area": "建筑面积",
    "year": "设计年份",
    "materials": "主要材质",
    "status": "项目状态",
    "description": "设计理念",
    "gallery": "项目图集",
    "related": "相关项目",
    "prev": "上一个项目",
    "next": "下一个项目",
    "backToHome": "返回首页",
    "viewAll": "查看所有项目"
  },
  "status": {
    "designing": "设计中",
    "constructing": "施工中",
    "completed": "已竣工",
    "awarded": "已获奖"
  },
  "contact": {
    "title": "联系我们",
    "mapTitle": "办公室位置"
  },
  "footer": {
    "copyright": "© SAID {year}. 保留所有权利。",
    "privacy": "隐私政策"
  },
  "error": {
    "notFound": "页面未找到",
    "notFoundDesc": "您访问的页面不存在。",
    "backHome": "返回首页"
  }
}
```

### 7.4 翻译工作流

```
主创中文撰写 → 后台双语编辑器（左中文/右英文）
                      │
                      ├── 手动翻译：直接在英文栏填写
                      │
                      └── AI 辅助翻译：
                            │
                            ├── 点击"AI 翻译全部"按钮
                            ├── 后端取对应板块的 System Prompt
                            ├── 打包所有中文字段调用 DeepSeek API
                            ├── 翻译结果自动填入英文字段
                            └── 管理员校对修改后保存
```

### 7.5 hreflang 配置

`@nuxtjs/i18n` 的 `prefix_except_default` 策略会自动在 `<head>` 中生成 hreflang 标签：

```html
<link rel="alternate" hreflang="en" href="https://saidarch.com/project/luxury-villa" />
<link rel="alternate" hreflang="zh" href="https://saidarch.com/zh/project/luxury-villa" />
<link rel="canonical" href="https://saidarch.com/project/luxury-villa" />
```

---

## 8. 性能优化方案

### 8.1 图片优化

| 策略 | 实现方式 | 说明 |
|------|---------|------|
| 格式转换 | Nuxt Image `format: ['webp', 'avif']` | 自动转换为现代格式 |
| 响应式 | Nuxt Image `sizes` 属性 | 不同断点加载不同尺寸 |
| 懒加载 | `loading="lazy"` + 模糊占位 | 非首屏图片延迟加载 |
| 首屏 LCP | `<NuxtImg>` 的 `preload` 属性 | Hero 首张图 preload |
| 宽高比预设 | `aspect-ratio` CSS | 防止 CLS 布局偏移 |
| CDN 分发 | R2 自定义域名 + Cloudflare CDN | 全球就近节点 |

```vue
<!-- Hero 首张图（LCP 关键路径） -->
<NuxtImg
  :src="slides[0].image_url"
  width="1920" height="1080"
  format="webp" quality="85"
  preload
  sizes="100vw"
  class="w-full h-screen object-cover"
  :alt="slides[0].title_en || 'SAID Architecture'"
/>

<!-- 非首屏项目图片（懒加载） -->
<NuxtImg
  :src="image.url"
  loading="lazy"
  format="webp" quality="80"
  sizes="sm:100vw md:50vw lg:33vw"
  :placeholder="[20, 15, 75, 5]"
  class="aspect-[16/9] object-cover"
  :alt="image.caption || ''"
/>
```

### 8.2 字体加载策略

```
加载优先级：
1. Inter (导航+正文) → preload, font-display: swap
2. Cormorant Garamond (标题) → preload, font-display: swap
3. Noto Sans SC (中文) → 动态子集加载, font-display: swap
4. JetBrains Mono (数据) → 按需加载
5. Noto Sans Khmer (高棉) → V2 按需加载
```

### 8.3 缓存策略

| 资源 | 缓存策略 | 说明 |
|------|---------|------|
| SSG 页面 | Vercel Edge Cache, CDN 长缓存 | 构建时生成，CDN 直出 |
| ISR 页面 | `stale-while-revalidate`, 60s TTL | 过期后后台刷新 |
| R2 图片 | `Cache-Control: public, max-age=31536000` | 带 hash 文件名，永久缓存 |
| API 响应 | 不缓存 | 后台操作实时生效 |
| 字体 | Google Fonts CDN 自带缓存 | 浏览器长期缓存 |
| JS/CSS | Vercel 自动 hash 命名 + 长缓存 | 构建产物自动 hash |

### 8.4 On-demand Revalidation

```typescript
// server/api/revalidate.post.ts
export default defineEventHandler(async (event) => {
  const { secret, paths } = await readBody(event)

  if (secret !== useRuntimeConfig().revalidateSecret) {
    throw createError({ statusCode: 401, message: 'Invalid secret' })
  }

  for (const path of paths) {
    await useStorage('cache:nitro:routes').removeItem(path)
  }

  return { revalidated: true, paths }
})
```

### 8.5 性能目标

| 指标 | 目标 | 监测工具 |
|------|------|---------|
| Lighthouse Performance | >= 90 | Lighthouse CI |
| FCP | < 1.5s | Web Vitals |
| LCP | < 2.5s | Web Vitals |
| CLS | < 0.1 | Web Vitals |
| INP | < 200ms | Web Vitals |
| 首屏 JS Bundle | < 200KB (gzipped) | Nuxt Analyze |

---

## 9. SEO 方案

### 9.1 基础 SEO 配置

```typescript
// app.vue 中的全局 SEO
useHead({
  htmlAttrs: { lang: locale.value === 'zh' ? 'zh-CN' : 'en' },
  titleTemplate: (title) => title ? `${title} | SAID` : 'SAID | Summit Architecture & Interior Design',
})
```

### 9.2 JSON-LD 结构化数据

```typescript
useSchemaOrg([
  defineOrganization({
    name: 'SAID - Summit Architecture & Interior Design',
    alternateName: '上境设计',
    url: 'https://saidarch.com',
    logo: 'https://saidarch.com/logo.svg',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
    },
  }),
  defineLocalBusiness({
    name: 'SAID - Summit Architecture & Interior Design',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Phnom Penh',
      addressCountry: 'KH',
    },
    priceRange: '$$$',
  }),
])
```

### 9.3 Sitemap 动态生成

```typescript
// server/api/__sitemap__/urls.ts
export default defineSitemapEventHandler(async () => {
  const supabase = createServerSupabase()

  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('publish_status', 'published')

  const urls = []

  for (const p of projects || []) {
    urls.push({
      loc: `/project/${p.slug}`,
      lastmod: p.updated_at,
      changefreq: 'monthly',
      priority: 0.8,
      alternatives: [
        { hreflang: 'en', href: `https://saidarch.com/project/${p.slug}` },
        { hreflang: 'zh', href: `https://saidarch.com/zh/project/${p.slug}` },
      ],
    })
    urls.push({
      loc: `/zh/project/${p.slug}`,
      lastmod: p.updated_at,
      changefreq: 'monthly',
      priority: 0.8,
    })
  }

  return urls
})
```

### 9.4 robots.txt

```
User-Agent: *
Allow: /
Allow: /zh/
Allow: /projects
Allow: /zh/projects
Allow: /project/
Allow: /zh/project/
Disallow: /admin/
Disallow: /api/

Sitemap: https://saidarch.com/sitemap.xml
```

### 9.5 Open Graph 元数据

每个页面通过 `useSeoMeta()` 设置：

```typescript
useSeoMeta({
  title: project.seo_title_en || project.title_en,
  ogTitle: project.title_en,
  description: project.seo_description_en,
  ogDescription: project.seo_description_en,
  ogImage: project.og_image_url || project.cover_url,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})
```

### 9.6 Slug 重定向

```typescript
// server/middleware/slug-redirect.ts
export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const match = url.pathname.match(/^\/(zh\/)?project\/([^/]+)$/)

  if (match) {
    const slug = match[2]
    const supabase = createServerSupabase()
    const { data } = await supabase
      .from('slug_redirects')
      .select('new_slug')
      .eq('old_slug', slug)
      .single()

    if (data) {
      const prefix = match[1] || ''
      return sendRedirect(event, `/${prefix}project/${data.new_slug}`, 301)
    }
  }
})
```

---

## 10. 分阶段实施计划

### 阶段 1 — 基础搭建

**目标**：完成项目基础设施配置，建立开发环境。

| 序号 | 任务 | 具体内容 | 交付物 |
|------|------|---------|--------|
| 1.1 | 依赖安装与配置 | 安装 Tailwind CSS 4、GSAP、@nuxtjs/i18n、@nuxt/image、@nuxtjs/sitemap、@nuxtjs/robots | `package.json` 更新 |
| 1.2 | Tailwind CSS 4 设计令牌 | 配置 `main.css` 的 `@theme` 定义（K-M Fusion 设计系统） | `app/assets/css/main.css` |
| 1.3 | nuxt.config.ts 完整配置 | 路由规则、i18n、Nuxt Image、runtimeConfig、CSS 入口 | `nuxt.config.ts` |
| 1.4 | Supabase 初始化 | 创建项目，编写全部 Migration SQL，运行 `supabase db push`，执行种子数据 | `supabase/migrations/` |
| 1.5 | 类型生成 | `supabase gen types typescript` 生成数据库类型 | `shared/types/database.ts` |
| 1.6 | Supabase Auth 配置 | 创建管理员账户、配置密码重置邮件模板 | Supabase Dashboard |
| 1.7 | Cloudflare R2 配置 | 创建 Bucket `said-assets`、配置自定义域名、CORS | R2 Bucket 就绪 |
| 1.8 | 环境变量 | 创建 `.env.example`，配置本地 `.env` | `.env.example` |
| 1.9 | 核心 Composables | 实现 `useSupabase`、`useTheme`、`useSiteSettings`、`useLocalizedField` | `app/composables/` |
| 1.10 | i18n 配置 | 配置 i18n 模块、编写中英文 JSON 翻译文件 | `i18n/` |
| 1.11 | 布局文件 | 创建 `default.vue` 和 `admin.vue` 布局 | `app/layouts/` |
| 1.12 | GSAP 插件 | 注册 GSAP + ScrollTrigger 客户端插件 | `app/plugins/gsap.client.ts` |
| 1.13 | Plausible 集成 | 配置 Plausible 脚本注入 + 事件追踪 | `app/plugins/plausible.client.ts` |
| 1.14 | 服务端工具 | 服务端 Supabase Admin 客户端、R2 客户端 | `server/utils/` |

**验收标准**：

- [x] `npm run dev` 正常启动，Tailwind 样式生效
- [x] Supabase 数据库全部表和种子数据就位
- [x] RLS 策略生效（anon 只能读已发布数据）
- [x] i18n 路由切换正常（`/` 和 `/zh/`）
- [x] R2 预签名上传功能可用
- [x] 明暗主题切换功能可用

---

### 阶段 2 — 首页开发

**目标**：完成首页五大模块和全局导航。

| 序号 | 任务 | 具体内容 | 交付物 |
|------|------|---------|--------|
| 2.1 | 导航栏 | 桌面端固定导航 + 移动端汉堡菜单全屏抽屉 | `AppHeader.vue` |
| 2.2 | Hero 模块 | 全屏轮播（100vh）、暗色遮罩、CTA 按钮、向下箭头动画 | `HeroSection.vue`、`BaseCarousel.vue` |
| 2.3 | 精选项目模块 | 全屏切换式轮播、左右箭头、"View All" 按钮 | `FeaturedProjects.vue` |
| 2.4 | 关于模块 | 左侧头像 + 高棉纹样、右侧文案区 | `AboutSection.vue`、`KhmerPattern.vue` |
| 2.5 | 联系模块 | 联系信息卡片 + Google Maps 嵌入 | `ContactSection.vue` |
| 2.6 | 品牌尾声 + Footer | 深色背景 + Logo + Slogan + 社交图标 + 版权 | `BrandClosing.vue`、`AppFooter.vue` |
| 2.7 | 浮动咨询按钮 | 右下角按钮、展开/收起、#contact 时隐藏 | `FloatingContact.vue` |
| 2.8 | 首屏加载动画 | Logo 淡入淡出 | `LoadingScreen.vue` |
| 2.9 | 滚动监听 | 锚点导航高亮、URL hash 更新 | `useScrollSpy.ts` |
| 2.10 | 响应式适配 | Mobile/Tablet/Desktop 三端适配 | 各组件响应式样式 |
| 2.11 | 基础 UI 组件 | `BaseButton`、`BaseImage`、`StatusBadge` | `app/components/ui/` |

**验收标准**：

- [x] 首页五大模块完整展示，数据来源于 Supabase
- [x] 导航栏锚点导航 + 平滑滚动 + 高亮正确
- [x] 中英文切换内容正确
- [x] 明暗主题配色正确
- [x] 移动端/平板/桌面端布局合理
- [x] 轮播交互正常（自动播放、手动切换、滑动手势）
- [x] 浮动咨询按钮逻辑正确

---

### 阶段 3 — 项目页面 + 功能完善

**目标**：完成项目归档页、项目详情页及辅助功能。

| 序号 | 任务 | 具体内容 | 交付物 |
|------|------|---------|--------|
| 3.1 | 项目归档页 | 标题区域、分类筛选标签、响应式网格、项目卡片、悬停效果 | `pages/projects.vue` 及组件 |
| 3.2 | 项目详情页 | 全屏封面、信息卡片、设计理念、画廊、状态标签、相关推荐 | `pages/project/[slug].vue` 及组件 |
| 3.3 | 图片灯箱 | 点击放大、左右切换、Esc 关闭、焦点陷阱 | `Lightbox.vue` |
| 3.4 | 社交分享 | Facebook/X/TikTok 分享按钮 | `SocialShare.vue` |
| 3.5 | Slug 重定向 | 服务端 middleware 301 重定向 | `server/middleware/slug-redirect.ts` |
| 3.6 | 预览功能 | 草稿项目通过带 token 的 URL 预览 | `server/api/preview/[slug].get.ts` |
| 3.7 | 404 页面 | K-M Fusion 风格 404 页面 | `pages/[...slug].vue`、`error.vue` |
| 3.8 | 隐私政策页 | 静态内容页面 | `pages/privacy.vue` |
| 3.9 | 无障碍实现 | Skip Navigation、键盘导航、aria 标签、reduced motion | 各组件 |
| 3.10 | 页面状态保持 | 归档页→详情页→返回：保持滚动位置和筛选 | `keepalive` / `sessionStorage` |

**验收标准**：

- [x] 归档页分类筛选平滑过滤、网格正确
- [x] 详情页完整展示所有字段，画廊交互正常
- [x] 灯箱键盘可操作、焦点陷阱正确
- [x] Slug 变更后旧 URL 301 跳转
- [x] 草稿预览功能可用
- [x] 404 页面正确展示
- [x] 键盘导航全程可用
- [x] `prefers-reduced-motion` 下动画关闭

---

### 阶段 4 — 后台管理系统

**目标**：完成完整的后台管理系统。

| 序号 | 任务 | 具体内容 | 交付物 |
|------|------|---------|--------|
| 4.1 | 登录页 | Supabase Auth 登录、错误提示 | `pages/admin/login.vue` |
| 4.2 | 认证中间件 | 路由守卫、Token 刷新、过期重定向 | `middleware/auth.ts` |
| 4.3 | 管理布局 | 侧边栏（240px）+ 顶部栏 + 内容区 | `layouts/admin.vue` 及组件 |
| 4.4 | Dashboard | 统计概览、最近编辑、快捷入口、Plausible 嵌入 | `pages/admin/index.vue` |
| 4.5 | 全局设置 | 分组 Tab、双语编辑、图片上传 | `pages/admin/settings.vue` |
| 4.6 | Hero 管理 | 列表、拖拽排序、CRUD、启用/禁用 | `pages/admin/hero.vue` |
| 4.7 | 项目列表 | 数据表格、筛选、批量操作 | `pages/admin/projects/index.vue` |
| 4.8 | 项目编辑 | 双语编辑器、图片上传、SEO、Slug 管理 | `pages/admin/projects/[id].vue` |
| 4.9 | 发布工作流 | 草稿/已发布/已下线状态切换 + ISR Revalidation | `PublishWorkflow.vue` |
| 4.10 | 预览按钮 | 生成 token、新窗口打开预览 | `PreviewButton.vue` |
| 4.11 | AI 翻译 | "一键翻译全部"、DeepSeek API 调用 | `TranslateButton.vue`、`server/api/translate.post.ts` |
| 4.12 | 翻译设置 | 6 个板块提示词编辑 | `pages/admin/translation.vue` |
| 4.13 | 分类管理 | CRUD、排序 | `pages/admin/categories.vue` |
| 4.14 | 图片上传 | R2 预签名上传、进度条、预览、删除 | `ImageUploader.vue`、`server/api/upload/` |
| 4.15 | 忘记密码 | Supabase Auth 密码重置 | 登录页"忘记密码"链接 |

**验收标准**：

- [x] 登录/登出正常、Token 自动刷新
- [x] 全局设置所有字段可编辑保存
- [x] Hero 轮播图可增删改排序
- [x] 项目完整 CRUD，图片上传至 R2
- [x] 发布工作流正确
- [x] AI 翻译功能正常
- [x] 提示词可自定义
- [x] Slug 修改时旧 slug 自动记录
- [x] 变更后 ISR 缓存刷新

---

### 阶段 5 — 打磨与上线

**目标**：动画打磨、性能优化、SEO 完善、部署上线。

| 序号 | 任务 | 具体内容 | 交付物 |
|------|------|---------|--------|
| 5.1 | GSAP 动画 | 滚动渐入、Ken Burns、悬停放大、高棉视差、页面转场 | 各组件动画 |
| 5.2 | 字体加载 | preload + 动态子集 + font-display: swap | head 配置 |
| 5.3 | SEO 配置 | JSON-LD、sitemap.xml、robots.txt、OG、hreflang | SEO 文件和配置 |
| 5.4 | 性能优化 | Lighthouse 审计、LCP/CLS/INP 达标、Bundle 瘦身 | Lighthouse >= 90 |
| 5.5 | 响应式测试 | iPhone SE ~ iPad Pro ~ 27" iMac 全设备 | 测试报告 |
| 5.6 | 浏览器兼容 | Chrome/Edge/Safari/Firefox 最新 2 版本 | 测试报告 |
| 5.7 | Vercel 部署 | 项目导入、环境变量、域名绑定、SSL | 线上地址 |
| 5.8 | 域名配置 | DNS 解析、R2 自定义域名 | 域名生效 |
| 5.9 | 内容填充 | Hero 图片、6-10 个项目、品牌信息、联系信息 | 内容就位 |
| 5.10 | 最终验收 | 全流程走查、Edge Case 测试、内容校对 | 验收通过 |

**验收标准**：

- [x] Lighthouse Performance/Accessibility/SEO 均 >= 90
- [x] Core Web Vitals 全部达标
- [x] 金边 4G 网络环境下首屏加载 < 3s
- [x] 所有动画流畅，reduced-motion 下关闭
- [x] 所有页面中英文内容正确
- [x] sitemap.xml 包含所有页面和图片
- [x] Plausible 数据正常采集
- [x] 正式域名可访问，HTTPS 正常

---

## 11. 部署方案

### 11.1 Vercel 部署配置

```json
{
  "framework": "nuxtjs",
  "buildCommand": "nuxt build",
  "outputDirectory": ".output",
  "regions": ["sin1"]
}
```

**部署区域**：`sin1`（新加坡），是距离柬埔寨最近的 Vercel Edge 节点。

### 11.2 环境变量分环境管理

| 变量 | Production | Preview | Development |
|------|-----------|---------|-------------|
| `NUXT_PUBLIC_SITE_URL` | `https://saidarch.com` | `https://preview-xxx.vercel.app` | `http://localhost:3000` |
| 其他变量 | 正式值 | 同 Production 或测试值 | 本地 `.env` |

### 11.3 域名配置

```
saidarch.com        → CNAME → cname.vercel-dns.com
www.saidarch.com    → CNAME → cname.vercel-dns.com（Vercel 自动 301 到非 www）
assets.saidarch.com → CNAME → R2 Bucket 自定义域名
```

### 11.4 CI/CD 流程

```
Git Push to main
       │
       ├── Vercel 自动构建部署（Production）
       │       │
       │       ├── nuxt build
       │       ├── 静态页面预渲染（SSG）
       │       └── Serverless Functions 部署
       │
       └── PR 自动创建 Preview 部署
               │
               └── 每个 PR 独立预览 URL
```

### 11.5 部署前检查清单

- [ ] 所有环境变量已配置
- [ ] Supabase 数据库 Migration 已应用
- [ ] RLS 策略已启用
- [ ] R2 Bucket CORS 已配置允许 `saidarch.com`
- [ ] 管理员账户已创建
- [ ] robots.txt 正确屏蔽 `/admin/` 和 `/api/`
- [ ] DNS 记录已配置
- [ ] SSL 证书已签发（Vercel 自动）

---

## 12. 质量保障

### 12.1 代码规范

| 工具 | 用途 |
|------|------|
| ESLint | JavaScript/TypeScript/Vue 代码检查（`@nuxt/eslint-config`） |
| Prettier | 代码格式化（2 space, single quote, trailing comma） |
| TypeScript | 类型检查（`strict: true`） |
| `supabase gen types` | 数据库类型安全 |

### 12.2 测试策略

| 层级 | 工具 | 覆盖范围 | V1 优先级 |
|------|------|---------|----------|
| 组件测试 | Vitest + Vue Test Utils | 关键 UI 组件 | 中 |
| E2E 测试 | Playwright | 核心用户流程 | 低（手动测试为主） |
| API 测试 | Vitest | 服务端 API | 中 |
| 视觉回归 | Lighthouse CI | 性能/SEO/无障碍评分 | 高 |
| 手动测试 | Checklist | 全设备全浏览器全流程 | 高 |

> V1 以手动测试 + Lighthouse CI 为主。自动化测试在项目稳定后逐步补充。

### 12.3 上线前质量检查清单

**功能检查**：

- [ ] 首页五大模块正常展示（中文/英文）
- [ ] Hero 轮播自动播放、手动切换、移动端滑动
- [ ] 精选项目全屏切换、点击进入详情
- [ ] 项目归档页分类筛选正常
- [ ] 项目详情页所有字段展示、图片画廊、灯箱
- [ ] 语言切换保持当前页面
- [ ] 主题切换全页面配色正确
- [ ] 浮动咨询按钮展开/收起/隐藏
- [ ] 404 页面正确展示
- [ ] 后台所有 CRUD 操作正常
- [ ] AI 翻译功能正常
- [ ] 图片上传到 R2 正常
- [ ] 发布工作流正确

**性能检查**：

- [ ] Lighthouse Performance >= 90
- [ ] Lighthouse Accessibility >= 90
- [ ] Lighthouse SEO >= 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

**SEO 检查**：

- [ ] sitemap.xml 可访问且包含所有页面
- [ ] robots.txt 正确配置
- [ ] 每个页面有独立 title/description
- [ ] JSON-LD 结构化数据正确
- [ ] hreflang 标签正确
- [ ] OG 图片可正常预览

---

## 附录 A：V1 / V2 范围对照表

| 功能 | V1 | V2 | 说明 |
|------|:--:|:--:|------|
| 首页五大模块 | ✅ | — | 完整实现 |
| 项目归档页（类型筛选） | ✅ | — | V1 仅类型筛选 |
| 项目归档页（地点筛选） | — | ✅ | V2 按需添加 |
| 项目详情页 | ✅ | — | 完整实现 |
| 项目状态标签 | ✅ | — | 设计中/施工中/已竣工/已获奖 |
| 项目里程碑时间线 | — | ✅ | V2 实现 |
| 中英双语 | ✅ | — | 完整实现 |
| 高棉语 | — | ✅ | 数据库字段已预留 `_km` |
| 明暗主题切换 | ✅ | — | 手动 > 系统 > 时区 |
| 后台管理系统 | ✅ | — | 完整实现 |
| AI 翻译（DeepSeek） | ✅ | — | 批量翻译 + 分板块提示词 |
| Hero 视频背景 | — | ✅ | V1 仅图片 |
| 数据统计动画计数器 | — | ✅ | 项目数/面积/年限 |
| 图片防护 | — | ✅ | 防盗链/水印 |
| 多管理员权限 | — | ✅ | V1 单管理员 |
| 在线咨询表单 | — | ✅ | V1 用 Telegram/WhatsApp |
| 错误监控 | — | — | Vercel Function Logs 够用 |

---

## 附录 B：关键技术决策备忘

1. **Supabase JS Client vs 直连数据库**：PostgREST 代理层自动管理连接池，Serverless 部署零配置；RLS 天然可用；`supabase gen types` 提供完整类型安全。

2. **Cloudflare R2 vs Supabase Storage**：R2 零出站流量费，建筑设计网站图片量大、高清图多，流量成本差异显著；Cloudflare CDN 东南亚节点覆盖优秀。

3. **ISR 60 秒**：在"近实时更新"和"CDN 缓存效率"间取得平衡。配合 On-demand Revalidation，后台操作时主动清缓存，实际更新延迟接近 0。

4. **`prefix_except_default` i18n 策略**：英文为默认语言时 URL 最简洁（`/project/xxx`），中文加 `/zh/` 前缀，符合国际站点惯例，SEO 友好。

5. **Tailwind CSS 4 `@theme` vs `tailwind.config.ts`**：Tailwind CSS 4 推荐使用 CSS 原生的 `@theme` 指令定义设计令牌，性能更好，与 CSS 变量无缝集成，支持暗黑模式运行时切换。

---

**SAID | 上境设计 | 实施方案 V1.0 | 2026.02.24**
**基于需求文档 V4.2 Final**
