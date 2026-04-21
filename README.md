# fhtml

Functional HTML builder and static site generator for [Bun](https://bun.sh). Write your pages as plain TypeScript — no templates, no JSX, no build plugins. Just functions that return strings.

```ts
import { html, body, h1, p, page, generate, createHead } from "./fhtml.ts";

await generate("index.html", page(
  html(
    createHead({ title: "Hello" }),
    body(
      h1("Hello, world!"),
      p("Built with fhtml."),
    ),
  ),
));
```

Output: `dist/index.html`.

---

## Installation

No npm package yet — just copy `fhtml.ts` into your project and import from it directly. Requires Bun.

---

## Core concepts

### Tags

Every HTML element is exported as a function. The optional first argument is a props object; the rest are children.

```ts
div({ class: "card", id: "main" }, "Hello")
// → <div class="card" id="main">Hello</div>

img({ src: "/logo.png", alt: "Logo" })
// → <img src="/logo.png" alt="Logo" />

a({ href: "https://example.com" }, "Visit us")
// → <a href="https://example.com">Visit us</a>
```

Boolean props work naturally:

```ts
input({ type: "checkbox", checked: true, disabled: false })
// → <input type="checkbox" checked />
```

### `page(node)`

Wraps a root node with `<!DOCTYPE html>` and flushes any accumulated `style()` and `script()` calls.

### `generate(filename, content)`

Writes content to `dist/<filename>`, creating directories as needed. On the first call it wipes `dist/` clean and copies the root-level `imports/` folder into `dist/imports/` if it exists.

```ts
await generate("index.html", page(html(...)));
await generate("about/index.html", page(html(...)));
```

### `createHead(config, ...children)`

Smart `<head>` builder. Handles titles, meta tags, Open Graph, canonical URLs, favicons, and asset imports.

```ts
createHead({
  title: "My Site",
  description: "A short description.",
  url: "https://example.com",
  icon: "/favicon.ico",
  thumbnail: "/og.png",
  author: "Jane Doe",
  imports: ["/style.css", "/app.defer.js"],
})
```

Any key not listed above becomes a `<meta name="..." content="...">` tag.

### `style(css)` and `script(js)`

Accumulate inline CSS and JS. `page()` flushes them into a single `<style>` in `<head>` and a single `<script>` before `</body>`.

```ts
style(`
  body { margin: 0; font-family: sans-serif; }
  h1 { color: #111; }
`);

script(`
  document.querySelector("h1").addEventListener("click", () => alert("hi"));
`);
```

External assets are emitted immediately as tags instead of accumulated:

```ts
style({ href: "/app.css" })
// → <link rel="stylesheet" href="/app.css" />

script({ src: "/app.js", defer: true })
// → <script src="/app.js" defer></script>
```

You can also pass inline data to a script, injected as a `window` variable:

```ts
script({ data: { items: [1, 2, 3] }, as: "appData" }, `
  console.log(window.appData.items);
`);
```

### Responsive helpers

`sm`, `md`, `lg`, `xl` wrap CSS in the corresponding `@media (min-width: ...)` query:

```ts
style(`p { font-size: 14px; }`);
md(`p { font-size: 16px; }`);
xl(`p { font-size: 18px; }`);
```

### `raw(str)`

Inject raw HTML without escaping — use when you know the string is already safe:

```ts
raw(`<svg>...</svg>`)
```

---

## SEO helpers

### `generateRobots(config)`

Writes `dist/robots.txt`.

```ts
await generateRobots({
  rules: [
    { userAgent: "*", allow: "/", disallow: ["/admin", "/private"] },
    { userAgent: "GPTBot", disallow: "/" },
  ],
  sitemap: "https://example.com/sitemap.xml",
});
```

### `generateSitemap(entries)`

Writes `dist/sitemap.xml` following the [sitemaps.org](https://www.sitemaps.org) schema.

```ts
await generateSitemap([
  { url: "https://example.com/",       changefreq: "weekly",  priority: 1.0 },
  { url: "https://example.com/about",  changefreq: "monthly", priority: 0.8 },
  { url: "https://example.com/blog",   changefreq: "daily",   priority: 0.6 },
]);
```

### `generateLlms(config)`

Writes `dist/llms.txt` following the [llmstxt.org](https://llmstxt.org) spec — a structured Markdown file that helps LLMs understand your site.

```ts
await generateLlms({
  name: "My Site",
  description: "A toolkit for building static sites with Bun.",
  url: "https://example.com",
  sections: [
    {
      title: "Docs",
      links: [
        { label: "Getting Started", url: "https://example.com/docs/start", description: "Installation and first steps" },
        { label: "API Reference",   url: "https://example.com/docs/api" },
      ],
    },
  ],
  notes: "Prefer linking to /docs/api for technical questions.",
});
```

### `generateSeo(config)`

Convenience wrapper — runs all three in parallel. Pass whichever keys you need.

```ts
await generateSeo({
  robots:  { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://example.com/sitemap.xml" },
  sitemap: [{ url: "https://example.com/", priority: 1.0 }],
  llms:    { name: "My Site", description: "...", url: "https://example.com", sections: [] },
});
```

---

## Full example

A complete two-page site with shared styles, a nav, and SEO files:

```ts
import {
  html, body, header, main, footer, nav, h1, h2, p, a, ul, li, span,
  page, generate, createHead, style, script, generateSeo,
} from "./fhtml.ts";

const BASE = "https://example.com";

function layout(title: string, content: unknown) {
  style(`
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; color: #111; }
    header { padding: 1rem 2rem; border-bottom: 1px solid #eee; display: flex; gap: 2rem; align-items: center; }
    main { padding: 2rem; max-width: 720px; margin: 0 auto; }
    footer { padding: 1rem 2rem; font-size: 0.85rem; color: #888; border-top: 1px solid #eee; }
  `);

  return page(
    html(
      createHead({ title, url: BASE, icon: "/favicon.ico" }),
      body(
        header(
          span({ style: "font-weight: bold" }, "MySite"),
          nav(
            a({ href: "/" }, "Home"),
            " · ",
            a({ href: "/about/" }, "About"),
          ),
        ),
        main(content),
        footer("© 2025 MySite"),
      ),
    ),
  );
}

await generate("index.html", layout("Home", [
  h1("Welcome"),
  p("This site is built with fhtml — functional HTML for Bun."),
]));

await generate("about/index.html", layout("About", [
  h1("About"),
  p("fhtml is a zero-dependency HTML builder and static site generator."),
]));

await generateSeo({
  robots: {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
  },
  sitemap: [
    { url: `${BASE}/`,       changefreq: "weekly",  priority: 1.0 },
    { url: `${BASE}/about/`, changefreq: "monthly", priority: 0.8 },
  ],
  llms: {
    name: "MySite",
    description: "A demo site built with fhtml, a functional HTML builder for Bun.",
    url: BASE,
    sections: [
      {
        title: "Pages",
        links: [
          { label: "Home",  url: `${BASE}/` },
          { label: "About", url: `${BASE}/about/` },
        ],
      },
    ],
  },
});
```

Run it:

```sh
bun run build.ts
```

Output:

```
dist/
├── imports/         # copied from root imports/ if present
├── index.html
├── about/
│   └── index.html
├── robots.txt
├── sitemap.xml
└── llms.txt
```

---

## API reference

| Export | Description |
|---|---|
| `tag(name, ...args)` | Low-level tag factory |
| `raw(str)` | Inject unescaped HTML |
| `render(node)` | Render any `Child` to a string |
| `page(node)` | Wrap with DOCTYPE, flush styles + scripts |
| `generate(file, content)` | Write to `dist/` |
| `createHead(config)` | Build a `<head>` with meta/OG/imports |
| `style(css)` | Accumulate inline CSS (or emit `<link>`) |
| `script(js)` | Accumulate inline JS (or emit `<script src>`) |
| `sm/md/lg/xl(css)` | Responsive `@media` wrappers |
| `generateRobots(config)` | Write `dist/robots.txt` |
| `generateSitemap(entries)` | Write `dist/sitemap.xml` |
| `generateLlms(config)` | Write `dist/llms.txt` |
| `generateSeo(config)` | Write all three SEO files in parallel |
