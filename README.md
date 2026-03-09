# Functional HTML (fhtml)

A tiny library that lets you write HTML using JavaScript function calls. No JSX, no build step beyond running a script with Bun, just functional composition. Built because sometimes you want the composability of React without the framework - zero dependencies, just strings.

## Getting Started

### Install

```bash
# Install Bun if you haven't
curl -fsSL https://bun.sh/install | bash

# Clone the repo
git clone https://github.com/dspedroborges/fhtml
cd fhtml

# Install dependencies
bun install
```

### Create a Page

Create your source file in the project root (e.g., `index.js`):

```javascript
import { html, body, div, h1, createHead, page, generate } from "./fhtml.js";

const content = page(
    html(
        createHead({ title: "My Page" }),
        body(
            div({ id: "app" },
                h1("Hello World")
            )
        )
    )
);

await generate("index.html", content);
```

### Build

```bash
bun run index.js
```

This runs your source file and generates HTML to `dist/`. Run it again whenever you make changes.

### Using Imports

Put your static assets (CSS, JS, images) in an `imports/` folder:

```
imports/
  styles.css
  app.js
  logo.png
```

Reference them in `createHead`:

```javascript
createHead({
    imports: ["styles.css", "app.js"]
})
```

They'll automatically be copied to `dist/imports/` on build.

## Usage

```javascript
import {
    html, body, div, h1, form, input, button, span, strong, p, img,
    script, createHead, page, generate,
} from "./fhtml.js";

// Build HTML with function calls
const myPage = div(
    h1("Hello World"),
    button({ class: "btn" }, "Click me")
);

// Create a full page with head metadata
const fullPage = page(
    html(
        createHead({
            title: "My Page",
            description: "A cool page",
            imports: ["styles.css", "app.js"]
        }),
        body(
            div({ id: "app" }, myPage)
        )
    )
);

// Generate static HTML file
await generate("index.html", fullPage);
```

## Passing Data from Server to Client

Use the `script` tag with a `data` property to inject server-side data into the client. The data is serialized as JSON and assigned to `window.__data__` before your inline code runs:

```javascript
script({
    data: {
        user: { name: "Alice", email: "alice@example.com" },
        config: { apiUrl: "/api" }
    },
}, () => {
    // window.__data__ is available here
    console.log(window.__data__.user.name); // "Alice"
    
    // Initialize your app
    initApp(window.__data__.config);
});
```

You can customize the variable name with the `as` option:

```javascript
script({ data: { ... }, as: "APP_DATA" }, () => {
    console.log(APP_DATA.user.name);
});
```

## Templates

Use `{{field}}` syntax in your templates to interpolate data:

```javascript
const characterTemplate = div(
    img({ src: "{{image}}" }),
    strong("{{name}}"),
    p("Status: {{status}}"),
    p("Species: {{species}}")
);
```

## Charts

Import and use the built-in chart helper to generate SVG charts:

```javascript
import { chart, raw } from "./fhtml.js";

// Bar chart
const barSvg = chart.bar({
    labels: ["Q1", "Q2", "Q3", "Q4"],
    data: [100, 200, 150, 300],
    colors: { bar: "steelblue", background: "#fafafa" }
});

// Use in your HTML
div(raw(barSvg))

// Line chart
chart.line({
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    data: [10, 25, 18, 30, 45],
    colors: { lines: ["tomato", "seagreen"] }
});

// Pie chart
chart.pie({
    labels: ["Dogs", "Cats", "Birds"],
    data: [40, 35, 25]
});
```

Available chart types: `bar`, `line`, `pie`. All return standalone SVG strings - wrap them with `raw()` when embedding.

## createHead Options

```javascript
createHead({
    title: "Page Title",           // <title> + og:title
    description: "Page description", // meta description + og:description
    author: "John Doe",
    thumbnail: "https://example.com/image.png", // og:image + twitter:card
    url: "https://example.com/page", // og:url + canonical link
    icon: "/favicon.svg",
    imports: ["styles.css", "app.js"] // .css → <link>, .js → <script defer>
})
```

## Project Structure

```
fhtml.js              # Build script (runs with Bun)
*.js                  # Your source files
dist/                 # Compiled output
imports/              # Static assets (copied to dist/imports/)
```

## License

MIT
