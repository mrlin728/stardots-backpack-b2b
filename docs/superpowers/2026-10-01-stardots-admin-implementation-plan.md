# STARDOTS 两站统一后台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有中文后台中分别管理鞋类与箱包产品和图片，完成草稿、预览、发布、恢复及英文辅助，保留两站外观和内容。

**Architecture:** 复用鞋类 TanStack Start 后台与现有 Supabase Auth/Storage。新增按网站授权的内容修订和不可变发布快照；两站的页面、SEO 和客户端均绑定同一构建快照。发布请求登记为持久任务，由自动发布工作流完成候选构建、验证、生产切换和失败恢复。

**Tech Stack:** 鞋类沿用 TypeScript、React、TanStack Start、Zod 3、Supabase、Bun tests；箱包沿用 React 18、Vite、Node test、预渲染脚本。图片服务复用已有 Puppeteer/Chromium；英文辅助沿用服务端 DeepSeek；不预先增加 npm 依赖。

**Spec:** [已确认设计方案](2026-10-01-stardots-admin-design.md)。本计划状态：可审阅，等待执行方式选择；没有实施产品代码。

## Global Constraints

- 保留两个网站现有设计、产品链接和中英文内容。
- 每个可管理内容实体都保存不可缺少的 `site_id`，只允许 `footwear` 或 `bags`。
- 保存草稿 → 预览 → 点击发布；编辑过程不立即影响访客。
- 第一版由本人使用，预留以后添加员工的能力。
- 后台默认简体中文；先输入中文，辅助生成英文草稿，人工检查后发布。
- 支持 JPG、PNG、WebP、AVIF；沿用现有 5 MB 单文件上限；执行时按 5 × 1024 × 1024 bytes 实现。
- 第一版保留最近 10 次成功发布版本。
- 保留英文默认入口及现有中文路径和语言切换行为。
- 主要在中国大陆使用，电脑为主，手机也能完成核心操作。
- 不开通新套餐、不充值、不启用付费附加项，直到列出实际新增费用并获得对应授权。
- 不增加购物车、支付、库存、订单或新的询盘管理功能；现有线索成员不因此获得内容管理权限。
- 不输出或提交密钥、会话令牌及真实个人资料；所有部署及 AI 凭据只存在于服务端/CI 的受保护配置。

## Review Focus

- 已有产品数据与最初 RLS 定义未完整保存在仓库：迁移须先导出和比对，不能覆盖现存新增记录。由任务 0、2 的数量/哈希与 SQL 权限检查覆盖。
- 更换主图但同 SKU 的旧 AVIF 仍被优先使用：卡片必须绑定当前主图衍生图。由任务 4、6 的换图断言覆盖。
- 两个设备同时编辑、切站或翻译慢返回：不能保存到错误网站或覆盖新中文。由任务 3、5、7 的版本和请求身份断言覆盖。
- Vercel 超时、回调重复、任务在切换后崩溃：状态可恢复，不能重复发布或假报成功。由任务 9 的持久状态机与补偿测试覆盖。
- 旧产品下架后的 URL、语言链接和询盘型号：不能显示错误产品或遗留未发布资料。由任务 6、10 的路由/状态与预填回归覆盖。

## 代码基础与文件边界

以下 `G/` 表示鞋类项目，`B/` 表示已验证的箱包项目；是任务路径标识，不是要求创建同名目录。执行时在当前聊天的 `work/` 中取得干净工作副本，不直接修改历史聊天中的 checkout。任务 0 记录实际绝对路径和源版本。

鞋类当前已检查版本：`mrlin728/stardots-global-partner@3042f77362ea5d111c2dc76e92ff203303b5fadc`。箱包远程版本：`mrlin728/stardots-bag-website@a9e589261841b219a7ba2d606538ebe418d5fdf8`，已检查的 8 个关键源码 Git blob 与线上对应的本地版本完全一致。本地版本为 `bd3dd17`，路径 `/Users/a/Documents/Codex/2026-09-28/https-stardotsbags-com-https-stardotsbags-com-3/work/stardots-bags-site`，构建与线上 `index-7wImOsC3.js` 一致。执行前再检查线上与远程变更，若版本有变化先比对。

