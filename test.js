import { h, js, api, render } from "./fhtml.js";
const { html, body, div, h1, form, input, button, script, span, strong, p, img, head } = h;
const { action } = api;


const pageContent = html(
    head(
        {
            title: "Test",
            description: "Test",
        }
    ),
    body(

        h1("Rick and Morty Characters"),

        div({ id: "character-list", onclick: "toast.success('test')" }),
        span({ id: "loader", style: { display: "none" } }, "Loading..."),

        h1("Search Character"),

        div({ id: "search-result" }),
        form({ id: "search-form" },
            input({ name: "name", placeholder: "Character name (e.g. Rick)" }),
            button({ type: "submit" }, "Search")
        ),

        script(
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
            }),

            js(() => {
                console.log("Hello");
                const body = document.querySelector("body");
                console.log(body);
            })
        )
    )
);

await render({ filename: "index.html" }, pageContent, ["api"]);
