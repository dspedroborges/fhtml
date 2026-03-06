import { h, fetch, action, render } from "./fhtml.js";
const { html, body, div, h1, form, input, button, script, span, strong, p, img } = h;

const pageContent = html(
  body(
    h1("Rick and Morty Characters"),

    div({ id: "character-list" }),
    span({ id: "loader", style: { display: "none" } }, "Loading..."),

    h1("Search Character"),

    div({ id: "search-result" }),
    form({ id: "search-form" },
      input({ name: "name", placeholder: "Character name (e.g. Rick)" }),
      button({ type: "submit" }, "Search")
    ),

    script(
      fetch({
        url: "https://rickandmortyapi.com/api/character",
        loading: "#loader",
        targets: ["#character-list"],
        dataKeys: ["results"],
        templates: [
          div(
            img({ src: "{image}", width: "80" }),
            div(
              strong("{name}"),
              p("Status: {status}"),
              p("Species: {species}")
            )
          )
        ]
      }),

      action("#search-form", {
        url: "https://rickandmortyapi.com/api/character/?name=:name",
        method: "GET",
        targets: ["#search-result"],
        dataKeys: ["results"],
        templates: [
          div(
            img({ src: "{image}", width: "120" }),
            div(
              strong("{name}"),
              p("Status: {status}"),
              p("Species: {species}"),
              p("Origin: {origin.name}")
            )
          )
        ]
      })
    )
  )
);

await render({ filename: "index.html" }, pageContent);