| 边界 | 新建或修改的主要文件 | 职责 |
| --- | --- | --- |
| 数据合同 | `G/src/lib/content/types.ts`、`validation.ts`、`snapshot.ts` | 网站、修订、图片、发布快照及边界校验 |
| 数据库/授权 | `G/supabase/migrations/20261001090000_content_revisions.sql`、`G/supabase/tests/content_permissions.sql` | 内容表、RLS、事务、站点级授权 |
| 服务端 | `G/src/lib/content/{repository,auth,media,translation,preview,publish}.server.ts` | 只负责各自的数据库、权限、图片、翻译、预览和发布操作 |
| 后台调用 | `G/src/lib/api/content.functions.ts` | 沿用 `createServerFn`，输入校验并调用对应服务 |
| 机器接口 | `G/src/routes/api.content.$action.ts` | 上传、预览兑换、CI 快照读取和任务回调的显式 HTTP 端点；不承载业务 UI |
| 后台 UI | 修改 `G/src/routes/admin.tsx`、`admin.products.tsx`；新增 `admin.site-images.tsx`、`admin.releases.tsx` 和 `G/src/components/admin/content/*` | 网站选择、产品表单、图片位置和发布状态 |
| 鞋类前台 | 修改 `G/src/lib/products.ts`、`G/src/lib/site-images.ts`、`G/src/components/stardots/HomeSections.tsx`、必要的产品 route loaders | 用同一快照替换实时读取，复用现有页面组件 |
| 箱包前台 | 修改 `B/src/catalog.js`、`Catalog.jsx`、`App.jsx`、`seo.js`、`data.js`；新增 `B/src/content/{snapshot,catalog-adapter,site-images}.js` | 同步产品、图片、SEO、询盘引用；保持现有路由和版式 |
| 构建/发布 | `G/scripts/content/{import-baseline,prepare-snapshot,release,verify-release,cleanup-assets}.mjs`、`G/.github/workflows/publish-content.yml`；`B/scripts/prepare-content.mjs` | 初始化、固定快照构建、自动发布、验证和保留文件 |

不手工编辑 `G/src/routeTree.gen.ts`。不改动现有 Vite/TanStack 插件组合。已有 leads/studio 服务的授权和用量记账不直接用于产品翻译。

## 公共接口合同

任务 1 在 `types.ts` 中定义以下合同，后续任务使用相同名称：

```ts
type SiteId = 'footwear' | 'bags';
type Localized = { en: string; zh: string };
type BagCatalogItem = { sku:string; slug:string; category:string;
  name:[string,string]; description:[string,string]; images:string[];
  relatedSkus?:string[]; debranded:boolean; cardUrl?:string };
type EntityKind = 'product' | 'image-slot';
type ReleaseState = 'queued' | 'preparing' | 'building' | 'verifying'
  | 'switching' | 'published' | 'rolling-back' | 'failed' | 'needs-attention';
type AssetRef = { id: string; sourceUrl: string; cardUrl?: string;
  alt: Localized; focal: { x: number; y: number }; provenance: string };
type ProductContent = { sku: string; slug: string; category: string;
  name: Localized; description: Localized; specs: Record<string, Localized>;
  flags: Record<string, boolean>; relatedSkus: string[]; images: AssetRef[];
  sortOrder: number; visible: boolean; legacy: Record<string, unknown> };
type ImageSlotContent = { slot: string; image: AssetRef };
type Revision = { id: string; entityId: string; siteId: SiteId;
  kind: EntityKind; version: number; content: ProductContent | ImageSlotContent;
  sourceHash: string; englishConfirmedFor: string | null };
type Snapshot = { schemaVersion: 1; releaseId: string; siteId: SiteId;
  createdAt: string; products: ProductContent[];
  imageSlots: Record<string, ImageSlotContent>; redirects: Record<string, string> };
type ContentErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'VALIDATION'
  | 'CONFLICT' | 'ASSET_INVALID' | 'TRANSLATION_UNAVAILABLE' | 'RELEASE_FAILED';
```

`sourceHash` 对中文名称、描述、规格和锁定事实做规范化哈希；不包含英文与后台展示状态。JSON 快照也使用规范化序列化计算 SHA-256，构建和验证记录其哈希。

## 任务 0：冻结正确代码、环境和恢复基础

**Files:** 新建工作记录 `work/implementation-context.md` 和 `work/baseline/manifest.json`；在实际 checkout 纳入本设计、计划及 `.gitignore` 中的私有备份排除项。无需产品功能代码。

