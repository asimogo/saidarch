# SAID | 上境设计

## Summit Architecture & Interior Design

# 官方网站需求文档 Official Website Requirements Document

**版本：V4.2 Final**
**架构：单页主体 + 项目详情子页 | 参考：Studio MEMM**
**更新日期：2026年2月24日**
**核心理念：Less is More, but with Local Soul.**

---

## 1. 架构决策摘要 Architecture Decisions

基于对 Studio MEMM（studiomemm.com.br）的参考分析和多轮讨论，确认以下核心架构决策：

| 决策项 | 结论 | 说明 |
|--------|------|------|
| 网站架构 | 单页主体 + 项目详情子页 | 首页一镜到底滚动浏览，仅项目详情为独立页面 |
| 导航方式 | 混合式 | 首页用锚点导航滚动到对应模块，项目详情为独立路由 |
| 新闻/动态 | 不做 | 砍掉新闻模块，项目里程碑融入项目详情页 |
| 团队展示 | 主创突出 + 团队一句话 | 不做独立团队版块，融入首页"关于"模块 |
| "关于"页 | 融入首页 | 不做独立 /about 子页，作为首页一个滚动模块 |
| 参考标杆 | Studio MEMM | 布局参照：单页模块化结构、全屏视觉驱动、极简导航 |
| UI/UX 风格 | K-M Fusion（高棉现代融合） | 布局学 MEMM，灵魂属高棉 |
| 后台管理 | 第一期完整实现 | 侧边栏导航布局（Sidebar Layout），基于 Supabase Auth |
| 默认语言 | 英文 | `/` 显示英文，`/zh/` 显示中文 |
| 数据库客户端 | Supabase JS Client | 通过 PostgREST API 操作数据库，`supabase gen types` 生成类型，天然兼容 RLS |
| 图片存储 | Cloudflare R2 | 零流量费，适合大量高清建筑图片 |
| AI 翻译 | DeepSeek API | 中文→英文批量翻译，不同板块可自定义提示词 |
| 咨询表单 | 不做 | 柬埔寨客户习惯 Telegram/WhatsApp 直接联系，表单反而增加摩擦 |
| 数据分析 | Plausible | 轻量隐私友好、无需 Cookie 同意弹窗、可自托管 |
| 内容工作流 | 草稿→预览→发布 | 新项目默认草稿，支持预览查看前端效果，确认后发布 |
| 项目里程碑 | V1 仅状态标签 | V1 只显示状态标签（设计中/施工中/已竣工/已获奖），时间线功能 V2 实现 |
| 归档页筛选 | V1 仅类型筛选 | V1 只做类型筛选，地点筛选 V2 按需添加 |
| 错误监控 | 不做（Vercel Logs 够用） | 小型展示站无复杂用户交互，Vercel 自带 Function Logs 足够监控 API 错误 |

---

## 2. 品牌信息 Brand Profile

| 属性 | 内容 |
|------|------|
| 中文名 | 上境设计 |
| 英文名 | SAID (Summit Architecture & Interior Design) |
| 定位 | 小而美、高产值、高棉现代融合风格 |
| 团队 | 以主创设计师为核心的中柬跨国小型精英团队（3-5人） |
| 核心业务 | 豪宅别墅 / 精品办公 / 星级酒店 / 高端公寓 |
| 业务区域 | 金边 (Phnom Penh) & 西港 (Sihanoukville) |
| 目标受众 | 在柬中国人/华人 及 柬埔寨本地客户（两者兼顾） |

---

## 3. 站点结构 Site Structure

### 3.1 整体架构

网站采用单页主体架构，参考 Studio MEMM 的一镜到底沉浸式体验：

| 页面 | URL | 说明 |
|------|-----|------|
| 首页（单页主体） | `/` | 英文版，包含所有核心模块，垂直滚动浏览 |
| 首页（中文） | `/zh/` | 中文版首页 |
| 项目归档页 | `/projects` | 所有已发布项目的网格列表，支持分类筛选 |
| 项目归档页（中文） | `/zh/projects` | 中文版项目归档 |
| 项目详情页 | `/project/:slug` | 英文版，沉浸式展示单个项目 |
| 项目详情页（中文） | `/zh/project/:slug` | 中文版项目详情 |
| 隐私政策 | `/privacy` | 英文版隐私政策 |
| 隐私政策（中文） | `/zh/privacy` | 中文版隐私政策 |
| 404 页面 | `*` | 统一错误页面 |
| 后台管理 | `/admin/*` | 管理员后台（不区分语言） |

### 3.2 首页模块结构（从上到下）

参考 MEMM 首页的模块化长页结构，首页由 5 个核心模块组成：

