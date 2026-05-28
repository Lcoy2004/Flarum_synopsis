# Lcoy Synopsis

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/lcoy/synopsis.svg)](https://packagist.org/packages/lcoy/synopsis)

一个为 [Flarum](https://github.com/flarum/flarum) 论坛讨论列表添加摘要显示的扩展，支持媒体内容控制。

## 功能特点

除了显示可配置长度的摘要外，本扩展还提供以下功能：

- 所有显示文本均支持多语言翻译（已包含中文）
- 支持在纯文本和富文本摘要之间切换（管理员设置）
- 可选择使用首帖或末帖作为摘要内容（管理员设置）
- **富文本摘要仅显示一张图片或一个视频**
- **可配置摘要中图片和视频的最大高度和宽度**
- 用户可自行选择是否显示摘要
- 用户可选择在移动端是否显示摘要

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

- [Github](https://github.com/lcoy/synopsis)
- [Packagist](https://packagist.org/packages/lcoy/synopsis)

## 使用说明

### 媒体控制设置

本扩展特别增强了富文本摘要中的媒体控制功能：

1. **媒体限制**：富文本摘要只会显示第一个媒体元素（图片、视频或嵌入内容），避免摘要过长
2. **尺寸控制**：
   - `媒体最大高度`：设置摘要中图片和视频的最大高度（默认 200 像素）
   - `视频最大宽度`：设置摘要中视频的最大宽度（默认 320 像素）
3. **隐藏媒体**：将媒体最大高度设置为 0 可完全隐藏所有媒体内容

### 标签级别设置

如果您启用了 `flarum/tags` 扩展，每个标签都可以有独立的摘要设置，覆盖全局设置。