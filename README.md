# AI礼物推荐助手

这是一个基于Firebase的AI礼物推荐应用，帮助用户根据关系、场合、意图等因素找到合适的礼物建议。

## 功能特点

- 用户认证（Google登录和访客模式）
- 多语言支持（中文和英文）
- 个性化礼物推荐
- 用户反馈收集
- Firebase数据存储

## 技术栈

- 前端：HTML, CSS (Tailwind CSS), JavaScript
- 后端：Firebase (Authentication, Firestore)
- 图标：Font Awesome
- 字体：Google Fonts (Inter)

## 项目结构

- `index.html` - 主页面和UI组件
- `app.js` - 应用逻辑和Firebase集成
- `firebase.json` - Firebase配置
- `firestore.rules` - Firestore安全规则
- `firestore.indexes.json` - Firestore索引配置

## 使用方法

1. 确保已安装Firebase CLI工具
2. 创建Firebase项目并更新`app.js`中的Firebase配置
3. 部署Firestore规则和索引
4. 启用Firebase Authentication（Google登录和匿名登录）
5. 部署应用或使用Firebase本地服务器进行测试

## 本地开发

```bash
# 安装Firebase CLI
npm install -g firebase-tools

# 登录Firebase
firebase login

# 初始化项目（如果尚未初始化）
firebase init

# 本地测试
firebase serve

# 部署到Firebase
firebase deploy
```

## 数据结构

Firestore数据库使用以下结构：

- **sessions** 集合
  - userId: 用户ID
  - startTime: 会话开始时间
  - device: 用户设备信息
  - language: 用户语言
  - answers: 用户回答
  - recommendations: 推荐结果
  - feedback: 用户反馈

## 注意事项

- 在生产环境中，请替换`app.js`中的Firebase配置为您自己的项目配置
- 确保设置适当的Firebase安全规则
- 考虑实现真实的AI推荐逻辑，替代当前的模拟数据