**Interfaces:** 产出两站 `{repo, commit, checkout, deploymentId, projectId, domain}`、服务可用性结果、去敏的迁移比对清单；真实内容/文件备份只在忽略目录，不进入 Git。

- [ ] 获取鞋类仓库和箱包当前已验证源码的干净工作副本；遵循 using-git-worktrees 检查已有隔离，不改历史 checkout 的 origin 或脏文件。通过已连接 GitHub 定位远程关系，不依赖当前未认证的 `gh`。
- [ ] 记录源 commit、线上 bundle SHA-256、Vercel 项目/域名绑定；核实箱包部署归属。只有域名与项目匹配才使用其自动部署配置。
- [ ] 导出现有 products/product_images、桶及权限定义、原始图片引用与文件哈希；读取现有所有者 UUID。严禁用硬编码邮箱自动给不匹配账号授予权限。
- [ ] 检查实际储存用量、套餐、私有仓库 Actions 分钟额度和运行时翻译/部署配置是否可用，只记录“存在/不可用”，不输出配置值；列出真正增量费用。CI 使用 `VERCEL_TOKEN`、`VERCEL_ORG_ID`、按网站配置的 `VERCEL_PROJECT_ID`、数据库服务端访问凭据和发布回调密钥；只配置明确需要的权限，不把其值放进记录或构建产物。
- [ ] 运行 G `bun test`、`npm run typecheck`、`npm run lint`、`npm run build`；B `npm test`、`npm run build`。记录原有失败与输出，不把原有失败当作本功能通过。
- [ ] 确认 Supabase CLI/本地隔离数据库可用；在 `G/supabase/config.toml` 配置本地 CMS 测试实例，测试 fixture 使用去敏旧表结构，不导入个人资料。没有隔离数据库时 SQL 权限验收不得改为生产写入测试。
- [ ] 验证现有 Chromium 可在部署预览中解码 JPG/PNG/WebP/AVIF 并输出 WebP；工作副本使用隔离的 headless 进程，不控制用户浏览器。若既有运行时不支持所需格式，先形成具体依赖替代评估，不能擅自安装。
- [ ] 提交已确认设计/计划及不含个人资料的基础记录：`docs: record unified content baseline`。环境不可用只阻止依赖它的上线验证，不阻止独立纯逻辑开发。

## 任务 1：内容合同、站点授权与数据库事务

**Files:** 新建 `G/src/lib/content/{types,validation,snapshot}.ts` 及同名 `.test.ts`；迁移与 SQL 检查文件使用上述确切路径。

**Interfaces:** `parseRevision(input: unknown): Revision`；`parseSnapshot(input: unknown, siteId: SiteId): Snapshot`；`hashChineseSource(content: ProductContent): string`；`buildSnapshot(siteId: SiteId, releaseId: string, revisions: Revision[]): Snapshot`。

- [ ] 先写测试断言：未知 `siteId` 被拒绝；快照内跨站修订被拒绝；同站重复 SKU/slug 被拒绝；中文/事实变化导致 sourceHash 变化，英文修改不改变 sourceHash；输入 JSON 不允许非有限数或未定义值。
- [ ] 图片 URL 仅允许已核实的自有存储项目和所属站静态目录；拒绝 `javascript:`、`data:`、协议相对链接、localhost/元数据地址及任意外部主机。发布检查不得跟随重定向到未允许主机；签名草稿 URL 不持久化到数据库或公开快照。
- [ ] 运行 `bun test src/lib/content/validation.test.ts src/lib/content/snapshot.test.ts`，确认因接口缺失而失败；实现 Zod 3 结构和规范化哈希后重复运行，要求全部通过。
- [ ] 迁移新增 `cms_sites`、`cms_memberships`、`cms_entities`、`cms_revisions`、`cms_assets`、`cms_releases`、`cms_release_items`、`cms_release_jobs`、`cms_translation_usage`；所有内容关联 site_id，成员关联 Auth UUID。同站唯一约束、修订号和发布锁在数据库执行。
- [ ] 定义 RPC `cms_save_revision(site_id, entity_id, expected_version, content, english_confirmed_for)`、`cms_enqueue_release(site_id, revision_ids, idempotency_key)`、`cms_activate_release(site_id, release_id, expected_previous_release)`、`cms_restore_release(site_id, release_id)`；通过 `auth.uid()`/成员检查授权，拒绝客户端伪造 actor_id。
- [ ] SQL 测试匿名、无成员、现有线索成员、所属站 owner 与另一站 owner；覆盖读取草稿、修改、排队发布与资产访问。匿名不能读取草稿/任务表，不能写任何 CMS 表；owner 不能改另一站内容。函数固定 search_path，不给浏览器 service-role 权限。
- [ ] 在本地/隔离测试数据库应用迁移并运行 `supabase test db`，要求权限断言全部通过，再提交 `feat: add site-scoped content revisions`。此时不运行生产迁移。

