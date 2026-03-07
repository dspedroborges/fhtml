// ============================================================
//  MATERIAL DESIGN 3 COMPONENT LIBRARY — VANJS
//  Style: Rounded surfaces · Elevation shadows · Tonal color
//  Theming via Tailwind `dark:` variant only.
//  All styling: vanilla Tailwind classes only.
// ============================================================


// ═══════════════════════════════════════════════════════════
//  PALETTE — edit here to retheme the entire library
//
//  Each token is a pair: [ lightValue, darkValue ]
//  Consumed by the T() helper below.
//  All values are plain Tailwind utility suffixes.
// ═══════════════════════════════════════════════════════════

const PALETTE = {
    // ── Brand / Primary ─────────────────────────────────────
    primary: ["indigo-600", "indigo-400"],
    primaryHover: ["indigo-500", "indigo-300"],
    primaryDark: ["indigo-700", "indigo-500"],
    primaryBg: ["indigo-600", "indigo-500"],
    primaryBgHover: ["indigo-500", "indigo-400"],
    primaryTonal: ["indigo-100", "indigo-950/60"],
    primaryTonalText: ["indigo-700", "indigo-300"],
    primaryTonalHover: ["indigo-200", "indigo-950"],
    primarySubtle: ["indigo-50", "indigo-950/40"],
    primaryRing: ["indigo-200", "indigo-800"],
    primaryGradFrom: ["indigo-50", "indigo-950/30"],
    primaryGradTo: ["purple-50", "purple-950/20"],
    primaryBand: ["indigo-600", "indigo-700"],
    primaryCta: ["indigo-600", "indigo-700"],
    primaryCtaVia: ["indigo-700", "indigo-800"],
    primaryCtaTo: ["purple-700", "purple-900"],

    // ── Avatar gradient ──────────────────────────────────────
    avatarFrom: ["indigo-400", "indigo-400"],
    avatarTo: ["purple-500", "purple-500"],

    // ── Neutral surface ──────────────────────────────────────
    surface: ["white", "neutral-900"],
    surfaceAlt: ["neutral-50", "neutral-900"],
    surfaceCard: ["white", "neutral-900"],
    surfaceInput: ["neutral-100", "neutral-800"],
    surfaceInputFocus: ["white", "neutral-800"],

    // ── Neutral foreground ───────────────────────────────────
    onSurface: ["neutral-900", "white"],
    onSurfaceMid: ["neutral-700", "neutral-300"],
    onSurfaceSub: ["neutral-600", "neutral-400"],
    onSurfaceMuted: ["neutral-500", "neutral-400"],
    onSurfaceFaint: ["neutral-400", "neutral-500"],
    onSurfaceDisabled: ["neutral-300", "neutral-600"],

    // ── Dividers ─────────────────────────────────────────────
    divider: ["neutral-100", "neutral-800"],
    dividerMid: ["neutral-200", "neutral-700"],
    dividerStrong: ["neutral-200", "neutral-800"],

    // ── Semantic: Success ────────────────────────────────────
    success: ["emerald-500", "emerald-400"],
    successBg: ["emerald-100", "emerald-950/60"],
    successText: ["emerald-700", "emerald-400"],
    successWrap: ["emerald-50", "emerald-950/30"],
    successRing: ["emerald-200", "emerald-800"],

    // ── Semantic: Warning ────────────────────────────────────
    warning: ["amber-400", "amber-400"],
    warningBg: ["amber-100", "amber-950/60"],
    warningText: ["amber-700", "amber-400"],
    warningWrap: ["amber-50", "amber-950/30"],
    warningRing: ["amber-200", "amber-800"],

    // ── Semantic: Danger ─────────────────────────────────────
    danger: ["red-600", "red-400"],
    dangerBg: ["red-100", "red-950/60"],
    dangerText: ["red-700", "red-400"],
    dangerWrap: ["red-50", "red-950/30"],
    dangerRing: ["red-200", "red-800"],
    dangerBgFilled: ["red-600", "red-500"],
    dangerBgHover: ["red-500", "red-400"],

    // ── Semantic: Info ───────────────────────────────────────
    info: ["blue-600", "blue-400"],
    infoBg: ["blue-100", "blue-950/60"],
    infoText: ["blue-700", "blue-400"],
    infoWrap: ["blue-50", "blue-950/30"],
    infoRing: ["blue-200", "blue-800"],

    // ── Footer ───────────────────────────────────────────────
    footerBg: ["neutral-950", "neutral-950"],
    footerText: ["neutral-300", "neutral-300"],
    footerMuted: ["neutral-500", "neutral-500"],
    footerFaint: ["neutral-600", "neutral-600"],
}


// ═══════════════════════════════════════════════════════════
//  TOKEN HELPERS
// ═══════════════════════════════════════════════════════════

function T(token, prefix = "text") {
    const pair = PALETTE[token]
    if (!pair) throw new Error(`Unknown palette token: "${token}"`)
    const [light, dark] = pair
    return `${prefix}-${light} dark:${prefix}-${dark}`
}

const bg = t => T(t, "bg")
const tx = t => T(t, "text")
const bdr = t => T(t, "border")
const rng = t => T(t, "ring")
const shd = t => T(t, "shadow")
const frm = t => T(t, "from")
const too = t => T(t, "to")
const via = t => T(t, "via")
const ph = t => T(t, "placeholder")
const divide = t => T(t, "divide")

// Convenience: join class strings, filtering falsy values
const cx = (...args) => args.filter(Boolean).join(" ")


// ═══════════════════════════════════════════════════════════
//  VANJS TAG ALIASES  (destructure from van.tags)
//  Import van from your project and pass it in, or replace
//  the block below with your own van instance.
// ═══════════════════════════════════════════════════════════

// Usage: import van from "vanjs-core"
// Then destructure as shown. For brevity we assume `van` is
// in scope when this module is loaded.

const {
    a, article, aside, button, details, div, fieldset, footer,
    h1, h2, h3, h5, input, label, legend, li, nav, p, section,
    span, summary, table, tbody, td, th, thead, tr, ul,
} = van.tags