| 模块 | 锚点 ID | 导航菜单对应 | 核心内容 |
|------|---------|-------------|---------|
| A. Hero | `#hero` | — (首屏) | 全屏视觉冲击 + 品牌宣言 |
| B. 精选项目 | `#projects` | "Projects" / "项目" | 全屏切换式项目展示 |
| C. 关于 | `#about` | "About" / "关于" | 主创介绍 + 团队简述 + 业务范围 |
| D. 联系 | `#contact` | "Contact" / "联系" | 联系方式 + 地图 |
| E. 品牌尾声 | — | — | Logo + Slogan + 社交链接 |

### 3.3 导航设计

**桌面端导航栏**

参考 MEMM 的极简顶部导航，固定在顶部，滚动时背景变为半透明：

| 左侧 | 中间 | 右侧 |
|------|------|------|
| Logo（SAID），点击回到顶部 | 锚点导航：Projects / About / Contact | 语言切换 (EN \| 中) + 主题切换 (☉/☽) |

- 菜单项悬停时古铜金下划线效果
- 当前所在模块对应的菜单项自动高亮（滚动监听）

**移动端导航**

- 顶部：Logo（左）+ 快捷图标（Telegram/WhatsApp，右）+ 汉堡菜单
- 点击汉堡菜单：全屏遮罩抽屉，包含锚点导航 + 语言切换 + 主题切换
- 点击菜单项后自动关闭抽屉，平滑滚动到目标模块

**Footer**

- Logo + 品牌 Slogan
- 联系信息：Telegram / WhatsApp / Email / 地址
- 社交媒体图标：Instagram / Facebook / TikTok
- 版权信息：© SAID 2026

---

## 4. 首页模块详细设计 Homepage Modules

### 4.1 Module A：Hero 全屏视觉冲击 (#hero)

参考 MEMM 首屏的全屏图片 + 向下箭头引导设计：

- 全屏占比（100vh）的强视觉背景：**图片轮播**（第一期不支持视频）
- 覆盖半透明暗色遮罩层，确保文字可读性
- 展示内容：Logo + 主标题 + 副标题（均可后台管理）
- CTA 按钮："查看作品"（滚动到 #projects）+ "联系我们"（滚动到 #contact）
- 底部向下箭头动画引导滚动（参考 MEMM）
- 轮播自动播放 + 底部圆点指示器 + 移动端支持左右滑动

### 4.2 Module B：精选项目展示 (#projects)

首页最核心的模块。参考 MEMM 的横向切换全屏项目展示：

- 展示方式：全屏切换式轮播，每个项目占满全屏
- 每个项目卡片显示：全屏背景图 + 项目名称 + 年份/地点
- 点击进入项目详情页（/project/:slug）
- 展示 6-10 个精选项目，后台可管理"精选"标记和排序
- 左右箭头切换 + 底部进度指示器
- 移动端：支持左右滑动手势切换
- 轮播末尾或模块底部显示 **"View All Projects"** 按钮，跳转到项目归档页（`/projects`）

### 4.3 Module C：关于 SAID (#about)

参考 MEMM 的"关于我们"块，融合主创介绍和团队信息：

**左侧：视觉区域**
- 主创设计师专业头像（大幅展示）
- 可配合高棉几何纹样装饰元素（CSS/SVG 代码生成）

**右侧：文案区域**
- 主创介绍：姓名、教育背景、专业经历、设计理念（150-200字）
- 团队简述：一句话带过
- 业务范围简述：豪宅别墅 / 精品办公 / 星级酒店 / 高端公寓
- 服务区域：金边 & 西港

> 以上所有文案均可通过后台管理编辑（中/英文）

### 4.4 Module D：联系我们 (#contact)

参考 MEMM 底部的联系入口设计：

**左侧：联系信息卡片**
- Telegram（可点击跳转）
- WhatsApp（可点击跳转）
- Email（可点击 mailto）
- 办公地址

**右侧：Google Maps 嵌入地图**（显示办公地址位置）

- 移动端：上下排列，联系信息在上，地图在下

### 4.5 Module E：品牌尾声 + Footer

参考 MEMM 底部的 Logo + 品牌语句设计：

- 深色背景区域（明亮模式用 #1A1A1A，暗黑模式用 #0D0D0D）
- 居中显示 SAID Logo + 品牌 Slogan
- 社交媒体图标链接
- 版权信息

---

## 5. 项目详情页 Project Detail (/project/:slug)

唯一的子页面，提供沉浸式的项目展示体验。

### 5.1 页面结构

- 顶部全屏封面图 + 项目名称叠加显示
- 返回首页按钮（或通过导航栏 Logo 返回）

### 5.2 项目信息卡片