## 任务 2：迁入现有产品和图片，保持原始资料

**Files:** 新建 `G/scripts/content/import-baseline.mjs`、`G/src/lib/content/{legacy-adapters,legacy-adapters.test}.ts`；基准 fixtures 放 `G/tests/fixtures/content/`，仅包含公开产品信息。

**Interfaces:** `fromFootwearRow(row: ProductRow): ProductContent`；`fromBagItem(item: BagCatalogItem): ProductContent`；导入命令 `bun scripts/content/import-baseline.mjs --dry-run --manifest <path>` 和 `--apply --manifest <path>`。Bun 负责解析其导入的 TypeScript 适配模块。

- [ ] 先断言鞋类 public slug 不变、null 规格保持现有显示语义、产品图片顺序/主图一致；箱包 name/description 的 `[en,zh]` 转换无互换，relatedSkus、debranded 及分类保留。
- [ ] 运行 `bun test src/lib/content/legacy-adapters.test.ts`，失败后实现适配函数，重复运行要求通过。
- [ ] dry-run 检查箱包基准为 67 个型号/143 个图片引用；文件哈希、原 URL 和中文/英文逐项比较。数量是本次基准，不是以后限制产品数量。
- [ ] 通过原记录 ID 和源哈希生成幂等初始实体与生效快照；重复导入不重复创建。检测已存在但哈希不同的记录则报告差异，不覆盖。
- [ ] 在测试数据库 apply，再次 dry-run 期望 `creates=0, conflicts=0`；验证导入前后的 URL/分类/顺序清单相同，提交 `feat: import existing site content safely`。

## 任务 3：草稿读写、冲突保护与受限调用

**Files:** 新建 `G/src/lib/content/{auth,repository}.server.ts`、对应 tests；新建 `G/src/lib/api/content.functions.ts`。

**Interfaces:** `requireSiteOwner(token: string, siteId: SiteId): Promise<{userId: string}>`；`loadDraft(siteId, entityId): Promise<Revision|null>`；`saveDraft(input: {token,siteId,entityId,expectedVersion,content,englishConfirmedFor}): Promise<Revision>`；`listManagedEntities(token,siteId): Promise<Revision[]>`。所有输入由合同验证；错误使用 ContentErrorCode。

- [ ] 写测试断言保存已有已发布产品只新增草稿，线上快照 hash 不变；错误网站/无成员被拒绝；旧 expectedVersion 返回 CONFLICT；同站 SKU/slug 冲突不覆盖；新产品 visible 也不会使草稿公开。
- [ ] 运行 `bun test src/lib/content/repository.server.test.ts src/lib/content/auth.server.test.ts`，确认失败；实现 Auth getUser 校验、成员查询和 RPC 调用后要求通过。
- [ ] `content.functions.ts` 沿用现有 POST createServerFn/Zod 模式；每次请求验证身份、网站和版本。不从 lead-only helper 继承授权，不直接从表单修改 products/product_images。
- [ ] 对产品 URL 的显式变更建立旧路径跳转记录；下架作为内容 visible=false 的修订，经发布生效，禁止普通表单直接物理删除已发布记录。
- [ ] 构建、类型检查通过，提交 `feat: isolate draft edits from published content`。

## 任务 4：私有上传、服务器解码、衍生图和网站图片位置

**Files:** 新建 `G/src/lib/content/{media,media-decoder,site-image-slots}.server.ts`、`media.server.test.ts`；新增机器路由 `G/src/routes/api.content.$action.ts`；新增上传/图片位置表单组件。

