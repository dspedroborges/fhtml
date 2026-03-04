// ============================================================
//  TAILWIND COMPONENT LIBRARY — FUNCTIONAL TAG DSL
//  Theming via Tailwind's `dark:` variant (no theme props)
//  All styling: vanilla Tailwind classes only.
// ============================================================

// ─────────────────────────────────────────────
//  NAVBAR
//  props: { brand, links, cta }
//  links: [{ label, href, children?: [{ label, href }] }]
// ─────────────────────────────────────────────

function Navbar({ brand = "Acme", links = [], cta = "Get Started" }) {
  return nav(
    cls(
      "w-full border-b",
      "border-zinc-200 dark:border-zinc-800",
      "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm",
      "text-zinc-900 dark:text-zinc-100",
      "sticky top-0 z-50 px-6 lg:px-10"
    ),

    div(
      cls("max-w-7xl mx-auto flex items-center justify-between h-16"),

      a(
        cls("text-lg font-bold tracking-tight shrink-0 text-zinc-950 dark:text-white"),
        brand
      ),

      ul(
        cls("hidden md:flex items-center gap-1"),
        ...links.map(link =>
          li(
            cls("relative group"),
            a(
              cls(
                "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
                "dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
              ),
              link.label,
              link.children && span(cls("ml-0.5 text-xs opacity-50"), "▾")
            ),

            link.children && div(
              cls(
                "absolute top-full left-0 mt-2 min-w-52 rounded-2xl shadow-2xl z-50 overflow-hidden",
                "opacity-0 pointer-events-none translate-y-1",
                "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0",
                "transition-all duration-200",
                "bg-white border border-zinc-200",
                "dark:bg-zinc-900 dark:border-zinc-700"
              ),
              ul(
                cls("py-2"),
                ...link.children.map(child =>
                  li(
                    a(
                      cls(
                        "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                        "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50",
                        "dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                      ),
                      child.label
                    )
                  )
                )
              )
            )
          )
        )
      ),

      div(
        cls("flex items-center gap-3"),

        button(
          cls(
            "hidden md:inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-colors",
            "bg-zinc-950 text-white hover:bg-zinc-800",
            "dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          ),
          cta
        ),

        button(
          cls("md:hidden flex flex-col gap-1.5 p-2 rounded-lg"),
          span(cls("block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-300")),
          span(cls("block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-300")),
          span(cls("block w-5 h-0.5 bg-zinc-700 dark:bg-zinc-300"))
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  SIDEBAR
//  props: { items, footerLabel, collapsed }
//  items: [{ label, icon, href, children?: [{ label, icon }] }]
// ─────────────────────────────────────────────

function Sidebar({ items = [], footerLabel = "Settings", collapsed = false }) {
  const w = collapsed ? "w-16" : "w-64"

  return aside(
    cls(
      `${w} h-full flex flex-col border-r transition-all duration-300 shrink-0`,
      "bg-white border-zinc-200 text-zinc-900",
      "dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
    ),

    div(
      cls("h-16 flex items-center px-5 border-b border-zinc-200 dark:border-zinc-800"),
      !collapsed && span(cls("font-bold text-base tracking-tight"), "Dashboard"),
      collapsed  && span(cls("text-2xl mx-auto select-none"), "◈")
    ),

    nav(
      cls("flex-1 overflow-y-auto py-4 px-3 space-y-1"),
      ...items.map((item, i) =>
        div(
          cls("relative group"),

          a(
            cls(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
              i === 0
                ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            ),
            span(cls("text-base shrink-0"), item.icon || "○"),
            !collapsed && span(cls("flex-1 truncate"), item.label),
            !collapsed && item.children && span(cls("text-xs opacity-40"), "›")
          ),

          item.children && div(
            cls(
              "absolute left-full top-0 ml-3 min-w-48 rounded-2xl shadow-2xl z-50 overflow-hidden",
              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150",
              "bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700"
            ),
            div(
              cls("py-2"),
              p(cls("px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500"), item.label),
              ...item.children.map(child =>
                a(
                  cls(
                    "flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                    "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50",
                    "dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                  ),
                  span(cls("opacity-50"), child.icon || "·"),
                  child.label
                )
              )
            )
          )
        )
      )
    ),

    div(
      cls("border-t px-3 py-4 border-zinc-200 dark:border-zinc-800"),
      a(
        cls(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
          "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
          "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        ),
        span(cls("text-base"), "⚙"),
        !collapsed && span(cls(""), footerLabel)
      )
    )
  )
}


// ─────────────────────────────────────────────
//  HERO
//  props: { eyebrow, headline, sub, primaryCta, secondaryCta, badge }
// ─────────────────────────────────────────────

function Hero({ eyebrow = "", headline = "", sub = "", primaryCta = "Get Started", secondaryCta = "See how it works", badge = null }) {
  return section(
    cls("relative overflow-hidden py-24 md:py-36 px-6 bg-white dark:bg-zinc-950"),

    div(
      cls(
        "absolute inset-0 bg-[size:48px_48px]",
        "bg-[linear-gradient(to_right,#e4e4e780_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e780_1px,transparent_1px)]",
        "dark:bg-[linear-gradient(to_right,#27272a50_1px,transparent_1px),linear-gradient(to_bottom,#27272a50_1px,transparent_1px)]",
        "[mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_50%,transparent_100%)]"
      )
    ),

    div(
      cls(
        "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none",
        "bg-indigo-400 dark:bg-indigo-600"
      )
    ),

    div(
      cls("relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6"),

      badge && span(
        cls(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border",
          "bg-zinc-100 border-zinc-200 text-zinc-700",
          "dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
        ),
        span(cls("w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse")),
        badge
      ),

      eyebrow && p(
        cls("text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400"),
        eyebrow
      ),

      h1(
        cls("text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] max-w-3xl text-zinc-950 dark:text-white"),
        headline
      ),

      p(
        cls("text-lg md:text-xl leading-relaxed max-w-xl text-zinc-500 dark:text-zinc-400"),
        sub
      ),

      div(
        cls("flex flex-col sm:flex-row items-center gap-3 mt-2"),

        button(
          cls(
            "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
            "bg-zinc-950 text-white hover:bg-zinc-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
            "dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
          ),
          primaryCta,
          span(cls("text-base"), "→")
        ),

        button(
          cls(
            "inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors",
            "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
            "dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
          ),
          secondaryCta
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  FEATURES — icon grid
//  props: { eyebrow, headline, sub, items }
//  items: [{ icon, title, description }]
// ─────────────────────────────────────────────

function Features({ eyebrow = "Features", headline = "", sub = "", items = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-zinc-50 dark:bg-zinc-900"),

    div(
      cls("max-w-7xl mx-auto"),

      div(
        cls("max-w-2xl mb-16"),
        eyebrow && p(cls("text-xs font-bold uppercase tracking-[0.2em] mb-4 text-indigo-600 dark:text-indigo-400"), eyebrow),
        h2(cls("text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4 text-zinc-950 dark:text-white"), headline),
        sub && p(cls("text-lg leading-relaxed text-zinc-500 dark:text-zinc-400"), sub)
      ),

      div(
        cls(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden",
          "bg-zinc-200 dark:bg-zinc-800"
        ),
        ...items.map(item =>
          div(
            cls(
              "flex flex-col gap-4 p-8 group transition-colors",
              "bg-zinc-50 hover:bg-white dark:bg-zinc-900 dark:hover:bg-zinc-800"
            ),
            div(
              cls(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-colors",
                "bg-zinc-200 group-hover:bg-indigo-100 dark:bg-zinc-800 dark:group-hover:bg-indigo-900"
              ),
              item.icon || "◆"
            ),
            div(
              cls("flex flex-col gap-2"),
              h3(cls("text-base font-bold text-zinc-950 dark:text-white"), item.title),
              p(cls("text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"), item.description)
            )
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  FEATURES ALTERNATE — staggered rows
//  props: { items }
//  items: [{ eyebrow, title, description, cta, visual }]
// ─────────────────────────────────────────────

function FeaturesAlternate({ items = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-white dark:bg-zinc-950"),

    div(
      cls("max-w-6xl mx-auto flex flex-col gap-28"),
      ...items.map((item, i) =>
        div(
          cls(
            "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center",
            i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
          ),

          div(
            cls("flex flex-col gap-5"),
            item.eyebrow && span(cls("text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400"), item.eyebrow),
            h2(cls("text-3xl md:text-4xl font-black tracking-tight leading-tight text-zinc-950 dark:text-white"), item.title),
            p(cls("text-base md:text-lg leading-relaxed text-zinc-500 dark:text-zinc-400"), item.description),
            item.cta && a(
              cls("inline-flex items-center gap-2 text-sm font-bold transition-colors w-fit text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"),
              item.cta, span(cls(""), "→")
            )
          ),

          div(
            cls(
              "aspect-video rounded-2xl overflow-hidden border flex items-center justify-center",
              "bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
            ),
            item.visual || span(cls("text-5xl opacity-20"), "◈")
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  LOGOS BAR
//  props: { label, logos }
//  logos: [{ name, icon? }]
// ─────────────────────────────────────────────

function LogosBar({ label = "Trusted by teams at", logos = [] }) {
  return section(
    cls("py-16 px-6 border-y border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950"),
    div(
      cls("max-w-5xl mx-auto flex flex-col items-center gap-8"),
      p(cls("text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600"), label),
      div(
        cls("flex flex-wrap items-center justify-center gap-8 md:gap-12"),
        ...logos.map(logo =>
          div(
            cls(
              "flex items-center gap-2 text-sm font-bold",
              "text-zinc-300 hover:text-zinc-500 dark:text-zinc-700 dark:hover:text-zinc-500 transition-colors"
            ),
            logo.icon && span(cls("text-2xl"), logo.icon),
            span(cls("tracking-tight"), logo.name)
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  TESTIMONIALS
//  props: { eyebrow, headline, items }
//  items: [{ quote, name, title }]
// ─────────────────────────────────────────────

function Testimonials({ eyebrow = "Testimonials", headline = "Loved by teams", items = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-zinc-50 dark:bg-zinc-900"),
    div(
      cls("max-w-7xl mx-auto"),
      div(
        cls("text-center max-w-xl mx-auto mb-16"),
        p(cls("text-xs font-bold uppercase tracking-widest mb-3 text-indigo-600 dark:text-indigo-400"), eyebrow),
        h2(cls("text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white"), headline)
      ),
      div(
        cls("columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5"),
        ...items.map(item =>
          div(
            cls(
              "break-inside-avoid rounded-2xl p-6 border",
              "bg-white border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700"
            ),
            p(cls("text-sm leading-relaxed mb-5 text-zinc-700 dark:text-zinc-300"), `"${item.quote}"`),
            div(
              cls("flex items-center gap-3"),
              div(
                cls(
                  "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                ),
                item.name.slice(0, 2).toUpperCase()
              ),
              div(
                p(cls("text-sm font-semibold text-zinc-900 dark:text-white"), item.name),
                p(cls("text-xs text-zinc-500 dark:text-zinc-400"), item.title)
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
//  props: { eyebrow, headline, sub, plans }
//  plans: [{ name, price, period, description, features, cta, highlighted }]
// ─────────────────────────────────────────────

function Pricing({ eyebrow = "Pricing", headline = "Simple, honest pricing", sub = "", plans = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-white dark:bg-zinc-950"),
    div(
      cls("max-w-6xl mx-auto"),
      div(
        cls("text-center max-w-2xl mx-auto mb-16"),
        p(cls("text-xs font-bold uppercase tracking-widest mb-3 text-indigo-600 dark:text-indigo-400"), eyebrow),
        h2(cls("text-4xl md:text-5xl font-black tracking-tight mb-4 text-zinc-950 dark:text-white"), headline),
        sub && p(cls("text-lg text-zinc-500 dark:text-zinc-400"), sub)
      ),
      div(
        cls("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"),
        ...plans.map(plan =>
          div(
            cls(
              "rounded-2xl p-8 flex flex-col gap-6 border relative overflow-hidden",
              plan.highlighted
                ? "bg-zinc-950 border-zinc-950 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                : "bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"
            ),

            plan.highlighted && div(
              cls("absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl bg-indigo-500 text-white"),
              "Most Popular"
            ),

            div(
              cls("flex flex-col gap-1"),
              h3(
                cls("text-sm font-bold uppercase tracking-widest", plan.highlighted ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"),
                plan.name
              ),
              div(
                cls("flex items-end gap-1.5 mt-2"),
                span(cls("text-5xl font-black tracking-tight leading-none"), plan.price),
                span(cls("text-sm mb-1", plan.highlighted ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400"), plan.period || "/mo")
              ),
              plan.description && p(
                cls("text-sm mt-2", plan.highlighted ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-400"),
                plan.description
              )
            ),

            button(
              cls(
                "w-full py-3 rounded-xl text-sm font-bold transition-all",
                plan.highlighted
                  ? "bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800"
                  : "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              ),
              plan.cta || "Get Started"
            ),

            div(
              cls("border-t pt-6", plan.highlighted ? "border-zinc-700 dark:border-zinc-200" : "border-zinc-100 dark:border-zinc-800"),
              p(cls("text-xs font-semibold uppercase tracking-widest mb-4", plan.highlighted ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-400"), "What's included"),
              ul(
                cls("flex flex-col gap-3"),
                ...(plan.features || []).map(feature =>
                  li(
                    cls("flex items-start gap-3 text-sm"),
                    span(
                      cls(
                        "mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold",
                        plan.highlighted ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                      ),
                      "✓"
                    ),
                    span(
                      cls(plan.highlighted ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"),
                      feature
                    )
                  )
                )
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
//  props: { eyebrow, headline, items }
//  items: [{ question, answer }]
// ─────────────────────────────────────────────

function FAQ({ eyebrow = "FAQ", headline = "Frequently asked questions", items = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-zinc-50 dark:bg-zinc-900"),
    div(
      cls("max-w-3xl mx-auto"),
      div(
        cls("text-center mb-16"),
        p(cls("text-xs font-bold uppercase tracking-widest mb-3 text-indigo-600 dark:text-indigo-400"), eyebrow),
        h2(cls("text-4xl md:text-5xl font-black tracking-tight text-zinc-950 dark:text-white"), headline)
      ),
      div(
        cls("rounded-2xl border divide-y overflow-hidden border-zinc-200 divide-zinc-200 dark:border-zinc-800 dark:divide-zinc-800"),
        ...items.map(item =>
          div(
            cls("bg-white dark:bg-zinc-950"),
            button(
              cls(
                "w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors",
                "hover:bg-zinc-50 dark:hover:bg-zinc-900"
              ),
              span(cls("text-sm font-semibold text-zinc-900 dark:text-white"), item.question),
              span(
                cls("shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"),
                "+"
              )
            ),
            div(
              cls("px-6 pb-5"),
              p(cls("text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"), item.answer)
            )
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  STATS BAND
//  props: { items }
//  items: [{ value, label }]
// ─────────────────────────────────────────────

function StatsBand({ items = [] }) {
  return section(
    cls("py-20 px-6 bg-zinc-950 dark:bg-white"),
    div(
      cls("max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-zinc-800 dark:divide-zinc-200"),
      ...items.map(item =>
        div(
          cls("flex flex-col items-center gap-1 px-8"),
          span(cls("text-5xl font-black tabular-nums tracking-tighter text-white dark:text-zinc-950"), item.value),
          span(cls("text-xs font-semibold uppercase tracking-widest text-center text-zinc-400 dark:text-zinc-600"), item.label)
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  CTA BAND
//  props: { headline, sub, primaryCta, secondaryCta }
// ─────────────────────────────────────────────

function CTABand({ headline = "Ready to get started?", sub = "", primaryCta = "Start for free", secondaryCta = "Talk to sales" }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-white dark:bg-zinc-950"),
    div(
      cls("max-w-4xl mx-auto rounded-3xl p-12 md:p-20 text-center relative overflow-hidden bg-zinc-950 dark:bg-white"),

      div(cls("absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_#6366f1_0%,_transparent_70%)]")),

      div(
        cls("relative flex flex-col items-center gap-6"),
        h2(cls("text-4xl md:text-6xl font-black tracking-tight leading-tight text-white dark:text-zinc-950"), headline),
        sub && p(cls("text-lg max-w-lg text-zinc-400 dark:text-zinc-500"), sub),
        div(
          cls("flex flex-col sm:flex-row gap-3 mt-2"),
          button(
            cls(
              "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all",
              "bg-white text-zinc-950 hover:bg-zinc-100 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800"
            ),
            primaryCta
          ),
          button(
            cls(
              "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border transition-colors",
              "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500",
              "dark:border-zinc-300 dark:text-zinc-500 dark:hover:text-zinc-900 dark:hover:border-zinc-400"
            ),
            secondaryCta
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  FOOTER
//  props: { brand, columns, copyright }
//  columns: [{ title, links: [{ label, href }] }]
// ─────────────────────────────────────────────

function Footer({ brand = "Acme", columns = [], copyright = "" }) {
  return footer(
    cls("border-t border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"),
    div(
      cls("max-w-7xl mx-auto px-6 lg:px-10 py-16"),
      div(
        cls("grid grid-cols-2 md:grid-cols-4 gap-10 mb-16"),
        div(
          cls("col-span-2 md:col-span-1"),
          p(cls("font-bold text-lg mb-3 text-zinc-950 dark:text-white"), brand),
          p(cls("text-sm leading-relaxed max-w-xs"), "Building the tools that move modern teams forward.")
        ),
        ...columns.map(col =>
          div(
            h5(cls("text-xs font-bold uppercase tracking-widest mb-5 text-zinc-950 dark:text-white"), col.title),
            ul(
              cls("flex flex-col gap-3"),
              ...col.links.map(link =>
                li(a(cls("text-sm transition-colors hover:text-zinc-900 dark:hover:text-white"), link.label))
              )
            )
          )
        )
      ),
      div(
        cls("border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-zinc-100 dark:border-zinc-800"),
        p(cls("text-xs"), copyright || `© ${new Date().getFullYear()} ${brand}. All rights reserved.`),
        div(
          cls("flex gap-5"),
          a(cls("text-xs hover:text-zinc-900 dark:hover:text-white transition-colors"), "Privacy"),
          a(cls("text-xs hover:text-zinc-900 dark:hover:text-white transition-colors"), "Terms"),
          a(cls("text-xs hover:text-zinc-900 dark:hover:text-white transition-colors"), "Cookies")
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
//  props: { label, variant, size, disabled, icon }
//  variant: primary | secondary | ghost | danger | outline
// ─────────────────────────────────────────────

function Button({ label = "Click", variant = "primary", size = "md", disabled = false, icon = null }) {
  const sizes    = { sm: "px-3 py-1.5 text-xs rounded-lg", md: "px-4 py-2 text-sm rounded-xl", lg: "px-6 py-3 text-base rounded-2xl" }
  const variants = {
    primary:   "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    ghost:     "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white",
    danger:    "bg-red-600 text-white hover:bg-red-500",
    outline:   "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
  }
  return button(
    cls("inline-flex items-center justify-center gap-2 font-semibold transition-colors", sizes[size], variants[variant], disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer"),
    icon && span(cls("text-sm"), icon),
    label
  )
}


// ─────────────────────────────────────────────
//  CARD
//  props: { title, body, footer, badge }
// ─────────────────────────────────────────────

function Card({ title = "", body = "", footer = null, badge = null }) {
  return article(
    cls("rounded-2xl border overflow-hidden bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"),
    div(
      cls("p-5 flex flex-col gap-3"),
      badge && span(cls("inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"), badge),
      title && h3(cls("text-base font-bold leading-snug"), title),
      body  && p(cls("text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"), body),
    ),
    footer && div(cls("px-5 pb-5 pt-4 border-t border-zinc-100 dark:border-zinc-800"), footer)
  )
}


// ─────────────────────────────────────────────
//  BADGE
//  props: { label, variant }
// ─────────────────────────────────────────────

function Badge({ label = "", variant = "default" }) {
  const variants = {
    default: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    danger:  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    info:    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  }
  return span(cls(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`), label)
}


// ─────────────────────────────────────────────
//  AVATAR
//  props: { name, size, status }
// ─────────────────────────────────────────────

function Avatar({ name = "User", size = "md", status = null }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base", xl: "w-16 h-16 text-xl" }
  const statusColors = { online: "bg-emerald-500", offline: "bg-zinc-400 dark:bg-zinc-600", away: "bg-amber-400" }
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
  return div(
    cls("relative inline-flex shrink-0"),
    div(cls(`${sizes[size]} rounded-full flex items-center justify-center font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300`), initials),
    status && span(cls(`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-zinc-950 ${statusColors[status]}`))
  )
}


// ─────────────────────────────────────────────
//  ALERT
//  props: { title, message, variant }
// ─────────────────────────────────────────────

function Alert({ title = "", message = "", variant = "info" }) {
  const v = {
    info:    { wrap: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800",    icon: "ℹ", ic: "text-blue-500",    tc: "text-blue-900 dark:text-blue-100",     mc: "text-blue-700 dark:text-blue-300"     },
    success: { wrap: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800", icon: "✓", ic: "text-emerald-500", tc: "text-emerald-900 dark:text-emerald-100", mc: "text-emerald-700 dark:text-emerald-300" },
    warning: { wrap: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800", icon: "⚠", ic: "text-amber-500",   tc: "text-amber-900 dark:text-amber-100",   mc: "text-amber-700 dark:text-amber-300"   },
    danger:  { wrap: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-900",       icon: "✕", ic: "text-red-500",     tc: "text-red-900 dark:text-red-100",       mc: "text-red-700 dark:text-red-300"       },
  }[variant]
  return div(
    cls(`flex gap-3 p-4 rounded-xl border ${v.wrap}`),
    span(cls(`text-lg shrink-0 mt-0.5 ${v.ic}`), v.icon),
    div(
      cls("flex flex-col gap-0.5"),
      title   && p(cls(`text-sm font-semibold ${v.tc}`), title),
      message && p(cls(`text-sm ${v.mc}`), message)
    )
  )
}


// ─────────────────────────────────────────────
//  INPUT FIELD
//  props: { label, placeholder, type, hint, error }
// ─────────────────────────────────────────────

function InputField({ label: labelText = "", placeholder = "", type = "text", hint = "", error = "" }) {
  return div(
    cls("flex flex-col gap-1.5"),

    labelText &&
      label(
        cls("text-sm font-medium text-zinc-700 dark:text-zinc-300"),
        labelText
      ),

    input(
      cls(
        "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors",
        "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400",
        "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500",
        "dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-600",
        error ? "border-red-500 dark:border-red-500" : ""
      ),
      { type, placeholder }
    ),

    error &&
      span(
        cls("text-xs text-red-500"),
        error
      ),

    !error && hint &&
      span(
        cls("text-xs text-zinc-400 dark:text-zinc-500"),
        hint
      )
  )
}

// ─────────────────────────────────────────────
//  TABLE
//  props: { columns, rows }
// ─────────────────────────────────────────────

function Table({ columns = [], rows = [] }) {
  return div(
    cls("rounded-2xl border overflow-hidden bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"),
    div(
      cls("overflow-x-auto"),
      table(
        cls("min-w-full"),

        thead(
          tr(
            cls("bg-zinc-50 dark:bg-zinc-800"),
            ...columns.map(col =>
              th(
                cls("px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"),
                col.label
              )
            )
          )
        ),

        tbody(
          ...rows.map(row =>
            tr(
              cls("border-t transition-colors border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"),
              ...columns.map(col =>
                td(
                  cls("px-5 py-3.5 text-sm text-zinc-700 dark:text-zinc-300"),
                  row[col.key] ?? "—"
                )
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
//  props: { tabs, activeIndex }
// ─────────────────────────────────────────────

function Tabs({ tabs = [], activeIndex = 0 }) {
  return div(
    cls("flex border-b border-zinc-200 dark:border-zinc-800"),
    ...tabs.map((tab, i) =>
      button(
        cls(
          "flex items-center gap-2 px-5 py-3 text-sm font-medium -mb-px transition-colors",
          i === activeIndex
            ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
            : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"
        ),
        tab.icon && span(cls("text-base"), tab.icon),
        tab.label
      )
    )
  )
}


// ─────────────────────────────────────────────
//  MODAL
//  props: { title, body, actions, size }
// ─────────────────────────────────────────────

function Modal({ title = "Dialog", body = "", actions = [], size = "md" }) {
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" }
  return div(
    cls("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"),
    div(
      cls(`w-full ${sizes[size]} rounded-2xl shadow-2xl overflow-hidden bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800`),
      div(
        cls("flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800"),
        h2(cls("text-base font-bold text-zinc-900 dark:text-white"), title),
        button(cls("p-1.5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-white dark:hover:bg-zinc-800"), "✕")
      ),
      div(cls("px-6 py-5"), p(cls("text-sm leading-relaxed text-zinc-500 dark:text-zinc-400"), body)),
      actions.length > 0 && div(cls("flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800"), ...actions)
    )
  )
}


// ─────────────────────────────────────────────
//  STAT CARD
//  props: { label, value, delta, icon }
// ─────────────────────────────────────────────

function StatCard({ label = "", value = "", delta = null, icon = null }) {
  const isPos = delta && !delta.startsWith("-")
  return div(
    cls("rounded-2xl border p-5 flex flex-col gap-4 bg-white border-zinc-200 text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100"),
    div(
      cls("flex items-start justify-between"),
      div(
        cls("flex flex-col gap-1"),
        span(cls("text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400"), label),
        span(cls("text-3xl font-black tabular-nums tracking-tight"), value)
      ),
      icon && div(cls("w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300"), icon)
    ),
    delta && div(
      cls("flex items-center gap-1.5"),
      span(cls(`text-sm font-semibold ${isPos ? "text-emerald-500" : "text-red-500"}`), delta),
      span(cls("text-xs text-zinc-400 dark:text-zinc-500"), "vs last period")
    )
  )
}


// ─────────────────────────────────────────────
//  DROPDOWN MENU
//  props: { trigger, items }
// ─────────────────────────────────────────────

function DropdownMenu({ trigger = "Options", items = [] }) {
  return div(
    cls("relative inline-block group"),
    button(
      cls("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-700"),
      trigger, span(cls("text-xs opacity-50"), "▾")
    ),
    div(
      cls("absolute right-0 mt-2 min-w-48 rounded-2xl shadow-xl border z-50 overflow-hidden opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150 bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-700"),
      ul(
        cls("py-2"),
        ...items.map(item =>
          item.divider
            ? li(cls("border-t my-1 border-zinc-100 dark:border-zinc-800"))
            : li(a(
                cls("flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors cursor-pointer text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"),
                item.icon && span(cls("text-sm opacity-70"), item.icon),
                item.label
              ))
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  BREADCRUMB
//  props: { items }
// ─────────────────────────────────────────────

function Breadcrumb({ items = [] }) {
  return nav(
    cls("flex items-center gap-1.5"),
    ...items.map((item, i) =>
      div(
        cls("flex items-center gap-1.5"),
        i > 0 && span(cls("text-sm text-zinc-300 dark:text-zinc-600"), "/"),
        i < items.length - 1
          ? a(cls("text-sm transition-colors text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white"), item.label)
          : span(cls("text-sm font-medium text-zinc-900 dark:text-white"), item.label)
      )
    )
  )
}


// ─────────────────────────────────────────────
//  TOGGLE
//  props: { label, checked }
// ─────────────────────────────────────────────
function Toggle({ label: labelText = "", checked = false }) {
  return label(
    cls("inline-flex items-center gap-3 cursor-pointer select-none"),

    div(
      cls(
        "relative w-10 h-6 rounded-full transition-colors",
        checked ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-700"
      ),
      span(
        cls(
          `absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`
        )
      )
    ),

    labelText &&
      span(
        cls("text-sm font-medium text-zinc-700 dark:text-zinc-300"),
        labelText
      )
  )
}

// ─────────────────────────────────────────────
//  SKELETON
//  props: { lines, hasAvatar }
// ─────────────────────────────────────────────

function Skeleton({ lines = 3, hasAvatar = false }) {
  return div(
    cls("flex gap-4 p-4"),
    hasAvatar && div(cls("w-10 h-10 rounded-full shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800")),
    div(
      cls("flex-1 flex flex-col gap-3 py-1"),
      ...Array.from({ length: lines }, (_, i) =>
        div(cls(`h-3 rounded-full animate-pulse bg-zinc-200 dark:bg-zinc-800 ${i === lines - 1 ? "w-3/5" : i === 0 ? "w-full" : "w-4/5"}`))
      )
    )
  )
}


// ─────────────────────────────────────────────
//  PROGRESS BAR
//  props: { value, max, label, variant }
// ─────────────────────────────────────────────

function ProgressBar({ value = 0, max = 100, label = "", variant = "default" }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  const fills = { default: "bg-indigo-600", success: "bg-emerald-500", warning: "bg-amber-500", danger: "bg-red-500" }
  return div(
    cls("flex flex-col gap-2"),
    (label || value !== undefined) && div(
      cls("flex items-center justify-between"),
      label && span(cls("text-sm font-medium text-zinc-700 dark:text-zinc-300"), label),
      span(cls("text-xs tabular-nums text-zinc-400 dark:text-zinc-500"), `${pct}%`)
    ),
    div(
      cls("w-full h-2 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"),
      div(cls(`h-full rounded-full transition-all duration-500 ${fills[variant]}`), { style: `width: ${pct}%` })
    )
  )
}


// ═══════════════════════════════════════════════════════════
//  EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════

/*

const page =
  div(cls("min-h-screen bg-white dark:bg-zinc-950"),

    Navbar({
      brand: "Forma",
      cta: "Start Free",
      links: [
        { label: "Product", href: "#", children: [
            { label: "Overview",  href: "#" },
            { label: "Features",  href: "#" },
            { label: "Changelog", href: "#" },
        ]},
        { label: "Pricing", href: "#" },
        { label: "Docs",    href: "#" },
      ]
    }),

    Hero({
      badge: "Now in public beta",
      eyebrow: "Ship faster",
      headline: "Design systems that scale.",
      sub: "A complete component library built for teams who care about craft.",
      primaryCta: "Start for free",
      secondaryCta: "See the docs",
    }),

    LogosBar({
      label: "Used by teams at",
      logos: [
        { name: "Stripe", icon: "◈" }, { name: "Linear", icon: "◆" },
        { name: "Vercel", icon: "▲" }, { name: "Figma",  icon: "✦" },
        { name: "Notion", icon: "□" },
      ]
    }),

    Features({
      eyebrow: "Features",
      headline: "Everything you need, nothing you don't.",
      items: [
        { icon: "⚡", title: "Blazing fast",    description: "Optimised for performance from the ground up."   },
        { icon: "🎨", title: "Fully themeable", description: "Dark mode, custom tokens, total control."         },
        { icon: "🧩", title: "Composable",      description: "Every component follows the same simple DSL."     },
        { icon: "♿", title: "Accessible",      description: "WCAG 2.1 AA out of the box."                     },
        { icon: "📱", title: "Responsive",      description: "Mobile-first with sensible breakpoints."          },
        { icon: "🔒", title: "Type-safe",       description: "Full TypeScript support with tight prop types."   },
      ]
    }),

    StatsBand({
      items: [
        { value: "99.9%", label: "Uptime SLA"    },
        { value: "4.8★",  label: "Avg rating"    },
        { value: "50K+",  label: "Developers"    },
        { value: "<2ms",  label: "Response time" },
      ]
    }),

    Testimonials({
      items: [
        { quote: "Shipped our design system in a week.",             name: "Alice Zhao",  title: "CTO, Runway"       },
        { quote: "The dark mode just works. No hacks, no overrides.", name: "Ben Okafor",  title: "Lead Engineer, Luma" },
        { quote: "Finally a library that doesn't look generic.",      name: "Cara Lin",    title: "Design Lead, Arc"  },
      ]
    }),

    Pricing({
      plans: [
        { name: "Starter", price: "Free",  period: "forever", cta: "Get started",   features: ["Up to 3 projects", "Core components", "Community support"] },
        { name: "Pro",     price: "$19",   period: "/mo",      cta: "Start trial",   features: ["Unlimited projects", "All components", "Priority support", "Figma kit"], highlighted: true },
        { name: "Enterprise", price: "Custom", period: "",     cta: "Contact sales", features: ["SSO & SAML", "SLA guarantee", "Dedicated support", "Custom contracts"] },
      ]
    }),

    FAQ({
      items: [
        { question: "Is there a free plan?",           answer: "Yes — our Starter tier is free forever with no credit card required." },
        { question: "Can I self-host?",                answer: "Enterprise customers can request a self-hosted deployment option."     },
        { question: "What frameworks are supported?",  answer: "React, Vue, and vanilla HTML/JS are all first-class targets."          },
      ]
    }),

    CTABand({
      headline: "Start building today.",
      sub: "No credit card. No lock-in. Just great components.",
      primaryCta: "Get started free",
      secondaryCta: "Talk to us",
    }),

    Footer({
      brand: "Forma",
      columns: [
        { title: "Product",    links: [{ label: "Features" }, { label: "Pricing" },  { label: "Changelog" }] },
        { title: "Developers", links: [{ label: "Docs" },     { label: "GitHub" },   { label: "Status" }]    },
        { title: "Company",    links: [{ label: "About" },    { label: "Blog" },     { label: "Careers" }]   },
      ]
    })
  )

*/

export {
  // Landing
  Navbar, Hero, Features, FeaturesAlternate,
  LogosBar, Testimonials, Pricing, FAQ,
  StatsBand, CTABand, Footer,

  // App shell
  Sidebar,

  // UI
  Button, Card, Badge, Avatar, Alert,
  InputField, Table, Tabs, Modal, StatCard,
  DropdownMenu, Breadcrumb, Toggle, Skeleton, ProgressBar,
}