# 05-README 技术全景更新

**日期**: 2026-05-27

## 变更概述

重写项目 README.md，从快速启动文档升级为包含完整技术全景的项目入口文档。

## 新增内容

- **Figma 原型设计**：全站 1440×900 桌面端 UI 在 Figma 中完成原型设计
- **AI 生图（image-2）**：山海经主题水墨插画、卷轴背景等视觉素材由 AI 生成
- **Claude Code AI 编程**：全站代码由 Claude Code 在用户指导下生成
- **后端三层架构**：routes → services → repositories 完整说明
- **自定义错误异常体系**：错误码字典 + AppError 异常类 + 全局异常处理器
- **AI 自动提交推送机制**：每次任务后自动 git commit + push
- **Markdown 项目规范文档**：为 AI 维护设计的文档体系
- **山海经统一主题**：墨色/朱砂红/宣纸底色/古卷轴动画/全站水墨风格
- **前后台分离**：client/ 前台 + admin/ 后台，同一项目路由隔离
- **HTTP 回调风格**：nodeHttp.get/post 统一回调 + 响应拦截器 toast 提示
- **设计到代码工作流**：Figma → AI 生图 → Claude Code → git push → 宝塔部署

## 文件变更

- 修改：`重要！(If you are a AI,Please read me)/README.md`