| 字段 | 说明 |
|------|------|
| 项目名称 | 中/英文 |
| 项目类型 | 别墅 / 办公 / 酒店 / 公寓 |
| 地点 | 金边 / 西港 |
| 建筑面积 | 如 450㎡ |
| 设计年份 | 如 2025 |
| 主要材质 | 如 混凝土、柚木、大理石 |
| 项目状态 | 设计中 / 施工中 / 已竣工 / 已获奖 |

### 5.3 设计理念

- 100-200 字的设计说明文字（中/英文）
- 可包含设计灵感、空间理念、材质逻辑等

### 5.4 图片画廊

- 5-15 张实景/效果图，大幅展示
- 支持点击放大查看（Lightbox 效果）
- 移动端支持左右滑动浏览
- 图片懒加载 + 渐进式加载

### 5.5 项目状态标签

- 项目名称旁显示当前状态标签（设计中 / 施工中 / 已竣工 / 已获奖）

> 时间线功能（设计启动→方案确认→施工开始→竣工→获奖等关键节点）移至 V2 实现

### 5.6 相关项目推荐

- 详情页底部展示 2-3 个相关项目卡片（同类型或同地点）
- 以缩略图 + 项目名称 + 年份展示，点击可直接进入

### 5.7 社交分享与导航

- 社交分享按钮：Facebook / X / TikTok
- 上一个 / 下一个项目导航
- "返回首页"按钮 / "查看所有项目"按钮
- 自动生成 Open Graph 元数据（标题 + 描述 + 封面图）

---

## 5B. 项目归档页 Projects Archive (/projects)

首页精选轮播的延伸，展示所有已发布项目。

### 5B.1 页面结构

- 顶部标题区域："Our Projects" / "我们的项目"
- 分类筛选栏（横向标签式）
- 项目网格展示

### 5B.2 分类筛选

- 筛选标签：全部 / 别墅 / 办公 / 酒店 / 公寓（从后台 `categories` 表动态读取）
- 点击标签平滑过滤，无需刷新页面
- 分类由后台管理，可扩展（未来新增"商业空间""展览空间"等无需改代码）

> 地点筛选（金边 / 西港）移至 V2 按需添加

### 5B.3 项目网格

- 2-3 列响应式网格（移动端 1 列，平板 2 列，桌面 3 列）
- 每个卡片：封面图 + 项目名称 + 类型标签 + 年份
- 悬停效果：图片微放大 + 信息叠加淡入
- 点击进入项目详情页
- 按后台排序或按年份倒序排列

---

## 6. 功能需求 Functional Requirements

### 6.1 多语言 (i18n)

**语言支持**
- 第一期：英文（默认）、中文
- 预留：高棉语（数据库字段预留 `_km` 后缀，i18n 路由预留 `/km/` 前缀）

**URL 方案**
- `/` → 英文首页（默认语言）
- `/zh/` → 中文首页
- `/project/:slug` → 英文项目详情
- `/zh/project/:slug` → 中文项目详情
- 语言切换时 URL 自动变化，保持当前页面位置

**切换方式**
- 导航栏右侧 EN | 中 切换

**内容策略**
- 主语言：中文（主创以中文思考和撰写内容）
- 翻译方向：中文 → 英文
- 后台编辑界面：并排双语编辑器（左中文/右英文）
- 中文字段为必填，英文字段可选（未填写时前端显示中文 fallback）
- 集成 DeepSeek API 批量翻译辅助（详见第 8.4 节）

### 6.2 主题切换（明亮 / 暗黑模式）

**配色方案**

| 属性 | 明亮模式 | 暗黑模式 |
|------|---------|---------|
| 背景色 | #F2F0E9 (砂岩色) | #1A1A1A (深矿岩) |
| 文字主色 | #1A1A1A | #F2F0E9 |
| 强调色 | #B89352 (古铜金) | #B89352 (古铜金) |
| 辅助文字 | #595959 | #999999 |
| 边框/分割 | #E5E2DB | #2A2A2A |

**自动切换逻辑（优先级从高到低）**

1. **用户手动切换** → 记住偏好（localStorage），最高优先级
2. **系统偏好检测** → 首次访问时检测 `prefers-color-scheme`
3. **时区自动判断** → 如系统无偏好，根据后台设定的时区判断（白天明亮/夜晚暗黑）

**后台可配置**
- 时区选择（默认 Asia/Phnom_Penh，即 UTC+7）
- 日间时段设定（默认 6:00-18:00）
- 可根据业务需要调整为其他时区

**交互**
- 导航栏太阳/月亮图标切换

### 6.3 响应式设计（Mobile First）

