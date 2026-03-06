import { h, fetch, action, render, fetchInit, actionInit } from "./fhtml.js";
const { html, body, div, h1, form, input, button, script, span, strong, p } = h;

const pageContent = html(
  body(
    h1("API Test"),
    
    div({ id: "post-list" }),
    span({ id: "loader", style: { display: "none" } }, "Loading..."),


    div({ id: "user-list" }),
    form({ id: "add-user-form" },
      input({ name: "title", placeholder: "Post title" }),
      button({ type: "submit" }, "Create Post")
    ),

    script(
      fetch({
        url: "https://jsonplaceholder.typicode.com/posts?_limit=5",
        target: "#post-list",
        loading: "#loader",
        template: div(strong("{title}"), p("{body}"))
      }),
      action("#add-user-form", {
        url: "https://jsonplaceholder.typicode.com/posts",
        method: "POST",
        target: "#user-list",
        template: div("New post created: ", strong("{title}"))
      })
    )
  )
);

await render({ filename: "index.html" }, pageContent);