// ═══════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════


// ─────────────────────────────────────────────
//  NAVBAR
// ─────────────────────────────────────────────

function Navbar({ brand = "Acme", links = [], cta = "Get Started" }) {
    const menuId = `nav-menu-${Math.random().toString(36).slice(2, 7)}`

    const toggleMenu = `
    (function(btn) {
      var menu = document.getElementById('${menuId}');
      var isHidden = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!isHidden));
    })(this)
  `.trim()

    return nav(
        { class: cx("w-full sticky top-0 z-50 px-6 lg:px-10 backdrop-blur-md shadow-sm bg-opacity-90", bg("surface")) },

        div(
            { class: "max-w-7xl mx-auto flex items-center justify-between h-16" },

            a({ class: cx("text-base font-semibold tracking-tight shrink-0", tx("primary")) }, brand),

            ul(
                { class: "hidden md:flex items-stretch h-16" },
                ...links.map(link =>
                    li(
                        { class: "relative group flex items-stretch" },

                        a(
                            {
                                class: cx(
                                    "flex items-center gap-1 px-4 text-sm font-medium transition-colors",
                                    tx("onSurfaceSub"),
                                    "hover:text-indigo-600 hover:bg-indigo-50"
                                )
                            },
                            link.label,
                            link.children ? span({ class: "ml-1 text-[10px] opacity-60" }, "▾") : null
                        ),

                        link.children
                            ? div(
                                {
                                    class: cx(
                                        "absolute top-full left-0 min-w-52 z-50 rounded-xl overflow-hidden py-2",
                                        bg("surface"),
                                        "shadow-xl shadow-black/10 dark:shadow-black/40",
                                        "ring-1 ring-black/5 dark:ring-white/10",
                                        "opacity-0 pointer-events-none -translate-y-2",
                                        "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-1",
                                        "transition-all duration-200"
                                    )
                                },
                                ul(
                                    {},
                                    ...link.children.map(child =>
                                        li(
                                            {},
                                            a(
                                                {
                                                    class: cx(
                                                        "flex items-center px-4 py-2.5 text-sm font-medium transition-colors",
                                                        tx("onSurfaceMid"),
                                                        "hover:text-indigo-600 hover:bg-indigo-50"
                                                    )
                                                },
                                                child.label
                                            )
                                        )
                                    )
                                )
                            )
                            : null
                    )
                )
            ),

            div(
                { class: "flex items-center gap-3" },

                button(
                    {
                        class: cx(
                            "hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold transition-all rounded-full text-white",
                            bg("primaryBg"),
                            "hover:bg-indigo-500 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40"
                        )
                    },
                    cta
                ),

                button(
                    {
                        class: cx("md:hidden flex flex-col gap-1.5 p-2 rounded-full transition-colors hover:bg-neutral-50"),
                        onclick: toggleMenu,
                        "aria-expanded": "false",
                        "aria-controls": menuId,
                        "aria-label": "Toggle menu",
                    },
                    span({ class: cx("block w-5 h-0.5 rounded-full", bg("onSurfaceMid")) }),
                    span({ class: cx("block w-5 h-0.5 rounded-full", bg("onSurfaceMid")) }),
                    span({ class: cx("block w-5 h-0.5 rounded-full", bg("onSurfaceMid")) })
                )
            )
        ),

        div(
            {
                id: menuId,
                class: cx("hidden md:hidden border-t pb-4 pt-2", bg("surface"), bdr("divider"))
            },

            ul(
                { class: "flex flex-col" },
                ...links.flatMap(link => [
                    li(
                        {},
                        a(
                            {
                                class: cx(
                                    "flex items-center px-4 py-3 text-sm font-semibold transition-colors rounded-xl mx-2",
                                    tx("onSurface"),
                                    "hover:bg-indigo-50 hover:text-indigo-600"
                                )
                            },
                            link.label
                        )
                    ),
                    ...(link.children || []).map(child =>
                        li(
                            {},
                            a(
                                {
                                    class: cx(
                                        "flex items-center pl-8 pr-4 py-2.5 text-sm font-medium transition-colors rounded-xl mx-2",
                                        tx("onSurfaceSub"),
                                        "hover:bg-indigo-50 hover:text-indigo-600"
                                    )
                                },
                                span({ class: "mr-2 text-xs opacity-30" }, "↳"),
                                child.label
                            )
                        )
                    ),
                ])
            ),

            div(
                { class: "px-4 pt-3" },
                button(
                    {
                        class: cx(
                            "w-full py-3 text-sm font-semibold transition-all rounded-full text-white",
                            bg("primaryBg"),
                            "hover:bg-indigo-500 shadow-md shadow-indigo-500/30"
                        )
                    },
                    cta
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────────────

function Sidebar({ items = [], footerLabel = "Settings", collapsed = false }) {
    const w = collapsed ? "w-[72px]" : "w-64"

    return aside(
        {
            class: cx(
                w, "h-full flex flex-col transition-all duration-300 shrink-0 rounded-r-3xl overflow-hidden",
                bg("surfaceAlt"),
                "shadow-lg shadow-black/5 dark:shadow-black/30"
            )
        },

        div(
            { class: cx("h-16 flex items-center", collapsed ? "justify-center px-4" : "px-5") },
            !collapsed ? span({ class: cx("text-sm font-semibold tracking-tight", tx("primary")) }, "Dashboard") : null,
            collapsed ? span({ class: cx("text-xl font-bold", tx("primary")) }, "D") : null
        ),

        nav(
            { class: "flex-1 overflow-y-auto py-2 px-3" },
            ...items.map((item, i) =>
                div(
                    { class: "relative group mb-1" },

                    a(
                        {
                            class: cx(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-2xl",
                                i === 0
                                    ? `${bg("primaryTonal")} ${tx("primaryTonalText")}`
                                    : `${tx("onSurfaceSub")} hover:bg-neutral-200 hover:text-neutral-900`
                            )
                        },
                        span({ class: "text-base shrink-0 font-medium" }, item.icon || "•"),
                        !collapsed ? span({ class: "flex-1 truncate" }, item.label) : null,
                        !collapsed && item.children ? span({ class: "text-[10px] opacity-40" }, "▸") : null
                    ),

                    item.children
                        ? div(
                            {
                                class: cx(
                                    "absolute left-full top-0 ml-2 min-w-48 z-50 rounded-xl overflow-hidden",
                                    bg("surface"),
                                    "shadow-xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10",
                                    "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150"
                                )
                            },
                            p({ class: cx("px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest border-b", tx("onSurfaceFaint"), bdr("divider")) }, item.label),
                            ...item.children.map(child =>
                                a(
                                    {
                                        class: cx(
                                            "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                                            tx("onSurfaceMid"),
                                            "hover:bg-indigo-50 hover:text-indigo-600"
                                        )
                                    },
                                    span({ class: "opacity-50 text-sm" }, child.icon || "·"),
                                    child.label
                                )
                            )
                        )
                        : null
                )
            )
        ),

        div(
            { class: cx("py-3 px-3 border-t", bdr("dividerStrong")) },
            a(
                {
                    class: cx(
                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-2xl",
                        tx("onSurfaceSub"),
                        "hover:bg-neutral-200 hover:text-neutral-900"
                    )
                },
                span({ class: "text-base" }, "⚙"),
                !collapsed ? span({}, footerLabel) : null
            )
        )
    )
}


// ─────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────

function Hero({ eyebrow = "", headline = "", sub = "", primaryCta = "Get Started", secondaryCta = "See how it works", badge = null }) {
    return section(
        {
            class: cx(
                "relative overflow-hidden py-28 md:py-40 px-6",
                `bg-gradient-to-br ${frm("primaryGradFrom")} via-white ${too("primaryGradTo")}`,
                "dark:via-neutral-950"
            )
        },

        div({ class: "absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.2),transparent)]" }),

        div(
            { class: "relative max-w-4xl mx-auto flex flex-col gap-8 text-center items-center" },

            div(
                { class: "flex flex-col items-center gap-4" },

                badge
                    ? div(
                        { class: cx("inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-1", bg("primaryTonal"), rng("primaryRing")) },
                        span({ class: cx("w-1.5 h-1.5 rounded-full animate-pulse", bg("primary")) }),
                        span({ class: cx("text-xs font-semibold", tx("primaryTonalText")) }, badge)
                    )
                    : null,

                eyebrow ? p({ class: cx("text-xs font-semibold uppercase tracking-widest", tx("primary")) }, eyebrow) : null,

                h1({ class: cx("text-5xl md:text-7xl font-bold leading-tight tracking-tight", tx("onSurface")) }, headline),
            ),

            div(
                { class: "flex flex-col items-center gap-6 pt-2" },

                p({ class: cx("text-lg leading-relaxed max-w-lg", tx("onSurfaceMuted")) }, sub),

                div(
                    { class: "flex flex-wrap items-center justify-center gap-3" },

                    button(
                        {
                            class: cx(
                                "inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all rounded-full text-white",
                                bg("primaryBg"),
                                "hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                            )
                        },
                        primaryCta, span({ class: "text-base" }, "→")
                    ),

                    button(
                        {
                            class: cx(
                                "inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all rounded-full hover:-translate-y-0.5",
                                bg("surface"), tx("onSurfaceMid"),
                                "shadow-md shadow-black/8 hover:shadow-lg ring-1", rng("dividerMid")
                            )
                        },
                        secondaryCta
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  FEATURES — grid
// ─────────────────────────────────────────────

function Features({ eyebrow = "Features", headline = "", sub = "", items = [] }) {
    return section(
        { class: cx("py-24 md:py-32 px-6", bg("surface")) },

        div(
            { class: "max-w-7xl mx-auto" },

            div(
                { class: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16" },
                div(
                    { class: "flex flex-col gap-3" },
                    eyebrow ? p({ class: cx("text-xs font-semibold uppercase tracking-widest", tx("primary")) }, eyebrow) : null,
                    h2({ class: cx("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")) }, headline),
                ),
                sub ? p({ class: cx("text-sm leading-relaxed max-w-xs md:text-right", tx("onSurfaceMuted")) }, sub) : null
            ),

            div(
                { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" },
                ...items.map(item =>
                    div(
                        {
                            class: cx(
                                "flex flex-col gap-5 p-7 rounded-3xl group transition-all duration-300 cursor-default",
                                bg("surfaceAlt"),
                                "hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1"
                            )
                        },
                        span(
                            { class: cx("text-2xl w-12 h-12 flex items-center justify-center rounded-2xl transition-colors", bg("primaryTonal"), "group-hover:bg-white/20") },
                            item.icon || "◆"
                        ),
                        div(
                            { class: "flex flex-col gap-2" },
                            h3({ class: cx("text-sm font-semibold tracking-tight transition-colors group-hover:text-white", tx("onSurface")) }, item.title),
                            p({ class: cx("text-xs leading-relaxed transition-colors group-hover:text-white/70", tx("onSurfaceMuted")) }, item.description)
                        )
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  FEATURES ALTERNATE — staggered rows
// ─────────────────────────────────────────────

function FeaturesAlternate({ items = [] }) {
    return section(
        { class: cx("py-12 px-6", bg("surface")) },

        div(
            { class: "max-w-7xl mx-auto flex flex-col gap-8" },
            ...items.map((item, i) =>
                div(
                    {
                        class: cx(
                            "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl overflow-hidden",
                            bg("surfaceAlt"),
                            i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
                        )
                    },

                    div(
                        { class: "flex flex-col justify-center gap-5 p-10 lg:p-14" },
                        item.eyebrow ? span({ class: cx("text-xs font-semibold uppercase tracking-widest", tx("primary")) }, item.eyebrow) : null,
                        h2({ class: cx("text-3xl md:text-4xl font-bold leading-tight tracking-tight", tx("onSurface")) }, item.title),
                        p({ class: cx("text-sm leading-relaxed max-w-sm", tx("onSurfaceMuted")) }, item.description),
                        item.cta
                            ? a(
                                {
                                    class: cx(
                                        "inline-flex items-center gap-2 w-fit px-5 py-2.5 text-sm font-semibold transition-all rounded-full text-white",
                                        bg("primaryBg"),
                                        "hover:bg-indigo-500 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30"
                                    )
                                },
                                item.cta, span({}, "→")
                            )
                            : null
                    ),

                    div(
                        { class: cx("aspect-video flex items-center justify-center", `bg-gradient-to-br ${frm("primaryTonal")} ${too("primaryGradTo")}`) },
                        item.visual || span({ class: "text-5xl text-indigo-300/50 dark:text-indigo-700/50" }, "◈")
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  LOGOS BAR
// ─────────────────────────────────────────────

function LogosBar({ label = "Trusted by teams at", logos = [] }) {
    return section(
        { class: cx("py-12 px-6", bg("surfaceAlt")) },

        div(
            { class: "max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12" },

            p({ class: cx("text-xs font-semibold uppercase tracking-widest shrink-0", tx("onSurfaceFaint")) }, label),

            div({ class: cx("w-px h-8 hidden md:block shrink-0", bg("dividerMid")) }),

            div(
                { class: "flex flex-wrap items-center justify-center md:justify-start gap-8" },
                ...logos.map(logo =>
                    div(
                        { class: cx("flex items-center gap-2 text-sm font-semibold transition-colors", tx("onSurfaceDisabled"), "hover:text-neutral-700") },
                        logo.icon ? span({ class: "text-lg" }, logo.icon) : null,
                        span({}, logo.name)
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  TESTIMONIALS
// ─────────────────────────────────────────────

function Testimonials({ eyebrow = "Testimonials", headline = "Loved by teams", items = [] }) {
    return section(
        { class: cx("py-24 md:py-32 px-6", bg("surfaceAlt")) },
        div(
            { class: "max-w-7xl mx-auto" },

            div(
                { class: "mb-16 text-center" },
                eyebrow ? p({ class: cx("text-xs font-semibold uppercase tracking-widest mb-3", tx("primary")) }, eyebrow) : null,
                h2({ class: cx("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")) }, headline)
            ),

            div(
                { class: "grid grid-cols-1 md:grid-cols-3 gap-5" },
                ...items.map(item =>
                    div(
                        { class: cx("flex flex-col justify-between gap-8 p-7 rounded-3xl shadow-sm shadow-black/5 dark:shadow-black/20 ring-1", bg("surfaceCard"), rng("divider")) },

                        p({ class: cx("text-sm leading-relaxed", tx("onSurfaceSub")) }, `"${item.quote}"`),

                        div(
                            { class: cx("flex items-center gap-3 pt-5 border-t", bdr("divider")) },
                            div(
                                { class: cx("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold", `bg-gradient-to-br ${frm("avatarFrom")} ${too("avatarTo")}`) },
                                item.name.split(" ").map(n => n[0]).join("").slice(0, 2)
                            ),
                            div(
                                { class: "flex flex-col gap-0.5" },
                                p({ class: cx("text-xs font-semibold", tx("onSurface")) }, item.name),
                                p({ class: cx("text-[10px] font-medium", tx("onSurfaceFaint")) }, item.title)
                            )
                        )
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  PRICING
// ─────────────────────────────────────────────

function Pricing({ eyebrow = "Pricing", headline = "Simple, honest pricing", sub = "", plans = [] }) {
    return section(
        { class: cx("py-24 md:py-32 px-6", bg("surface")) },
        div(
            { class: "max-w-6xl mx-auto" },

            div(
                { class: "mb-16 text-center" },
                eyebrow ? p({ class: cx("text-xs font-semibold uppercase tracking-widest mb-3", tx("primary")) }, eyebrow) : null,
                h2({ class: cx("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")) }, headline),
                sub ? p({ class: cx("mt-4 text-sm", tx("onSurfaceMuted")) }, sub) : null
            ),

            div(
                { class: "grid grid-cols-1 md:grid-cols-3 gap-5 items-start" },
                ...plans.map(plan =>
                    div(
                        {
                            class: cx(
                                "flex flex-col rounded-3xl overflow-hidden",
                                plan.highlighted
                                    ? `${bg("primaryBg")} text-white shadow-2xl shadow-indigo-500/30 scale-[1.02]`
                                    : `${bg("surfaceAlt")} shadow-sm shadow-black/5 ring-1 ${rng("divider")}`
                            )
                        },

                        div(
                            { class: "p-8 pb-6" },
                            p({ class: cx("text-xs font-semibold uppercase tracking-widest mb-5", plan.highlighted ? "text-indigo-200" : tx("primary")) }, plan.name),
                            div(
                                { class: "flex items-end gap-1.5 mb-3" },
                                span({ class: cx("text-5xl font-bold leading-none tracking-tight", plan.highlighted ? "text-white" : tx("onSurface")) }, plan.price),
                                span({ class: cx("text-sm font-medium mb-1", plan.highlighted ? "text-indigo-200" : tx("onSurfaceFaint")) }, plan.period || "/mo")
                            ),
                            plan.description ? p({ class: cx("text-xs leading-relaxed", plan.highlighted ? "text-indigo-100" : tx("onSurfaceMuted")) }, plan.description) : null
                        ),

                        div(
                            { class: "px-8 pb-8 flex-1" },
                            ul(
                                { class: "flex flex-col gap-3 mb-8" },
                                ...(plan.features || []).map(feature =>
                                    li(
                                        { class: "flex items-start gap-3 text-sm" },
                                        span(
                                            {
                                                class: cx(
                                                    "shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                                                    plan.highlighted ? "bg-white/20 text-white" : `${bg("primaryTonal")} ${tx("primaryTonalText")}`
                                                )
                                            },
                                            "✓"
                                        ),
                                        span({ class: plan.highlighted ? "text-indigo-100" : tx("onSurfaceSub") }, feature)
                                    )
                                )
                            ),

                            button(
                                {
                                    class: cx(
                                        "w-full py-3 text-sm font-semibold transition-all rounded-full",
                                        plan.highlighted
                                            ? `${bg("surface")} ${tx("primary")} hover:bg-indigo-50 shadow-md`
                                            : `${bg("primaryBg")} text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/25`
                                    )
                                },
                                plan.cta || "Get Started"
                            )
                        )
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────

function FAQ({ eyebrow = "FAQ", headline = "Frequently asked questions", items = [] }) {
    return section(
        { class: cx("py-24 md:py-32 px-6", bg("surface")) },
        div(
            { class: "max-w-2xl mx-auto" },

            div(
                { class: "mb-12 text-center" },
                eyebrow ? p({ class: cx("text-xs font-semibold uppercase tracking-widest mb-3", tx("primary")) }, eyebrow) : null,
                h2({ class: cx("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")) }, headline)
            ),

            div(
                { class: "flex flex-col gap-3" },
                ...items.map(item =>
                    details(
                        { class: cx("group rounded-2xl overflow-hidden ring-1", bg("surfaceAlt"), rng("divider")) },

                        summary(
                            {
                                class: cx(
                                    "flex items-center justify-between gap-4 p-5 cursor-pointer select-none list-none appearance-none [&::-webkit-details-marker]:hidden transition-colors",
                                    "hover:bg-indigo-50"
                                )
                            },
                            span({ class: cx("text-sm font-medium", tx("onSurface")) }, item.question),
                            span(
                                {
                                    class: cx(
                                        "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                                        bg("primaryTonal"), tx("primaryTonalText"),
                                        "group-open:rotate-45 group-open:bg-indigo-600 group-open:text-white"
                                    )
                                },
                                "+"
                            )
                        ),

                        div(
                            { class: "px-5 pb-5" },
                            p({ class: cx("text-sm leading-relaxed", tx("onSurfaceMuted")) }, item.answer)
                        )
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  STATS BAND
// ─────────────────────────────────────────────

function StatsBand({ items = [] }) {
    return section(
        { class: cx("py-6 px-6", bg("primaryBand")) },
        div(
            { class: "max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6" },
            ...items.map(item =>
                div(
                    { class: "flex flex-col gap-1 px-6 py-8 text-center rounded-2xl bg-white/10" },
                    span({ class: "text-4xl md:text-5xl font-bold tabular-nums tracking-tight leading-none text-white" }, item.value),
                    span({ class: "text-xs font-medium uppercase tracking-wider mt-2 text-indigo-200" }, item.label)
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  CTA BAND
// ─────────────────────────────────────────────

function CTABand({ headline = "Ready to get started?", sub = "", primaryCta = "Start for free", secondaryCta = "Talk to sales" }) {
    return section(
        { class: cx("py-20 px-6", `bg-gradient-to-br ${frm("primaryCta")} ${via("primaryCtaVia")} ${too("primaryCtaTo")}`) },

        div(
            { class: "max-w-4xl mx-auto text-center flex flex-col items-center gap-8" },

            div(
                { class: "flex flex-col items-center gap-4" },
                h2({ class: "text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white" }, headline),
                sub ? p({ class: "text-base text-indigo-200 max-w-md leading-relaxed" }, sub) : null
            ),

            div(
                { class: "flex flex-wrap items-center justify-center gap-3" },

                button(
                    { class: "px-8 py-3.5 text-sm font-semibold transition-all rounded-full hover:-translate-y-0.5 bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl shadow-black/20" },
                    primaryCta
                ),

                button(
                    { class: "px-8 py-3.5 text-sm font-semibold transition-all rounded-full hover:-translate-y-0.5 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/30" },
                    secondaryCta
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────

function Footer({ brand = "Acme", columns = [], copyright = "" }) {
    return footer(
        { class: cx(bg("footerBg"), tx("footerText")) },
        div(
            { class: "max-w-7xl mx-auto px-6 lg:px-10" },

            div(
                { class: "grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-neutral-800" },

                div(
                    { class: "col-span-2 md:col-span-1" },
                    p({ class: "text-base font-semibold tracking-tight mb-3 text-white" }, brand),
                    p({ class: cx("text-sm leading-relaxed max-w-xs", tx("footerMuted")) }, "Building the tools that move modern teams forward.")
                ),

                ...columns.map(col =>
                    div(
                        {},
                        h5({ class: cx("text-xs font-semibold uppercase tracking-widest mb-5", tx("footerMuted")) }, col.title),
                        ul(
                            { class: "flex flex-col gap-3" },
                            ...col.links.map(link =>
                                li({}, a({ class: cx("text-sm font-medium transition-colors hover:text-white", tx("footerMuted")) }, link.label))
                            )
                        )
                    )
                )
            ),

            div(
                { class: "flex flex-col sm:flex-row items-center justify-between gap-4 py-6" },
                p({ class: cx("text-xs font-medium", tx("footerFaint")) }, copyright || `© ${new Date().getFullYear()} ${brand}`),
                div(
                    { class: "flex gap-6" },
                    a({ class: cx("text-xs font-medium transition-colors hover:text-white", tx("footerFaint")) }, "Privacy"),
                    a({ class: cx("text-xs font-medium transition-colors hover:text-white", tx("footerFaint")) }, "Terms"),
                    a({ class: cx("text-xs font-medium transition-colors hover:text-white", tx("footerFaint")) }, "Cookies")
                )
            )
        )
    )
}


// ═══════════════════════════════════════════════════════════
//  UI COMPONENTS
// ═══════════════════════════════════════════════════════════


// ─────────────────────────────────────────────
//  BUTTON
// ─────────────────────────────────────────────

function Button({ label: labelText = "Click", variant = "primary", size = "md", disabled = false, icon = null }) {
    const sizes = {
        sm: "px-4 py-1.5 text-xs",
        md: "px-5 py-2.5 text-sm",
        lg: "px-7 py-3.5 text-base",
    }

    const variants = {
        primary: `${bg("primaryBg")} text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/25 hover:shadow-lg`,
        secondary: `${bg("primaryTonal")} ${tx("primaryTonalText")} hover:bg-indigo-200`,
        ghost: `bg-transparent ${tx("primary")} hover:bg-indigo-50`,
        danger: `${bg("dangerBgFilled")} text-white hover:bg-red-500 shadow-md shadow-red-500/25`,
        outline: `bg-transparent ${tx("primary")} ring-1 ${rng("primaryRing")} hover:bg-indigo-50`,
    }

    return button(
        {
            class: cx(
                "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-full",
                sizes[size], variants[variant],
                disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:-translate-y-px"
            ),
            disabled: disabled || undefined,
        },
        icon ? span({}, icon) : null,
        labelText
    )
}


// ─────────────────────────────────────────────
//  CARD
// ─────────────────────────────────────────────

function Card({ title = "", body = "", footer: footerContent = null, badge = null }) {
    return article(
        { class: cx("rounded-3xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-black/20 ring-1", bg("surfaceCard"), rng("divider")) },

        div(
            { class: "p-6 flex flex-col gap-3" },
            badge ? span({ class: cx("inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full w-fit", bg("primaryTonal"), tx("primaryTonalText")) }, badge) : null,
            title ? h3({ class: cx("text-base font-semibold tracking-tight", tx("onSurface")) }, title) : null,
            body ? p({ class: cx("text-sm leading-relaxed", tx("onSurfaceMuted")) }, body) : null,
        ),

        footerContent ? div({ class: cx("px-6 pb-6 pt-4 border-t", bdr("divider")) }, footerContent) : null
    )
}


// ─────────────────────────────────────────────
//  BADGE
// ─────────────────────────────────────────────

function Badge({ label: labelText = "", variant = "default" }) {
    const variants = {
        default: `${bg("surfaceAlt")} ${tx("onSurfaceMid")}`,
        success: `${bg("successBg")} ${tx("successText")}`,
        warning: `${bg("warningBg")} ${tx("warningText")}`,
        danger: `${bg("dangerBg")}  ${tx("dangerText")}`,
        info: `${bg("infoBg")}    ${tx("infoText")}`,
    }
    return span(
        { class: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}` },
        labelText
    )
}


// ─────────────────────────────────────────────
//  AVATAR
// ─────────────────────────────────────────────

function Avatar({ name = "User", size = "md", status = null }) {
    const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm", xl: "w-16 h-16 text-base" }
    const statusColors = {
        online: bg("success"),
        offline: bg("onSurfaceDisabled"),
        away: bg("warning"),
    }
    const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

    return div(
        { class: "relative inline-flex shrink-0" },
        div(
            { class: cx(sizes[size], "rounded-full flex items-center justify-center font-semibold text-white shadow-md shadow-indigo-500/20", `bg-gradient-to-br ${frm("avatarFrom")} ${too("avatarTo")}`) },
            initials
        ),
        status
            ? span({ class: cx("absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-neutral-900", statusColors[status]) })
            : null
    )
}


// ─────────────────────────────────────────────
//  ALERT
// ─────────────────────────────────────────────

function Alert({ title = "", message = "", variant = "info" }) {
    const styles = {
        info: { wrap: `${bg("infoWrap")} ring-1 ${rng("infoRing")}`, icon: `${bg("infoBg")} ${tx("info")}`, label: tx("infoText"), body: tx("info") },
        success: { wrap: `${bg("successWrap")} ring-1 ${rng("successRing")}`, icon: `${bg("successBg")} ${tx("success")}`, label: tx("successText"), body: tx("success") },
        warning: { wrap: `${bg("warningWrap")} ring-1 ${rng("warningRing")}`, icon: `${bg("warningBg")} ${tx("warning")}`, label: tx("warningText"), body: tx("warning") },
        danger: { wrap: `${bg("dangerWrap")} ring-1 ${rng("dangerRing")}`, icon: `${bg("dangerBg")} ${tx("danger")}`, label: tx("dangerText"), body: tx("danger") },
    }
    const icons = { info: "i", success: "✓", warning: "!", danger: "✕" }
    const s = styles[variant]

    return div(
        { class: `flex gap-4 p-4 rounded-2xl ${s.wrap}` },
        span({ class: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${s.icon}` }, icons[variant]),
        div(
            { class: "flex flex-col gap-1" },
            title ? p({ class: `text-sm font-semibold ${s.label}` }, title) : null,
            message ? p({ class: `text-xs leading-relaxed ${s.body}` }, message) : null
        )
    )
}


// ─────────────────────────────────────────────
//  INPUT FIELD
// ─────────────────────────────────────────────

function InputField({ label: labelText = "", placeholder = "", type = "text", hint = "", error = "" }) {
    return div(
        { class: "flex flex-col gap-1.5" },

        labelText
            ? label({ class: cx("text-xs font-semibold", tx("onSurfaceMid")) }, labelText)
            : null,

        input({
            class: cx(
                "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all",
                bg("surfaceInput"), tx("onSurface"), ph("onSurfaceFaint"),
                "focus:ring-2 focus:ring-indigo-500/40",
                error ? `ring-2 ${rng("danger")} ${bg("dangerWrap").split(" ")[0]}` : ""
            ),
            type,
            placeholder,
        }),

        error ? span({ class: cx("text-xs font-medium", tx("dangerText")) }, error) : null,
        !error && hint ? span({ class: cx("text-xs", tx("onSurfaceFaint")) }, hint) : null
    )
}


// ─────────────────────────────────────────────
//  FORM GROUP
// ─────────────────────────────────────────────

function FormGroup({ legend: legendText = "", hint = "", error = "", children = [] }) {
    return fieldset(
        { class: cx("rounded-2xl ring-1 p-6 flex flex-col gap-5", bg("surfaceCard"), rng("divider")) },

        legendText
            ? legend({ class: cx("text-xs font-bold uppercase tracking-widest px-1 -mx-1 float-left w-full mb-1", tx("primary")) }, legendText)
            : null,

        hint ? p({ class: cx("text-xs leading-relaxed", tx("onSurfaceFaint")) }, hint) : null,

        ...children,

        error
            ? div(
                { class: `flex items-start gap-2.5 mt-1 p-3 rounded-xl ring-1 ${bg("dangerWrap")} ${rng("dangerRing")}` },
                span({ class: `w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-px ${bg("dangerBg")} ${tx("dangerText")}` }, "!"),
                p({ class: `text-xs leading-relaxed ${tx("dangerText")}` }, error)
            )
            : null
    )
}


// ─────────────────────────────────────────────
//  TABLE
// ─────────────────────────────────────────────

function Table({ columns = [], rows = [] }) {
    return div(
        { class: cx("rounded-2xl overflow-hidden shadow-sm shadow-black/5 ring-1", bg("surface"), rng("dividerMid")) },
        div(
            { class: "overflow-x-auto" },
            table(
                { class: "min-w-full" },

                thead(
                    {},
                    tr(
                        { class: cx("border-b", bg("surfaceAlt"), bdr("dividerMid")) },
                        ...columns.map(col =>
                            th({ class: cx("px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest", tx("onSurfaceFaint")) }, col.label)
                        )
                    )
                ),

                tbody(
                    {},
                    ...rows.map(row =>
                        tr(
                            { class: cx("border-b last:border-b-0 transition-colors hover:bg-indigo-50", bdr("divider")) },
                            ...columns.map(col =>
                                td({ class: cx("px-5 py-3.5 text-sm", tx("onSurfaceMid")) }, row[col.key] ?? "—")
                            )
                        )
                    )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  TABS
// ─────────────────────────────────────────────

function Tabs({ tabs = [], activeIndex = 0 }) {
    return div(
        { class: cx("flex gap-1 p-1 rounded-xl", bg("surfaceInput")) },
        ...tabs.map((tab, i) =>
            button(
                {
                    class: cx(
                        "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all rounded-lg",
                        i === activeIndex
                            ? `${bg("surface")} ${tx("onSurface")} shadow-sm`
                            : `${tx("onSurfaceFaint")} hover:text-neutral-700`
                    )
                },
                tab.icon ? span({ class: "text-sm" }, tab.icon) : null,
                tab.label
            )
        )
    )
}


// ─────────────────────────────────────────────
//  MODAL
// ─────────────────────────────────────────────

function Modal({ title = "Dialog", body: bodyText = "", actions = [], size = "md" }) {
    const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }
    return div(
        { class: "fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" },
        div(
            { class: cx(`w-full ${sizes[size]} rounded-3xl overflow-hidden shadow-2xl shadow-black/20`, bg("surfaceCard")) },

            div(
                { class: cx("flex items-center justify-between px-6 py-4 border-t-0 border-b", bdr("divider")) },
                h2({ class: cx("text-sm font-semibold", tx("onSurface")) }, title),
                button(
                    { class: cx("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors", tx("onSurfaceFaint"), "hover:bg-neutral-50") },
                    "✕"
                )
            ),

            div({ class: "px-6 py-5" }, p({ class: cx("text-sm leading-relaxed", tx("onSurfaceMuted")) }, bodyText)),

            actions.length > 0
                ? div(
                    { class: cx("flex items-center justify-end gap-2 px-6 py-4 border-t", bdr("divider")) },
                    ...actions
                )
                : null
        )
    )
}


// ─────────────────────────────────────────────
//  STAT CARD
// ─────────────────────────────────────────────

function StatCard({ label: labelText = "", value = "", delta = null, icon = null }) {
    const isPos = delta && !delta.startsWith("-")
    return div(
        { class: cx("p-6 flex flex-col gap-4 rounded-3xl shadow-sm shadow-black/5 dark:shadow-black/20 ring-1", bg("surfaceCard"), rng("divider")) },

        div(
            { class: "flex items-start justify-between" },
            div(
                { class: "flex flex-col gap-1" },
                span({ class: cx("text-xs font-medium", tx("onSurfaceFaint")) }, labelText),
                span({ class: cx("text-4xl font-bold tabular-nums tracking-tight leading-none", tx("onSurface")) }, value)
            ),
            icon
                ? div({ class: cx("w-11 h-11 rounded-2xl flex items-center justify-center text-lg", bg("primaryTonal"), tx("primaryTonalText")) }, icon)
                : null
        ),

        delta
            ? div(
                { class: cx("flex items-center gap-2 pt-3 border-t", bdr("divider")) },
                span(
                    {
                        class: cx(
                            "text-xs font-semibold px-2 py-0.5 rounded-full",
                            isPos ? `${bg("successBg")} ${tx("successText")}` : `${bg("dangerBg")} ${tx("dangerText")}`
                        )
                    },
                    delta
                ),
                span({ class: cx("text-xs", tx("onSurfaceFaint")) }, "vs last period")
            )
            : null
    )
}


// ─────────────────────────────────────────────
//  DROPDOWN MENU
// ─────────────────────────────────────────────

function DropdownMenu({ trigger = "Options", items = [] }) {
    return div(
        { class: "relative inline-block group" },
        button(
            {
                class: cx(
                    "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all rounded-full shadow-sm shadow-black/8 hover:shadow-md ring-1",
                    bg("surface"), tx("onSurfaceMid"), rng("dividerMid"), "hover:bg-neutral-50"
                )
            },
            trigger, span({ class: "text-xs opacity-50" }, "▾")
        ),
        div(
            {
                class: cx(
                    "absolute right-0 mt-2 min-w-48 rounded-2xl overflow-hidden z-50 py-1.5",
                    "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
                    "translate-y-1 group-hover:translate-y-0 transition-all duration-150",
                    bg("surface"),
                    "shadow-xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10"
                )
            },
            ul(
                {},
                ...items.map(item =>
                    item.divider
                        ? li({ class: cx("border-t my-1", bdr("divider")) })
                        : li(
                            {},
                            a(
                                {
                                    class: cx(
                                        "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                                        tx("onSurfaceMid"),
                                        "hover:bg-indigo-50 hover:text-indigo-600"
                                    )
                                },
                                item.icon ? span({ class: "text-base" }, item.icon) : null,
                                item.label
                            )
                        )
                )
            )
        )
    )
}


// ─────────────────────────────────────────────
//  BREADCRUMB
// ─────────────────────────────────────────────

function Breadcrumb({ items = [] }) {
    return nav(
        { class: "flex items-center gap-1.5" },
        ...items.map((item, i) =>
            div(
                { class: "flex items-center gap-1.5" },
                i > 0 ? span({ class: cx("text-xs", tx("onSurfaceDisabled")) }, "/") : null,
                i < items.length - 1
                    ? a({ class: cx("text-xs font-medium transition-colors", tx("onSurfaceMuted"), "hover:text-neutral-900") }, item.label)
                    : span({ class: cx("text-xs font-semibold", tx("onSurface")) }, item.label)
            )
        )
    )
}


// ─────────────────────────────────────────────
//  TOGGLE
// ─────────────────────────────────────────────

function Toggle({ label: labelText = "", checked = false }) {
    return label(
        { class: "inline-flex items-center gap-3 cursor-pointer select-none" },
        div(
            { class: cx("relative w-11 h-6 rounded-full transition-colors duration-200", checked ? bg("primaryBg") : bg("dividerMid")) },
            span({ class: cx("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", checked ? "translate-x-[22px]" : "translate-x-1") })
        ),
        labelText ? span({ class: cx("text-sm font-medium", tx("onSurfaceMid")) }, labelText) : null
    )
}


// ─────────────────────────────────────────────
//  SKELETON
// ─────────────────────────────────────────────

function Skeleton({ lines = 3, hasAvatar = false }) {
    return div(
        { class: "flex gap-4 p-4" },
        hasAvatar ? div({ class: cx("w-10 h-10 shrink-0 animate-pulse rounded-full", bg("dividerMid")) }) : null,
        div(
            { class: "flex-1 flex flex-col gap-3 py-1" },
            ...Array.from({ length: lines }, (_, i) =>
                div({ class: cx("h-3 rounded-full animate-pulse", bg("dividerMid"), i === lines - 1 ? "w-3/5" : i === 0 ? "w-full" : "w-4/5") })
            )
        )
    )
}


// ─────────────────────────────────────────────
//  PROGRESS BAR
// ─────────────────────────────────────────────

function ProgressBar({ value = 0, max = 100, label: labelText = "", variant = "default" }) {
    const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
    const fills = {
        default: bg("primaryBg"),
        success: bg("success"),
        warning: bg("warning"),
        danger: bg("danger"),
    }
    return div(
        { class: "flex flex-col gap-2" },
        (labelText || value !== undefined)
            ? div(
                { class: "flex items-center justify-between" },
                labelText ? span({ class: cx("text-xs font-medium", tx("onSurfaceMid")) }, labelText) : null,
                span({ class: cx("text-xs font-semibold", tx("onSurfaceFaint")) }, `${pct}%`)
            )
            : null,
        div(
            { class: cx("w-full h-2 rounded-full", bg("divider")) },
            div({ class: cx("h-full rounded-full transition-all duration-500", fills[variant]), style: `width: ${pct}%` })
        )
    )
}


// ═══════════════════════════════════════════════════════════
//  EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════

/*

  div({ class: cx("min-h-screen", bg("surface")) },

    Navbar({
      brand: "Lumina",
      cta: "Get Started",
      links: [
        { label: "Product", href: "#", children: [
            { label: "Features",  href: "#" },
            { label: "Changelog", href: "#" },
            { label: "Roadmap",   href: "#" },
        ]},
        { label: "Pricing", href: "#" },
        { label: "Blog",    href: "#" },
        { label: "Contact", href: "#" },
      ]
    }),

    Hero({
      badge: "Now in public beta",
      eyebrow: "Modern design system",
      headline: "Build beautiful interfaces, faster.",
      sub: "A component system that feels right at home in any product.",
      primaryCta: "Start building",
      secondaryCta: "View docs",
    }),

    div({ class: "max-w-lg mx-auto py-16 px-6" },
      FormGroup({
        legend: "Account details",
        hint: "These details appear on your public profile.",
        error: "",
        children: [
          InputField({ label: "Full name",     placeholder: "Ada Lovelace",     type: "text"     }),
          InputField({ label: "Email address", placeholder: "ada@example.com",  type: "email"    }),
          InputField({ label: "Password",      placeholder: "Min 8 characters", type: "password",
                       hint: "Use a mix of letters, numbers, and symbols."                        }),
          Toggle({ label: "Make profile public", checked: false }),
        ]
      })
    ),

    CTABand({
      headline: "Ship faster. Look better.",
      sub: "Join thousands of teams building with Lumina.",
      primaryCta: "Start for free",
      secondaryCta: "Talk to sales",
    }),

    Footer({
      brand: "Lumina",
      columns: [
        { title: "Product", links: [{ label: "Components" }, { label: "Templates" }, { label: "Changelog" }] },
        { title: "Company", links: [{ label: "About" },      { label: "Blog" },      { label: "Careers" }]   },
        { title: "Connect", links: [{ label: "GitHub" },     { label: "Twitter" },   { label: "Contact" }]   },
      ]
    })
  )

*/

export {
    // Palette & token helpers
    PALETTE, T, bg, tx, bdr, rng, shd, frm, too, via, ph, divide, cx,

    // Landing
    Navbar, Hero, Features, FeaturesAlternate,
    LogosBar, Testimonials, Pricing, FAQ,
    StatsBand, CTABand, Footer,

    // App shell
    Sidebar,

    // UI
    Button, Card, Badge, Avatar, Alert,
    InputField, FormGroup, Table, Tabs, Modal, StatCard,
    DropdownMenu, Breadcrumb, Toggle, Skeleton, ProgressBar,
}