**Interfaces:** `validateAndStoreAsset(input: {token,siteId,bytes:Uint8Array,originalName:string}): Promise<AssetRef>`；`deriveRaster(bytes:Uint8Array): Promise<{width:number,height:number,webp:Uint8Array,card:Uint8Array}>`；`getSlotDefinitions(siteId): SlotDefinition[]`；`resolveDraftAssetUrls(token,siteId,revisionId,expiresAt): Promise<Record<string,string>>` 仅对已授权修订中的 assetId 返回临时显示 URL，不保存签名 URL。

- [ ] 写测试：5 MiB 接受、5 MiB+1 拒绝；伪 jpg HTML/SVG 拒绝；无法完整解码的文件拒绝；EXIF 旋转正确；像素上限 40,000,000、最长边 12,000；超限错误可供中文 UI 展示。
- [ ] 运行 `bun test src/lib/content/media.server.test.ts`，失败后实现：限制请求体，验证真实格式和头部尺寸，再以隔离 Chromium 完整解码；公开 WebP 最长边最大 2,400px、卡片最大 640px，不放大小图。只运行受控解码/Canvas 代码，禁止外部网络和上传内容中的可执行格式；20 秒任务期限，finally 关闭浏览器，最多 1 个解码并发。复用 `G/src/lib/leads/engine-crawl.server.ts` 的动态 Chromium 启动/打包方式，不调用其阻止图片加载的 crawler。大图不得因扩展名进入永久桶。
- [ ] 原始文件存入私有草稿桶，EXIF 等无关元数据不进入公开衍生图。AssetRef 记录固定资源身份/发布目标 URL；后台/预览通过 resolveDraftAssetUrls 临时显示私有图片，签名期限不超过对应预览期限。失败只清理本次未引用对象，不删原线上图。
- [ ] 根据现有页面枚举图片位置与原图：鞋类首页/工厂/公司，箱包首页及现有公司/合作工厂相关图片。不存在的工厂展示区不新造内容；不把同一 hero URL 的全部使用位置错误绑定成同一可编辑位置。
- [ ] 焦点为 0..1 坐标，槽位比例在定义中固定并按当前 CSS 推导。保留现有 AI/概念图标识的 provenance，不能换图时静默移除说明。
- [ ] 独立 fixture 在服务器预览验证四种格式、进度、失败重试和卡片图实际尺寸；提交 `feat: manage private image drafts and site slots`。

## 任务 5：英文草稿生成及费用限额

**Files:** 新建 `G/src/lib/content/{translation,translation-validation}.server.ts`、`translation.server.test.ts`；扩展 content.functions，不修改现有 leads operation 记账。

**Interfaces:** `translateProduct(input:{token,siteId,revisionId,expectedSourceHash}): Promise<{sourceHash:string,name:Localized,description:Localized,specs:Record<string,Localized>,usage:{inputTokens:number,outputTokens:number}}>`；`verifyLockedFacts(source:ProductContent,result:ProductContent): string[]`。

- [ ] 写测试：无内容权限拒绝；中文在等待期间变化时返回 CONFLICT，不写回；SKU/数字/单位被改写或模型补充 MOQ/材质时拒绝；非 JSON/超时/余额不足不覆盖草稿；英文确认只对相同 sourceHash 有效。
- [ ] 运行 `bun test src/lib/content/translation.server.test.ts`，失败后实现服务端 DeepSeek 请求：默认 `deepseek-flash`、非思考模式、结构化输出，只提交已提供的产品事实。`PRODUCT_TRANSLATION_MODEL` 可配置，复用服务端 API key，不能返回 key 或模型原始报错中的敏感文本。
- [ ] 数据库原子预留每用户每日最多 100 次、每站同时 1 次、每次输出最多 2,000 token；请求文本上限 12,000 字符。记录真实 input/output token；完成/失败释放并发占用。达到上限明确提示，不自动充值。
- [ ] 本地 provider stub 完成错误和费用测试；真实服务仅用公开 fixture 做一次受控验证，在调用前确认现有可用凭据和本计划限额。没有可用配置时记录未通过，不能宣称英文辅助完成。
- [ ] 提交 `feat: generate reviewed English product drafts`。

## 任务 6：两站固定快照读取、图片替换及 SEO 同步

