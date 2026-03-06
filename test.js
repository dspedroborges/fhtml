import { h, fetch, action, render, chart, modal, openModal } from "./fhtml.js";
const { html, body, div, h1, form, input, button, script, span, strong, p, img, head } = h;

const pageContent = html(
    head(
      {
        title: "Test",
        description: "Test",
        imports: [
            "./utils/libs/toast.js",
            "./utils/libs/dnd.js",
            "./utils/libs/aos.js",
            "./utils/libs/chart.js",
            "./utils/libs/dnd.js",
            "./utils/libs/tooltip.js",
            "./utils/libs/carousel.js"
        ]
      }
    ),
  body(

    h1("Rick and Morty Characters"),

    chart.pie({ labels: ["A", "B", "C"], data: [50, 20, 30]}),
    chart.line({
  labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"],
  data: [50, 20, 30, 21, 23, 43, 54, 5, 5, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7]
}),
    chart.bar({
  labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"],
  data: [50, 20, 30, 21, 23, 43, 54, 5, 5, 2, 3, 4, 1, 2, 3, 4, 5, 6, 7]
}),
    modal({ title: "Hello", content: div(p("Hello"), p("hi"), p("How are you?")), id: "myModal" }),
    button({ onclick: openModal("myModal", p("What up")) }, "Show modal"),

  div(
    { carousel: "1;auto=3000;bullets-carets" },
    div({ style: "width: 500px; height: 500px; background: tomato;" }),
    div({ style: "width: 500px; height: 500px; background: teal;" }),
    div({ style: "width: 500px; height: 500px; background: dodgerblue;" })
    ),

    div({ dnd: "drag", style: "width: 50px; height: 50px; background: #ccc;" }),
    div({ dnd: "drag", style: "width: 50px; height: 50px; background: #ccc;" }),
    div({ dnd: "drag", style: "width: 50px; height: 50px; background: #ccc;" }),

    div(
      { style: "display: flex; gap: 2rem;"},
      div({ dnd: "drop", style: "width: 200px; height: 500px; background: #eee; padding: 1rem" }),
      div({ dnd: "drop", style: "width: 200px; height: 500px; background: #eee; padding: 1rem" }),
      div({ dnd: "drop", style: "width: 200px; height: 500px; background: #eee; padding: 1rem" })
    ),

    div({ id: "character-list", onclick: "toast.success('test')" }),
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
        keys: ["results"],
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
        keys: ["results"],
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