| 断点 | 尺寸 | 说明 |
|------|------|------|
| Mobile | < 768px | 单栏布局，汉堡菜单，全屏图片，触摸手势 |
| Tablet | 768-1024px | 双栏网格，简化导航 |
| Desktop | > 1024px | 多栏网格，完整导航栏，悬停效果 |

- 触摸友好：所有可点击区域最小 44x44px
- 图片懒加载 + 渐进式加载（模糊占位 → 高清图）
- 全屏项目卡片支持左右滑动手势切换

### 6.4 交互动画

- 平滑滚动：锚点导航平滑滚动到目标模块（smooth scroll）
- 滚动进入动画：元素进入视口时从下方淡入（Intersection Observer + GSAP）
- 图片加载：渐进式显示 + 模糊占位
- Hero 轮播：平滑切换 + Ken Burns 微微缩放
- 项目卡片：悬停时图片微微放大 + 信息叠加淡入
- 高棉装饰元素：随滚动微微视差移动（Parallax，GSAP ScrollTrigger）
- 页面转场：首页→项目详情时平滑过渡动画

**页面状态保持**

- 项目归档页 → 详情页 → 返回归档页：保持之前的滚动位置和筛选状态（使用 `keepalive` 或 sessionStorage）
- 语言切换时保持当前滚动位置（锚点不变）
- 首页锚点导航时更新 URL hash（如 `/#projects`），支持直接分享链接到特定模块

### 6.5 SEO

- 每页独立的 title / description / keywords
- JSON-LD 结构化数据（Organization + LocalBusiness）
- 自动 sitemap.xml（含多语言版本）+ robots.txt
- 项目详情页自动生成 Open Graph 元数据（每种语言独立）
- URL 语义化：/project/luxury-villa-phnom-penh
- **多语言 SEO**：每个页面的 `<head>` 中输出 `hreflang` 标签，声明中英文页面的对应关系（如 `<link rel="alternate" hreflang="en" href="/project/xxx" />` 和 `<link rel="alternate" hreflang="zh" href="/zh/project/xxx" />`），确保 Google 正确索引双语内容
- **Canonical URL**：每个语言版本页面的 `<link rel="canonical">` 指向自身 URL
- **robots.txt**：明确屏蔽 `/admin/*`、`/api/*`，允许 `/`、`/zh/`、`/projects`、`/project/*`
- **图片 Sitemap**：自动生成 `sitemap-images.xml`，包含所有项目图片（URL + 标题 + 描述），提升 Google 图片搜索曝光
- **Slug 重定向**：如果项目 slug 在后台被修改，自动保存旧 slug 并配置 301 重定向

### 6.6 浮动咨询按钮

- 页面右下角常驻显示浮动咨询按钮（Telegram 或 WhatsApp 图标）
- 桌面端：悬停展开显示 Telegram + WhatsApp 两个选项
- 移动端：点击展开选项
- 滚动到 `#contact` 模块时自动隐藏（避免重复）
- 按钮样式：古铜金圆形图标，轻柔投影，与 K-M Fusion 风格一致
- 链接从后台全局设置读取

### 6.7 404 错误页面

- 统一的 404 页面设计，风格与主站一致（K-M Fusion）
- 显示 SAID Logo + "页面未找到" 提示
- 提供返回首页按钮
- 支持中英文

### 6.8 加载状态

- 首屏加载：全屏 SAID Logo 淡入淡出动画
- 图片加载：模糊占位（blur placeholder）→ 渐进式高清
- 页面切换：平滑过渡动画
- 后台管理页面：简洁的加载指示器

### 6.9 浏览器兼容性

- Chrome/Edge 最新 2 个版本
- Safari 最新 2 个版本（含 iOS Safari）
- Firefox 最新 2 个版本
- 不支持 IE

### 6.10 数据分析（Plausible）

- 集成 Plausible Analytics（Cloud 或自托管）
- 追踪事件：页面浏览、项目点击、联系按钮点击、语言切换、主题切换
- 轻量脚本 < 1KB，不影响性能
- 无需 Cookie 同意弹窗（Plausible 不使用 Cookie）
- 后台 Dashboard 可嵌入 Plausible 统计概览（iframe embed）

### 6.11 无障碍 Accessibility

- 目标：WCAG 2.1 AA 基础合规
- 键盘导航：所有交互元素可通过 Tab/Enter/Space 操作
- 轮播组件：`aria-label`、`aria-roledescription="carousel"`、暂停按钮
- 图片 `alt` 文本：项目图由后台填写 `caption` 字段兼做 alt
- `prefers-reduced-motion`：检测到后关闭所有 GSAP 动画，改为直接显示
- Lightbox 弹窗：焦点陷阱（Focus Trap），Esc 关闭，箭头键切换
- 颜色对比度：辅助文字色调整为 #595959（明亮模式）/ #999999（暗黑模式），确保对比度 ≥ 4.5:1
- Skip Navigation 链接（隐藏式，Tab 时显示）

