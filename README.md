# Web2RSS - 网页转RSS订阅工具

一个简单的小工具，能够将任何网页转化为RSS订阅源，支持RSS Feed和Atom Feed格式，可零成本部署到Vercel平台。

## 功能特性

- ✅ 将任何网页转化为RSS订阅源
- ✅ 支持RSS Feed和Atom Feed两种格式
- ✅ 零成本部署到Vercel平台
- ✅ 适合小白新手使用
- ✅ 详细的使用说明文档

## 部署步骤

### 1. 准备工作

- 拥有GitHub账号
- 拥有Vercel账号
- 基本的GitHub操作知识

### 2. 克隆仓库

1. 点击页面右上角的 "Fork" 按钮，将此仓库复制到你的GitHub账号
2. 克隆你fork的仓库到本地

```bash
git clone https://github.com/your-username/web2rss.git
cd web2rss
```

### 3. 部署到Vercel

1. 访问 [Vercel官网](https://vercel.com/)
2. 点击 "Add New Project"
3. 选择 "Import from Git"
4. 选择你fork的仓库
5. 点击 "Deploy" 按钮
6. 等待部署完成

### 4. 访问API

部署完成后，你可以通过以下URL访问API：

- RSS Feed: `https://your-vercel-project.vercel.app/api/rss?url=https://example.com`
- Atom Feed: `https://your-vercel-project.vercel.app/api/atom?url=https://example.com`

## API使用说明

### RSS Feed API

**URL**: `/api/rss`

**参数**:
- `url` (必填): 要转化的网页URL

**示例**:
```
https://your-vercel-project.vercel.app/api/rss?url=https://www.example.com
```

### Atom Feed API

**URL**: `/api/atom`

**参数**:
- `url` (必填): 要转化的网页URL

**示例**:
```
https://your-vercel-project.vercel.app/api/atom?url=https://www.example.com
```

## 如何使用RSS订阅

1. 复制生成的RSS Feed或Atom Feed链接
2. 打开你的RSS阅读器（如Feedly、Inoreader等）
3. 添加新的订阅源，粘贴复制的链接
4. 保存并开始接收网页更新

## 常见问题

### Q: 为什么生成的Feed中只有链接，没有内容？
A: 由于不同网页的结构差异，工具目前只能提取网页中的链接作为Feed条目。

### Q: 生成的Feed无法被RSS阅读器识别？
A: 请检查URL参数是否正确，确保网页可以正常访问。

### Q: API响应速度很慢？
A: 响应速度取决于目标网页的加载速度和网络状况，一般会在3秒内返回结果。

### Q: 部署后无法访问API？
A: 请检查Vercel部署状态，确保部署成功。

## 技术栈

- Node.js
- Next.js
- Cheerio (网页解析)
- RSS (RSS Feed生成)
- Vercel (部署平台)

## 贡献

欢迎提交Issue和Pull Request来改进这个工具！

## 许可证

MIT License