**Files:** 新建 `G/src/lib/content/public-snapshot.ts`、`snapshot-context.tsx` 与 tests、`G/scripts/content/prepare-snapshot.mjs`；修改 G products.ts/site-images.ts/HomeSections.tsx/public-page-cache.ts；新增 `B/src/content/{snapshot.js,snapshot-context.jsx,catalog-adapter.js,site-images.js}`、`B/scripts/prepare-content.mjs`、`B/tests/content-snapshot.test.mjs`，修改 B catalog.js/Catalog.jsx/App.jsx/seo.js/package.json/prerender.mjs。

**Interfaces:** `getBuildSnapshot(): Snapshot`；`toFootwearProducts(snapshot:Snapshot): Product[]`；B `toBagCatalog(snapshot): BagCatalogItem[]`；两站 `ContentSnapshotProvider({snapshot,children})`、`useContentSnapshot()`，只在合法预览中提供草稿覆盖，普通渲染默认用构建快照。构建输入 `CONTENT_RELEASE_ID` 与 `CONTENT_SNAPSHOT_PATH`，生成只含公开字段的 `src/generated/content-snapshot.json`。产出 `public/content-version.json = {siteId,releaseId,snapshotHash,sourceCommit}`。

- [ ] 写测试：同站初始 snapshot 渲染数据与原版一致；发布后新型号出现在目录/详情/搜索/询盘引用；下架型号退出目录且旧详情明确返回不存在，不串到其他 SKU；双语 canonical/hreflang 对应正确。
- [ ] G 运行 `bun test src/lib/content/public-snapshot.test.ts src/lib/products.test.ts`；B 运行 `node --test tests/content-snapshot.test.mjs tests/locale.test.mjs`。失败后实现适配；保留 fetchPublishedProducts/fetchProductBySlug 签名与既有 Hotel 产品排除规则，读取构建快照，不继续实时混入旧数据库行。
- [ ] 快照缺失、错误网站、hash 不符的内容发布构建必须失败。初次接入使用已验证的基准快照，不能在发布构建失败时默默回退旧 catalog；开发基准 fixture 需显式选择。
- [ ] 保持 B catalog.js 的公开导出兼容，用 React Context 供组件读取预览覆盖；不得为预览修改模块全局数组。SEO 与构建只用固定快照，预览 route 不改公开 metadata。修改 `quoteHref` 接受当前 catalog，并让所属站的主图、图片位置和图库读取同一个上下文。
- [ ] B 改主图后 ProductPhoto/CategoryCard 使用该主图绑定的 cardUrl；仅对源图匹配的基准图片继续使用原 AVIF，不按 SKU 盲用旧缩略图。新上传衍生图来自任务 4，自动构建不调用 macOS `sips`。
- [ ] 两站 HTML 加版本标记；鞋类 SSR/缓存响应绑定构建 releaseId。`/api/content/*`、`/content-preview` 和后台设置 no-store/noindex，不由公共页缓存包装为营销页。
- [ ] B 预渲染输出详情、sitemap、JSON-LD 和图片预加载都来自同一 snapshot。把固定 67/192 断言留在基准导入测试；产品可增减时使用推导路由数量和完整性断言，不删掉双语覆盖检查。
- [ ] 两站测试与 build 通过，基准截图不改变版式，提交各站 `feat: render a consistent published content snapshot`。

## 任务 7：统一中文后台、图片表单与防止误操作

**Files:** 修改 G admin.tsx/admin.products.tsx；新增 admin.site-images.tsx/admin.releases.tsx；新建 `G/src/components/admin/content/{SiteSelector,ProductEditor,ImageUploader,ImageSlotEditor,ReleaseStatus}.tsx` 及 editor-state.test.ts。

**Interfaces:** 表单消费任务 3/4/5；`editorIdentity={siteId,entityId,version,sourceHash}`。所有异步回调只对同一 editorIdentity 生效；releaseId 用于状态查询和预览，不以显示标题识别实体。

