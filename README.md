# OpenInfinity Docs

[中文](#中文) · [English](#english)

## 中文

OpenInfinity 文档站（<https://docs.open-infinity.com>）的源码，基于 [Astro Starlight](https://starlight.astro.build)，由 GitHub Actions 部署到 GitHub Pages。默认中文，英文在 `/en/` 下。

### 写文档

- 页面放在 `src/content/docs/`，中文在根目录，英文放在 `src/content/docs/en/` 的同名路径下。
- 侧边栏按目录自动生成：`start/`（开始）、`guides/`（指南）、`reference/`（参考）。新建一个 `.md` 或 `.mdx` 文件，就会出现在对应分组里。
- 页面顶部的 `title` 和 `description` 必填；需要调整顺序时，在 frontmatter 里加 `sidebar: { order: 1 }`。
- 每页底部都有"编辑此页"链接，可以直接在 GitHub 上修改并提交。

```sh
npm install
npm run dev      # 本地预览
npm run build    # 输出到 dist/，同时生成站内搜索索引
```

## English

Source for the OpenInfinity docs (<https://docs.open-infinity.com>), built with [Astro Starlight](https://starlight.astro.build) and deployed to GitHub Pages by GitHub Actions. Chinese is the default; English lives under `/en/`.

### Writing docs

- Pages live in `src/content/docs/`: Chinese at the root, English at the same path under `src/content/docs/en/`.
- The sidebar is generated from folders: `start/` (Getting started), `guides/` (Guides), `reference/` (Reference). Add a `.md` or `.mdx` file and it appears in that group.
- `title` and `description` are required in the frontmatter; set `sidebar: { order: 1 }` to control ordering.
- Every page has an "Edit page" link for editing directly on GitHub.

```sh
npm install
npm run dev      # local preview
npm run build    # output in dist/, plus the search index
```

## License

Code and documentation text are under the [MIT License](LICENSE). The OpenInfinity name and logo are trademarks — see [TRADEMARK.md](https://github.com/OpenInfinity/design/blob/main/TRADEMARK.md). Geist is under the SIL Open Font License 1.1 (`src/assets/fonts/OFL.txt`).