### 6.12 隐私政策

- 添加 `/privacy`（英文）和 `/zh/privacy`（中文）隐私政策页面
- 内容涵盖：数据收集范围（Plausible 匿名统计）、Google Maps 嵌入说明、联系信息使用说明
- 页面为静态内容，后台可编辑
- Footer 添加 Privacy Policy 链接

---

## 7. UI 设计体系 Design System

### 7.1 设计风格：高棉现代融合 (K-M Fusion)

**定义**：在现代极简基础上融入高棉传统美学元素

**布局结构**（参照 Studio MEMM）
- 模块化长页、全屏视觉驱动、极简导航

**UI/UX 风格**（K-M Fusion）
- 现代极简骨架：大留白、极细线条、8px 网格、微圆角
- 高棉融合元素：吴哥窟几何纹样（CSS/SVG 代码生成）、砂岩色调、古铜金强调色
- 材质隐喻：砂岩质感背景色、石刻感衬线标题字体、建筑制图风细线

**核心原则：结构学 MEMM，灵魂属高棉**

**细节规范**
- 极细边框（0.5-1px），模拟建筑制图规范
- 微圆角 2-4px，保持精致感
- 轻柔投影，模拟自然光线
- 基于 8px 网格系统的间距体系
- 高棉装饰纹样通过 CSS/SVG 代码生成（无需提供外部素材）

### 7.2 字体体系

| 用途 | 字体 | 备选 | 说明 |
|------|------|------|------|
| 主标题 H1 | Cormorant Garamond | Georgia | 衬线体，石刻感 |
| 副标题/导航 | Inter | Helvetica Neue | 无衬线体，现代简洁 |
| 正文 | Inter | system-ui | 易读性优先 |
| 数据/技术 | JetBrains Mono | Fira Code | 等宽，精确度 |
| 中文 | Noto Sans SC | Source Han Sans | 渐进式加载 |
| 高棉文（预留） | Noto Sans Khmer | Battambang | 未来扩展 |

**字号规范**

| 元素 | Mobile | Desktop | 行高 |
|------|--------|---------|------|
| H1 主标题 | 28px | 48-64px | 1.1-1.2 |
| H2 副标题 | 22px | 32-40px | 1.2-1.3 |
| H3 小标题 | 18px | 24px | 1.4 |
| 正文 | 15px | 16-18px | 1.7 |
| 辅助 | 13px | 14px | 1.5 |

**字体加载策略**

- 所有字体使用 `font-display: swap`，避免不可见文本闪烁（FOIT）
- 首屏关键字体 preload：Inter（导航+正文）、Cormorant Garamond（Hero 标题）
- 中文字体 Noto Sans SC：使用 Google Fonts 动态子集加载（`&subset=chinese-simplified`），避免一次性下载 20MB+ 全量字体
- 高棉字体仅在 `/km/` 路由下按需加载（预留）
- 字体文件托管在 CDN（Cloudflare R2 或 Google Fonts CDN）

---

## 8. 后台管理系统 Admin Panel

后台设计原则：简洁、主创可独立维护、无需开发人员介入。

### 8.1 布局规范

**经典侧边栏导航式（Sidebar Layout）**

- 左侧固定侧边栏（240px 宽）：Logo + 导航菜单
- 右侧主内容区：顶部面包屑/标题栏 + 内容区域
- 移动端侧边栏可收起为图标模式或抽屉式
- 风格与前端保持一致的 K-M Fusion 设计语言

**侧边栏菜单项**

| 菜单 | 说明 |
|------|------|
| 仪表盘 (Dashboard) | 概览信息 |
| 全局设置 (Site Settings) | 品牌信息、Logo、SEO、时区等 |
| Hero 轮播管理 | 轮播图增删改排序 |
| 项目管理 (Projects) | 项目 CRUD + 图片管理 + 发布工作流 |
| AI 翻译设置 (Translation) | 各板块翻译提示词管理 |
| 个人设置 / 退出登录 | 账户管理 |

### 8.2 全局设置

所有内容均可通过后台管理界面编辑，无需修改代码：

**品牌 & 全局**

| 管理项 | 说明 |
|--------|------|
| Logo（明亮模式） | 上传明亮模式 Logo（SVG/PNG） |
| Logo（暗黑模式） | 上传暗黑模式 Logo（SVG/PNG） |
| 网站 Title | 中/英文 |
| 网站 Subtitle | 中/英文 |
| 品牌 Slogan | 中/英文 |
| 时区设置 | 影响自动明暗切换（默认 Asia/Phnom_Penh） |
| 日间时段 | 设定白天起止时间（默认 6:00-18:00） |
| SEO 设置 | 网站级别的 title、description、OG 图片 |

