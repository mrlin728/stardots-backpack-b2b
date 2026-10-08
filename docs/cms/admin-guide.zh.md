# STARDOTS 双站中文内容后台

本文件对应 2026-10-01 的本地实施。新后台尚未上线，生产数据和域名没有切换。真实账号、私有 Storage、DeepSeek 和部署恢复须在隔离环境验收后才能宣布可用。

## 日常操作

上线并配置网站成员后，从鞋类网站的 `/admin/products` 进入统一后台。先选择“鞋类网站”或“箱包网站”；两站的草稿、图片和发布记录分别管理。原有线索、设计和视频入口继续使用原权限。

1. 新建产品或选择既有型号，填写中文、英文和本网站规格。修改 SKU 或网址时检查重复；改网址要明确确认，发布时建立旧网址跳转。
2. 上传 JPEG、PNG、WebP 或 AVIF，每张不超过 5 MiB。系统完整解码，保留私有原图，生成移除元数据的 WebP 展示图和卡片图。上传失败可逐张重试；上移/下移第一张图片就是改主图。
3. 填写中英文替代文字、来源说明和图片焦点。AI/概念/示意图片的来源说明须保留，不把它们当作真实工厂证据。
4. 保存草稿。保存、图片排序、隐藏产品都不会即时改动线上网站。
5. 如需英文辅助，先保存中文，再生成英文建议。核对数字、单位和商业事实后勾选英文确认并保存；修改中文后必须重新确认。辅助结果不会自动发布。
6. 打开当前已保存修订的预览，检查中英文及 375px/1440px 视口。预览只叠加选择的一个修订，链接 10 分钟有效，最多读取 20 次；地址栏移除票据，页面禁止索引并禁止提交询盘。
7. 在“发布记录”选择修订，确认后排队。只有网站 owner 可以发布。系统验证候选构建、页面、真实图片和生产域名后才显示“发布成功”。每站串行，另一站独立。
8. 发布失败先查看状态。“候选失败”没有切换域名；“已恢复旧版本”已验证旧部署和快照；“需要人工处理”会阻止继续自动发布，不能视为恢复成功。
9. 恢复历史版本会重新发布完整历史快照，保留内容和图片一起恢复，不直接修改当前草稿。

图片位置入口 `/admin/site-images` 管理两站首页、公司介绍及鞋类工厂页的固定位置。批量导入入口 `/admin/catalog-import` 接受产品内容 JSON 数组，写入新修订，版本冲突就停止。

## 上线前必须完成

- 在专用测试项目验证真实 Supabase Auth/RLS/Storage、owner/editor/非成员权限、四格式上传、断网、并发编辑、双语预览、发布与故障恢复。现有另一 Supabase 项目 `openvz-crm` 是无关系统，不能默认拿来做测试。
- 完成可恢复的数据库备份与 Storage 备份。当前已有产品快照和 366 张原图的校验备份，它们不等同于完整生产数据库备份。
- 完成两个源码仓库的认证访问。鞋类原始树的四张非运行时 PNG 暂未下载；Git 引用完整保留，运行时资产齐全。普通推送前须补齐缺失对象或使用正常认证 clone，不能删除这些引用来绕过问题。
- 核对当前 Supabase/Vercel/GitHub Actions 套餐、限额和预计用量。在未确认现有额度之前，不开启新的付费服务或定时发布 worker。
- 获取中国大陆真实网络、设备和日期的验收记录；本机测试不能冒充大陆网络验收。

## 受保护配置

`SUPABASE_SERVICE_ROLE_KEY` 仅用于鞋类服务端及受保护 worker，绝不使用 `VITE_` 前缀或传给浏览器。保留现有 DeepSeek 服务端配置；无配置时显示可操作的错误并保留草稿。

