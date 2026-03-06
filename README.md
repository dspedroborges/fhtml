# Functional HTML (fhtml)

A pet project that lets you write HTML using JavaScript function calls. No JSX, no compilation step beyond running a small script, just pure functional composition.

## What is this?

This is a tiny experiment in building HTML declaratively using JavaScript. Instead of writing:

```html
<button class="primary">Click me</button>
```

You write:

```javascript
button({ class: "primary" }, "Click me")
```

All HTML tags are available as functions via `h`. Props go first (as an object), followed by children.

## Quick Start

```bash
# Make sure you have Bun installed
bun run fhtml.js
```

This watches all `.fhtml` files and compiles them to HTML on change.

## Available Helpers

```javascript
import { h, fetch, action, render } from "./fhtml.js";

const { div, button, span, ... } = h;

// Attributes
{ id: "my-id" }              // id attribute
{ class: "btn large" }       // class attribute
{ style: { color: "red" } } // style attribute (camelCase to kebab-case)
{ name: "username" }         // name attribute

// Better <head> meta tags
head({
  title: "My Page",
  description: "A cool page",
  author: "John Doe",
  thumbnail: "https://example.com/image.png",
  url: "https://example.com",
  icon: "/favicon.svg",
  imports: ["styles.css", "app.js"]
})

// Fetch data from APIs with auto-refresh polling
fetch({
  url: "https://api.example.com/users",
  target: ".user-list",
  template: div(span("{name}")),
  loading: ".loading-el",
  onSuccess: "(data) => console.log(data)",
  onError: "(err) => console.error(err)",
  refetchInterval: 5000
})

// Form actions with swap support
action("#my-form", {
  on: "submit",               // event to listen to (default: "submit")
  url: "/api/users/:id",     // :id gets replaced with form value
  method: "POST",
  target: ".result-container", // where to display response
  loading: ".loading-el",    // selector for loading element
  onSuccess: "(data) => console.log(data)",
  onError: "(err) => console.error(err)",
  template: div("Created: {name}")
})

// Render to file
await render({ filename: "output.html" }, htmlContent);
```

## Template Syntax

Use `{path.to.property}` in templates to interpolate data:

```javascript
template: div(span("{user.name}"), span("{user.email}"))
```

## Project Structure

```
fhtml.js              # Build script (runs with Bun)
*.fhtml               # Your source files
*.html                # Compiled output
```

## Why?

Just a fun experiment. Sometimes you want to build HTML with the same composability as React but without the framework. This is that - zero dependencies, works in the browser or Node, no virtual DOM, just strings.

## License

MIT