**Hero 轮播图**

| 操作 | 说明 |
|------|------|
| 添加/删除/编辑 | 每项可设图片、标题（中/英）、副标题（中/英）、CTA 文案、CTA 链接 |
| 排序 | 拖拽排序或数字优先级 |
| 启用/禁用 | 一键切换单项可见性 |

**关于模块**

| 管理项 | 说明 |
|--------|------|
| 主创头像 | 上传专业头像 |
| 主创介绍 | 中/英文，150-200 字 |
| 团队简述 | 中/英文 |
| 业务范围 | 中/英文 |
| 服务区域 | 中/英文 |

**联系信息**

| 管理项 | 说明 |
|--------|------|
| Telegram | 链接 |
| WhatsApp | 链接 |
| Email | 邮箱地址 |
| 办公地址 | 中/英文 |
| Google Maps | 嵌入链接 |
| 社交链接 | Instagram / Facebook / TikTok |

### 8.3 项目管理

| 操作 | 说明 |
|------|------|
| 创建/编辑 | 封面图、批量展示图、名称、类型、地点、面积、年份、材质、设计理念（中/英文） |
| 项目状态 | 设置状态标签（设计中/施工中/已竣工/已获奖） |
| 排序 | 拖拽排序或数字优先级 |
| 精选标记 | 标记是否显示在首页精选轮播 |
| URL Slug | 自动生成或手动编辑语义化 URL（修改 slug 时自动保存旧 slug 用于 301 重定向） |
| SEO | 每个项目独立的 title、description、OG 图片 |

**发布工作流**

项目状态流转：`草稿(draft) → 已发布(published) → 下线(archived)`

- **草稿**：新建项目默认状态，仅后台可见
- **预览**：草稿状态下点击「预览」按钮，在新窗口打开前端预览（带 `?preview=true&token=xxx` 参数，仅持有有效 preview token 可访问）
- **已发布**：正式上线，前端可见，发布时自动触发 ISR 缓存刷新
- **下线**：从前端隐藏但保留数据，下线时自动触发 ISR 缓存刷新

### 8.4 AI 翻译功能（DeepSeek 集成）

**翻译方式：批量翻译**

- 每个编辑页面提供「一键翻译所有中文内容」按钮
- 点击后将当前板块/页面中所有中文字段打包，一次性调用 DeepSeek API 批量翻译
- 翻译结果自动填入对应的英文字段
- 管理员可逐一校对修改翻译结果

**分板块提示词**

不同板块使用不同的翻译提示词（System Prompt），确保语境和专业性：

| 板块类型 | 翻译风格 |
|---------|---------|
| 项目描述 (project) | 建筑/室内设计专业术语，简洁优雅 |
| 品牌文案 (brand) | 品牌调性，诗意表达 |
| 主创/团队介绍 (about) | 专业简历风格 |
| 联系信息 (contact) | 商务正式风格 |
| Hero 文案 (hero) | 精炼有力，品牌宣言感 |
| 通用文案 (general) | 默认提示词 |

**提示词管理**

- 后台「AI 翻译设置」页面
- 每个板块类型对应一个可编辑的系统提示词
- 管理员可自定义/修改各板块的提示词
- 提供默认提示词模板，开箱即用

### 8.5 图片上传规范

| 规格 | 说明 |
|------|------|
| 支持格式 | JPG, PNG, WebP |
| 最大单张 | 10MB |
| Hero 轮播图 | 建议 1920x1080px（16:9） |
| 项目封面图 | 建议 1920x1080px（16:9） |
| 主创头像 | 建议 800x800px（1:1） |
| 项目展示图 | 自动生成多种尺寸（响应式） |
| 自动处理 | 上传后自动压缩至合理尺寸 |

### 8.6 后台认证

- 基于 Supabase Auth 的邮箱 + 密码登录
- 单管理员模式（MVP 阶段）

### 8.7 后台会话管理

- 登录超时：7 天自动过期（Supabase Auth 默认）
- Token 刷新：使用 Supabase 的 `onAuthStateChange` 自动刷新
- 忘记密码：配置 Supabase Auth 密码重置邮件模板
- 保护措施：所有 admin API 路由添加 auth middleware 校验

---

## 9. 技术架构 Technical Stack

### 9.1 技术选型