受保护 GitHub 环境 `content-production` 使用 `SUPABASE_SERVICE_ROLE_KEY`、`VERCEL_TOKEN`、`CMS_GITHUB_TOKEN`。跨私有源码仓库 token 只需读取指定仓库；凭据通过 Secrets 管理，不写入文件或聊天。若候选部署受保护，配置对应的 `VERCEL_AUTOMATION_BYPASS_SECRET`，且仅发送到该候选部署。

工作流默认关闭。全部验收通过后才设置仓库变量 `CMS_RELEASE_WORKER_ENABLED=true`。它从数据库领取 owner 已授权的任务，不接收浏览器指定任意仓库、域名或部署 ID。

CMS 成员只按明确的 Supabase Auth 用户 ID 加入 `cms_memberships`，不依据邮箱字符串、用户自行修改的 metadata 或原有 leads 权限自动授予。首版只配置确认过的 owner，禁止匿名注册自动获得后台权限。

## 切换顺序与恢复

1. 先准备完整备份、隔离验收证据和可审阅的两站代码提交。
2. 发布兼容快照代码的候选部署并验证，记录两站完整源提交、快照哈希和实际部署 ID。生产初始化需要显式 `CONTENT_BASELINE=1`；正常发布必须指定全部 release ID、snapshot 文件、snapshot SHA-256 和 source commit，缺任意项都停止构建。
3. 应用经审查的 CMS 迁移、明确成员授权和幂等基准导入。基准导入对冲突停止，不覆盖既有内容。鞋类 82 个私有基准实体保留；原先未发布的产品不会进入公开快照。箱包 67 个型号和原有 192 个双语页面保留。
4. 验证兼容代码后切换并登记 `cms_sites` 的 `source_commit`、`production_deployment_id` 和 `active_release_id`。历史基准 release 也必须补充真实 source/deployment 记录，确保恢复时存在版本端点和可信目标。
5. 配置受保护 worker，完成候选与生产故障注入，才开启日常发布。

worker 命令：

```sh
node scripts/content/release.mjs --site bags --release-id <已授权任务UUID>
```

验证 CLI 必须带不可变快照，避免仅凭版本端点报告成功：

```sh
node scripts/content/verify-release.mjs --base-url <可信部署URL> --site-id bags --release-id <UUID> --snapshot-hash <SHA256> --source-commit <40位提交> --snapshot-path <完整快照JSON> --output <验证证据JSON>
```

“需要人工处理”时先检查真实域名指向、旧部署状态、版本/hash/图片证据和数据库指针。禁止直接把任务 state 改成 published 来清除错误。只有恢复的域名及内容均验证后才能处理阻塞。

## 保留与费用

所有不可变修订、当前版本、草稿、最近 10 个成功发布版本引用的图片均保留。第 11 个版本的图片若仍被任意修订引用，也保留。清理脚本只输出候选，绝不删除历史文件或旧站文件。

```sh
node scripts/content/cleanup-assets.mjs --dry-run --site-id bags --metadata <完整私有引用元数据JSON> --output <候选清单JSON>
```

本次尚未开通或调用新的付费生产服务，也没有产生真实 DeepSeek 翻译调用。使用已有依赖；PGlite 仅在本地测试目录。后续 Storage、流量、候选构建、GitHub Actions 和翻译费用依实际调用及现有套餐计算，目前没有足够证据承诺“上线后零费用”。

## 本地运行与验证

两个项目安装原锁定依赖后，显式选择基准快照运行开发或构建；不要给测试混入生产凭据。

```sh
npm ci --ignore-scripts
CONTENT_BASELINE=1 npm run dev
CONTENT_BASELINE=1 npm run build
```

鞋类测试使用 Bun 1.3.14；若不在 PATH，应把已验证的本地运行时目录加入 PATH，避免旧测试中的子进程找不到 bun。数据库权限测试使用 work 目录内 PGlite，不连接生产项目。箱包用 `npm test`。

全项目 lint 的 62 个原有格式错误仍保留，集中在原 ONNX 产物和几份原文件；本次内容代码 lint 为 0 错误、6 警告。它们不能写成“全项目 lint 已通过”。