- [ ] 写状态测试：未保存切站提醒；取消后保留表单；确认离开才切站；慢上传/翻译返回不写入另一产品；主图/顺序修改只写草稿；发布按钮不调用旧 togglePublish/deleteProduct。
- [ ] 运行 `bun test src/components/admin/content/editor-state.test.ts`，失败后实现表单状态；重用已有中文 UI/组件，按 footwear/bags 显示原有规格，显示修改后的英文检查状态。
- [ ] admin 布局从成员权限判断内容入口；保留现有 leads/studio 权限和入口。admin.catalog-import 改为导入 CMS 草稿，不绕开新发布机制。
- [ ] 上传逐张反馈成功/失败、允许重试；顺序使用有标签的上移/下移按钮，拖拽仅作为可选增强。键盘可操作，错误关联具体字段并朗读，弹窗关闭恢复焦点；手机页面不横向溢出。
- [ ] 公共浏览器验证只读；测试账号和隔离内容中验证保存/上传/翻译流程。类型检查、lint、构建通过，提交 `feat: unify bilingual site content management`。

## 任务 8：限定修订的跨站预览

**Files:** 新建 G content/preview.server.ts、preview.server.test.ts、routes/content-preview.tsx；在 api.content.$action.ts 增加 preview；B 新建 src/content/preview.js、api/content-preview.js，修改 main.jsx/App.jsx 仅在预览路由注入草稿上下文。

**Interfaces:** `issuePreview(input:{token,siteId,revisionId}): Promise<{url:string,expiresAt:string}>`；`redeemPreview(ticket:string,siteId:SiteId): Promise<Snapshot>`；票据 10 分钟有效，限 siteId/revisionId，数据库仅保存 ticket hash，最多读取 20 次。

- [ ] 写测试：过期/伪造/另一站票据拒绝；票据不能列举其他草稿；快照覆盖只包含指定修订及其站的已发布内容；无票据直接打开预览不得读取草稿。
- [ ] 运行 `bun test src/lib/content/preview.server.test.ts`，失败后实现票据签发和授权兑换。跨站 URL 票据放 fragment，浏览器读取后立即移除；POST 兑换，不把 token 放查询参数、日志或 referrer。使用固定允许域名配置，拒绝任意回调 URL。兑换时只给允许的私有图片签发临时 URL，过期后提示重新预览，不发布这些 URL。
- [ ] B api 只代理到固定后台 preview 端点并限制 body/方法/origin，不传 service-role key；G/B 预览响应 no-store，页面 noindex/nofollow、Referrer-Policy no-referrer。
- [ ] 用现有两站组件渲染，显示“草稿预览”，可切中文/英文和 375/1440px 宽度。后台提示预览链接到期而不是永久分享地址。
- [ ] 在隔离部署验证授权、图片签名、焦点裁剪和匿名拒绝；提交 `feat: preview authorized drafts across both sites`。

## 任务 9：自动发布状态机、生产验证与恢复

**Files:** 新建 G content/publish.server.ts、publish-state.ts/tests；scripts/content/{release,verify-release}.mjs 及 release.test.mjs；.github/workflows/publish-content.yml；扩展 content.functions/api.content.$action.ts；B 增加 content-version 静态产物检查。

**Interfaces:** `enqueueRelease(input:{token,siteId,revisionIds,expectedVersions,idempotencyKey}): Promise<{releaseId,state}>`；`getRelease(token,siteId,releaseId)`；worker CLI `node scripts/content/release.mjs --release-id <uuid>`；验证 CLI `node scripts/content/verify-release.mjs --base-url <url> --release-id <uuid> --snapshot-hash <sha>`。

- [ ] 写状态机测试：相同 idempotencyKey 返回同一任务；同站发布串行、另一站任务独立；版本/翻译未确认/图片缺失拒绝排队；候选失败不 promote；切换失败恢复上一快照和部署；恢复失败 needs-attention；重复回调不倒退状态。
- [ ] G 运行 `bun test src/lib/content/publish-state.test.ts`，worker 运行 `node --test scripts/content/release.test.mjs`；失败后实现持久状态、数据库 compare-and-swap/租约、超时恢复和签名回调校验。worker 只导入纯 JavaScript/JSON 合同产物，不直接用 Node 导入 TypeScript。不能依赖一次 HTTP 请求内等待整个部署。
- [ ] 工作流从数据库领取已授权任务，不信任 dispatch 中任意 site/repo/domain；使用任务 0 确认的项目配置，固定源提交和快照哈希。GitHub Actions 固定 commit SHA、最小权限，凭据通过受保护 CI secrets 读取。
- [ ] 顺序：保存不可变候选快照 → 准备公开图片 → 构建指定站候选部署 → 等待 READY → 检查版本/hash/页面/图片 → 切换生产部署和数据库生效标识 → 再检查生产 → published。失败按记录的上一部署和快照恢复，记录检查结果。
- [ ] 保留原产品表/图库兼容投影，仅在对应已验证发布切换事务中更新，禁止普通表单继续即时写线上记录。构建读取指定快照，不从“最新草稿”读取。
- [ ] 部署后检查首页、目录、改变的产品/分类、中英文、sitemap、静态 HTML 版本、卡片与图库真实图片内容；图片至少验证 HTTP content-type、解码尺寸与引用 hash。不以 HTTP 200 或 Vercel 接受请求等同成功。
- [ ] 工作流超时或 CI 中断时，同一 release 可从持久状态继续；任务状态/租约检查提供后台重试。自动恢复仅用已记录的可信部署 ID，不能接收浏览器指定部署。
- [ ] 在测试项目注入构建失败、验证失败、重复请求及切换后中断；验证恢复结果，提交 `feat: publish content with verified deployment rollback`。

