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

Or with the `cls` helper:

```javascript
button(cls("primary"), "Click me")
```

All HTML tags are available as global functions. Props go first (as an object), followed by children.

## Quick Start

```bash
# Make sure you have Bun installed
bun run fhtml.js
```

This watches all `.fhtml` files and compiles them to HTML on change.

## Available Helpers

```javascript
// Attributes
id("my-id")           // { id: "my-id" }
cls("btn", "large")  // { class: "btn large" }
css({ color: "red" }) // { style: "color:red" }
name("username")      // { name: "username" }
click("alert('hi')")  // { onclick: "alert('hi')" }

// Intersection Observer - adds class when element enters viewport
observe(".fade-in", "visible", { once: true })

// HTMX attributes
get("/api/users")
post("/api/users")
put("/api/users")
delete("/api/users")

// Fetch data from APIs with auto-refresh polling
fetch("https://api.example.com/users", ".user-list", template, { 
  refetchInterval: 5000  // poll every 5 seconds
})

// Form actions with swap support
action("#my-form", {
  url: "/api/users/:id",     // :id gets replaced with form value
  method: "POST",
  type: "param",             // "json" (default) or "param" - removes replaced keys from body
  swap: ".result-container", // where to display response
  loading: "Saving...",
  onSuccess: "e.target.reset()",
  template: div("Created: {name}")
})
```

## Components

Three template libraries are included:

- **default.js** - Modern, rounded aesthetic with Tailwind
- **brutalist.js** - Hard edges, borders, stark contrast
- **material.js** - Material Design inspired components

Import and use them in your `.fhtml` files:

```javascript
import { Button, Card, Navbar } from "./templates/brutalist"

html(
  body(
    Navbar({ brand: "My App", links: [...] }),
    Card({ title: "Hello", body: "World" }),
    Button({ label: "Click me", variant: "primary" })
  )
)
```

## Project Structure

```
fhtml.js              # Build script (runs with Bun)
templates/
  default.js          # Default component library
  brutalist.js        # Brutalist component library
  material.js         # Material Design component library
*.fhtml               # Your source files
*.html                # Compiled output
```

## Why?

Just a fun experiment. Sometimes you want to build HTML with the same composability as React but without the framework. This is that - zero dependencies, works in the browser or Node, no virtual DOM, just strings.

## License

MIT