| 层级 | 技术 | 职责 |
|------|------|------|
| 前端框架 | Nuxt 4 | SSR/SSG 混合，Server Components |
| 样式 | Tailwind CSS 4 | 自定义"砂岩"主题 |
| 动画 | GSAP + ScrollTrigger | 滚动动画、页面过渡 |
| 图片优化 | Nuxt Image | 自动 WebP 转换、响应式图片 |
| 多语言 | @nuxtjs/i18n | 多语言路由管理 |
| 数据库客户端 | Supabase JS Client (@supabase/supabase-js) | 数据库 CRUD + Auth + 类型安全查询 |
| 类型生成 | Supabase CLI (`supabase gen types`) | 从数据库 schema 自动生成 TypeScript 类型 |
| 数据库 | Supabase PostgreSQL | 数据存储 |
| 文件存储 | Cloudflare R2 | 图片/资源存储 + 全球 CDN |
| AI 翻译 | DeepSeek API | 中文→英文批量翻译辅助 |
| 数据分析 | Plausible Analytics | 轻量网站分析，无需 Cookie |
| 部署 | Vercel | Edge Network，东南亚访问友好，自带 Function Logs |

**架构说明**

- **Supabase JS Client**：所有数据库操作通过 Supabase JS Client（PostgREST HTTP API），不直连数据库。使用 `supabase gen types typescript` 自动生成完整 TypeScript 类型定义，保证类型安全。数据库 Schema 通过 Supabase Migration（SQL）管理，`supabase/migrations/` 目录版本控制。天然无连接池问题（PostgREST 代理层管理连接），Serverless 部署无需额外配置。可利用 Supabase RLS（Row Level Security）做后台权限控制。
- **Supabase**：负责 Auth 认证 + 提供 PostgreSQL 数据库 + PostgREST API 层。不使用 Supabase Storage。
- **Cloudflare R2**：零出站流量费用，通过 S3 兼容 API 上传，Cloudflare CDN 自动分发（东南亚节点覆盖好）。
- **DeepSeek API**：兼容 OpenAI 格式，API Key 存储在环境变量 `DEEPSEEK_API_KEY`，含限流保护。
- **Plausible**：轻量隐私友好的网站分析，脚本 < 1KB，不使用 Cookie，无需 Cookie 同意弹窗。

**渲染策略**

| 页面 | 渲染模式 | 说明 |
|------|---------|------|
| 首页 | SSG（静态生成） | CDN 直出，访问最快 |
| 项目归档页 | ISR（增量静态再生） | 重新验证时间 60 秒，后台操作触发 On-demand Revalidation |
| 项目详情页 | ISR（增量静态再生） | 重新验证时间 60 秒，后台操作触发 On-demand Revalidation |
| 404 页面 | SSG | 静态生成 |
| 后台管理 | SPA（客户端渲染） | 纯管理界面，无需 SSR/SEO |

**R2 Bucket 结构**

```
said-assets/
├── hero/                    # Hero 轮播图
├── projects/{slug}/         # 项目图片（封面 + 展示图）
├── team/                    # 主创头像等团队素材
└── brand/                   # Logo（明/暗两版）、装饰元素
```

### 9.2 性能目标

| 指标 | 目标 | 说明 |
|------|------|------|
| Lighthouse | ≥ 90 | 性能 + 无障碍 + SEO 均达标 |
| FCP | < 1.5s | 金边 4G 网络环境 |
| LCP | < 2.5s | Hero 大图是 LCP 关键，需 preload + 合适尺寸 |
| CLS | < 0.1 | 所有图片/轮播预设宽高比，防止布局偏移 |
| INP | < 200ms | 交互响应速度 |
| 图片加载 | 渐进式 | 模糊占位 → 高清图 |

### 9.3 数据库设计

| 表名 | 核心字段 | 说明 |
|------|---------|------|
| `site_settings` | key, value_zh, value_en, type, logo_light_url, logo_dark_url, timezone, day_start_hour, day_end_hour | 全局设置（Logo、标题、联系信息、时区等） |
| `hero_slides` | image_url, title_zh/en, subtitle_zh/en, cta_text_zh/en, cta_link, sort_order, is_active | Hero 轮播图 |
| `categories` | id, name_zh, name_en, slug, sort_order | 项目分类（可扩展，后台管理） |
| `projects` | title_zh/en, slug, cover_url, category_id (FK→categories), location, area, year, materials, project_status (设计中/施工中/已竣工/已获奖), description_zh/en, sort_order, is_featured, publish_status ENUM('draft','published','archived') DEFAULT 'draft', preview_token | 项目信息 |
| `project_images` | project_id, image_url, sort_order, caption_zh/en | 项目图片（1:N），caption 兼做无障碍 alt 文本 |
| `translation_prompts` | id, section_type, prompt_text, updated_at | AI 翻译提示词 |
| `page_contents` | slug, title_zh/en, content_zh/en, updated_at | 静态页面内容（隐私政策等） |
| `slug_redirects` | old_slug, new_slug, created_at | 项目 slug 变更时的 301 重定向记录 |