## 任务 10：历史恢复、资产保留及完整交付

**Files:** 新建 G scripts/content/cleanup-assets.mjs、cleanup-assets.test.mjs、scripts/content/e2e.mjs；各站补关键回归测试；输出交付操作指南、实际费用清单、上线验证记录。

**Interfaces:** 恢复入口调用任务 9 重新发布历史 snapshot；`collectUnreferencedAssets(siteId,retainedReleaseIds): AssetCandidate[]` 只列候选，真实删除须排除当前快照、全部草稿和最近 10 个成功发布版本引用。

- [ ] 写保留测试：当前/草稿/最近 10 次成功版本图片永不删除；第 11 次成功版本不保留时，仍被任何修订引用的图片不删除；恢复沿用完整图片与内容，失败不改变已发布版本。
- [ ] 运行 `node --test scripts/content/cleanup-assets.test.mjs`；失败后实现 dry-run 清单与按引用清理。失败候选部署的临时文件有独立清单，不能与旧站文件混删。
- [ ] 复用 Puppeteer 写真实旅程：owner 登录 → 选箱包 → 新建隔离产品 → 四格式图片上传/改主图/排序 → 中文及英文确认 → 双语预览 → 发布 → 箱包目录/搜索/详情/询盘/静态 HTML 一致 → 鞋类不变 → 恢复。另测匿名/线索成员越权、断网、并发编辑及链接变更跳转。
- [ ] 最终检查 G `bun test`、typecheck、lint、build；B `npm test`、build；两站 `git diff --check`、依赖安全/许可证及密钥检查。新依赖只有审查通过才可加入；不为这次后台工作强行迁移既有测试框架。
- [ ] 在批准的执行方式下做独立完整代码审查，重点包括服务端权限、上传、预览票据、发布回调与恢复，以及键盘/表单/对话框的可访问性；有实质问题先修复再继续。
- [ ] 在生产迁移前取得可恢复备份；先发布兼容代码，再切入新内容系统；完成既有两站公开页面、图片和 RFQ 回归，禁止用真实客户询盘做未经授权的测试发送。
- [ ] 中国大陆网络验收记录明确测试网络/设备/日期。当前环境的测试不能冒充大陆用户测试；若缺少该条件，交付记录列为未验证，不虚构通过。
- [ ] 交付统一后台链接、中文操作指南、备份/恢复方法、真实增量费用、已通过和未通过项目；若产生 PR，用对应项目的代码与测试证据写描述并附加到本聊天。提交 `test: verify unified content management delivery`。

## 执行方式与审阅

推荐**原生执行**：由当前工程代理连续实施，上述内容合同、数据迁移、两站适配及发布状态机相互依赖，连续执行更容易保持一致；完成后进行独立审查。

也可选择**子代理逐任务执行**：每个任务由新的实施代理和审查代理完成，任务间逐一通过后继续。独立检查更频繁，但需要更多上下文和协调成本；两个站的文件所有权必须显式划分，不能同时编辑公共合同。

请审阅这份具体计划并选择执行方式。按用户指定 Superpowers 的 writing-plans 交接要求，在计划审阅和方式选择前不开始实施。选择方式不表示批准尚未列明的付费开通。

技术接口依据：[TanStack 服务端函数](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)、[TanStack HTTP 服务端路由](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes)。具体版本 API 仍以现有锁定版本及构建验证为准，不按最新文档盲目升级。
