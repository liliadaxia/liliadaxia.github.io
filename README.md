# LILIA VISUAL Portfolio

这是一个纯静态个人作品集网站，适合直接部署到 GitHub Pages。

## 文件结构

```text
index.html
works.html
about.html
contact.html
project-simonkids.html
project-campaign.html
project-ai-visual.html
css/style.css
js/main.js
js/animations.js
data/projects.js
images/
```

## 1. 如何替换图片

首页精选项目图片在：

```text
images/featured/
```

归档图片在：

```text
images/archive/archive-01.jpg
images/archive/archive-02.jpg
...
images/archive/archive-12.jpg
```

项目详情页图片在：

```text
images/projects/
```

替换图片时，最简单的方法是保持文件名不变，直接用你的真实作品图片覆盖同名文件。建议图片比例：

- 精选项目预览：4:3 或 4:5
- Archive 网格：4:5
- 项目详情大图：4:5
- 项目详情小图：4:3

图片建议压缩到 300KB-800KB 左右，移动端加载会更轻。

## 2. 如何新增项目

打开 `data/projects.js`，在 `siteProjects` 数组里复制一段项目对象，并修改：

```js
{
  number: "06",
  slug: "new-project",
  title: "新项目名称",
  type: "Brand identity / Campaign visual",
  year: "2026",
  status: "Selected",
  image: "images/featured/new-project.jpg",
  url: "project-new-project.html",
  summary: "这里写项目简介。",
  tags: ["品牌视觉", "商业物料"]
}
```

如果要新增详情页，可以复制任意一个 `project-*.html` 文件，改名为 `project-new-project.html`，再替换页面标题、说明和图片路径。

## 3. 如何修改首页文案

首页主要文案在 `index.html`：

- Header 名称：搜索 `LILIA VISUAL`
- Hero 小标签：搜索 `(Commercial Visual + Brand Direction)`
- Hero 主标题：搜索 `品牌视觉设计师 / Brand Visual Designer`
- 两段简介：在 `.hero-text` 区域内
- Now 区块：搜索 `<ul class="now-list">`
- 页脚联系方式：搜索 `Email available on request` 和 `WeChat`

项目名称、项目类型、评价内容和归档图片说明集中在 `data/projects.js`，后续维护时优先改这个文件。

## 4. 如何部署到 GitHub Pages

1. 把所有文件提交到 GitHub 仓库的 `main` 分支。
2. 确认 `index.html` 在仓库根目录，不要放进子文件夹。
3. 在 GitHub 仓库页面进入 `Settings`。
4. 打开 `Pages`。
5. `Build and deployment` 选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. 保存后等待 GitHub Pages 构建完成。

部署完成后，GitHub 会提供一个公开访问链接。