> 所有文本字段均有 `_zh` 和 `_en` 双语版本，预留 `_km` 后缀（第一期不启用）
> `project_milestones` 表 V1 不创建，V2 按需添加

---

## 10. 内容准备清单 Content Checklist

### 10.1 品牌素材

- [ ] SAID Logo 高清矢量图（SVG，**明亮 + 暗黑两版**）
- [ ] 主标题 + 副标题文案（中文，英文由 AI 翻译后校对）
- [ ] 品牌 Slogan（中文，英文由 AI 翻译后校对）

### 10.2 Hero 素材

- [ ] 3-5 张高质量宽屏图片（1920x1080px+）
- [ ] 每张配套标题 + 副标题（中文）

### 10.3 作品集素材

精选 6-10 个代表性项目，每个需准备：

- [ ] 1 张 16:9 封面图（1920x1080px+）
- [ ] 5-15 张实景/效果图
- [ ] 项目名称、类型、地点、面积、年份、材质、状态
- [ ] 100-200 字设计理念（中文）
- [ ] 项目状态（设计中/施工中/已竣工/已获奖）

### 10.4 主创素材

- [ ] 专业头像（800x800px+）
- [ ] 个人简介（150-200字，中文）

### 10.5 联系信息

- [ ] Telegram、WhatsApp、Email、办公地址
- [ ] Google Maps 链接
- [ ] 社交媒体链接（Instagram、Facebook、TikTok）

### 10.6 技术准备

- [ ] 域名信息及 DNS 配置权限
- [ ] Supabase 项目创建（注册账号）
- [ ] Cloudflare 账号（R2 存储）
- [ ] Vercel 项目创建（注册账号）
- [ ] DeepSeek API Key
- [ ] Plausible Analytics 账号（Cloud 或自托管）

---

## 11. 开发路线图 Roadmap

无硬性时间限制，按以下阶段推进，质量优先：

### 阶段 1 — 基础搭建

- Nuxt 4 项目配置（Tailwind CSS 4、GSAP、@nuxtjs/i18n、Nuxt Image）
- Supabase 项目初始化 + Migration 定义 + `supabase gen types` 类型生成
- Supabase Auth 认证配置
- Cloudflare R2 存储配置
- 基础 CRUD API（通过 Supabase JS Client）
- Plausible Analytics 集成
- 设计体系（颜色、字体、间距）建立

### 阶段 2 — 首页开发

- Hero 全屏轮播模块
- 精选项目全屏切换展示
- 关于模块
- 联系模块 + Google Maps
- Footer / 品牌尾声
- 导航栏（桌面 + 移动端）

### 阶段 3 — 项目详情页 + 功能

- 项目详情页完整开发
- 项目状态标签
- 多语言切换
- 明暗主题切换（含后台可配时区）
- 社交分享
- 404 页面
- 隐私政策页面
- 无障碍基础实现（键盘导航、alt 文本、焦点管理、reduced motion）

### 阶段 4 — 后台管理系统

- 侧边栏布局 + 登录认证
- 全局设置管理（Logo 明/暗、Title、Subtitle、Slogan、时区、SEO）
- Hero 轮播管理
- 项目 CRUD + 图片管理
- 项目发布工作流（草稿→预览→发布）
- AI 翻译功能（DeepSeek 集成 + 提示词管理）
- 内容排序
- 忘记密码流程

### 阶段 5 — 打磨与上线

- GSAP 动画效果实现与调优
- 字体加载优化
- 全设备响应式测试与优化
- SEO 配置（JSON-LD、sitemap、OG、图片 Sitemap、robots.txt）
- Core Web Vitals 全指标达标验证（LCP、CLS、INP）
- 性能优化（Lighthouse ≥ 90）
- 域名绑定 + 正式上线
- 项目内容填充

---

## 12. 未来规划 Future Enhancements

- 项目里程碑时间线（详情页时间线组件 + 后台管理）
- 归档页地点筛选（金边 / 西港）
- 高棉语界面翻译
- Hero 视频背景支持
- 媒体报道/获奖荣誉展示模块
- 项目数据统计展示（动画计数器：项目数、设计面积、从业年限）
- 图片防护（防盗链、右键禁用、可选水印）
- 在线咨询表单（集成 Supabase）
- 项目 3D 全景展示
- 设计专栏 / 播客
- 客户评价/推荐信展示
- 可持续设计专题
- 多管理员权限系统

---

**SAID | 上境设计 | V4.2 Final | 2026.02.24**
**单页主体 + 项目详情子页 | 混合式导航 | K-M Fusion | 参考标杆：Studio MEMM**
