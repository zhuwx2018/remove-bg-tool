# AI 背景去除工具

一个简单的在线工具，使用 remove.bg API 自动去除图片背景。

![Preview](https://via.placeholder.com/800x400/6c5ce7/ffffff?text=AI+Background+Remover)

## 功能特点

- 🎨 拖拽或点击上传图片
- 🔒 API Key 保存在本地浏览器
- 📱 响应式设计，支持手机
- ⚡ 快速处理
- 🔄 支持重新上传和下载

## 使用方法

### 1. 获取 API Key

1. 访问 [remove.bg](https://www.remove.bg/zh/api)
2. 注册账号
3. 在 API 页面获取你的 API Key
4. 免费版每月 50 次调用

### 2. 本地运行

```bash
# 克隆仓库
git clone https://github.com/你的用户名/remove-bg-tool.git
cd remove-bg-tool

# 使用 Python 本地服务器
python -m http.server 8000

# 或使用 PHP
php -S localhost:8000

# 然后访问 http://localhost:8000
```

### 3. 部署到 Cloudflare Pages

1. **Fork 此仓库** 或上传代码到你的 GitHub

2. **登录 Cloudflare Pages**
   - 访问 https://pages.cloudflare.com
   - 点击 "Create a project"

3. **连接 GitHub**
   - 选择你的仓库
   - 点击 "Begin setup"

4. **配置构建**
   - Build command: (留空)
   - Build output directory: (留空)
   - 点击 "Save and Deploy"

5. **完成！**
   - 访问生成的域名
   - 输入你的 remove.bg API Key 开始使用

## 项目结构

```
remove-bg-tool/
├── index.html      # 主页面
├── style.css       # 样式
├── script.js       # 逻辑
└── README.md       # 说明文档
```

## 技术栈

- HTML5
- CSS3 (响应式设计)
- JavaScript (原生)
- [remove.bg API](https://www.remove.bg/api)

## 注意事项

- 免费 API 每月 50 次调用
- 单张图片最大 10MB
- 支持 PNG, JPG, WEBP 格式

## 许可证

MIT License
