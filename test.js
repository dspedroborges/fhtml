import {
    html, body, div, h1, form, input, button, span, strong, p, img, nav,
    script, createHead, page, generate, raw,
} from "./app_dist/app.js";
import { chart } from "./app_dist/app.js";

const barSvg = chart.bar({
    labels: ["Q1", "Q2", "Q3", "Q4"],
    data: [100, 200, 150, 300],
    colors: { bar: "steelblue", background: "#fafafa" },
});

const characterTemplate = div(
    img({ src: "{{image}}", width: "120" }),
    div(
        strong("{{name}}"),
        p("Status: {{status}}"),
        p("Species: {{species}}"),
        p("Origin: {{origin.name}}"),
    )
);

script({
    data: {
        searchConfig: {
            url: "https://rickandmortyapi.com/api/character/?name=:name",
            method: "GET",
            targets: ["#search-result"],
            keys: ["results"],
            templates: [characterTemplate],
        },
    },
}, () => {
    action("#search-form", {
        ...__data__.searchConfig,
        onSuccess: (data) => console.log("Results:", data),
        onError: (err) => console.error("Error:", err),
    });
    console.log("Hello");
    console.log(document.querySelector("body"));
});

const navbar = () => {
    return nav("Hello");
}

const pageContent = page(
    html(
        createHead({
            title: "Test",
            description: "Test",
            imports: ["../imports/api.js"],
        }),
        body(
            div(raw(barSvg)),
            navbar(),
            h1("Rick and Morty Characters"),
            div({ id: "character-list" }),
            span({ id: "loader", style: "display:none" }, "Loading..."),
            h1("Search Character"),
            form({ id: "search-form" },
                input({ name: "name", placeholder: "Character name (e.g. Rick)" }),
                button({ type: "submit" }, "Search"),
            ),
            div({ id: "search-result" }),
        ),
    )
);

await generate("home/index.html", pageContent);
