# Lcoy Synopsis

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/lcoy/synopsis.svg)](https://packagist.org/packages/lcoy/synopsis)

一个为 [Flarum](https://github.com/flarum/flarum) v2 论坛讨论列表添加摘要显示的扩展，支持媒体内容控制。

## 功能特点

除了显示可配置长度的摘要外，本扩展还提供以下功能：

- 所有显示文本均支持多语言翻译（已包含中文）
- 支持在纯文本和富文本摘要之间切换（管理员设置）
- 可选择使用首帖或末帖作为摘要内容（管理员设置）
- **可配置摘要中显示的媒体数量**（1-10 张，超出自动截断）
- **多张图片自动横向排列**（flex 布局，兼容各种 HTML 结构）
- **可配置摘要中图片和视频的最大高度和宽度**
- 用户可自行选择是否显示摘要
- 用户可选择在移动端是否显示摘要

> **注意**：本扩展与 `fof/synopsis` 冲突，不能同时安装。如果已安装 `fof/synopsis`，请在安装本扩展前先移除：
> ```bash
> composer remove fof/synopsis
> ```

## 安装方法

```bash
composer require lcoy/synopsis
```

### 更新扩展

```bash
composer require lcoy/synopsis
php flarum migrate
php flarum cache:clear
```

## 相关链接

- [Github](https://github.com/Lcoy2004/Flarum_synopsis)
- [Packagist](https://packagist.org/packages/lcoy/synopsis)

## 使用说明

### 媒体控制设置

本扩展特别增强了富文本摘要中的媒体控制功能：

1. **媒体数量限制**：可配置摘要中最多显示的媒体数量（默认 4 张，范围 1-10）
2. **横向排列**：多张图片自动以 flex 布局横向排列，兼容各种 HTML 结构（同段落内、独立段落等）
3. **尺寸控制**：
   - `媒体最大高度`：设置摘要中图片和视频的最大高度（默认 200 像素）
   - `视频最大宽度`：设置摘要中视频的最大宽度（默认 320 像素）
4. **隐藏媒体**：将媒体最大高度设置为 0 可完全隐藏所有媒体内容

### 标签级别设置

如果您启用了 `flarum/tags` 扩展，每个标签都可以有独立的摘要设置，覆盖全局设置。