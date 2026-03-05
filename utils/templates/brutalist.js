// ============================================================
//  BRUTALIST EDITORIAL COMPONENT LIBRARY — FUNCTIONAL TAG DSL
//  Style: Hard borders · No radius · Stark contrast · Raw type
//  Theming via Tailwind `dark:` variant only.
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
      "w-full border-b-2 border-black dark:border-white",
      "bg-white dark:bg-black",
      "sticky top-0 z-50 px-6 lg:px-10"
    ),

    div(
      cls("max-w-7xl mx-auto flex items-center justify-between h-14"),

      a(
        cls(
          "text-sm font-black uppercase tracking-[0.15em] shrink-0",
          "text-black dark:text-white"
        ),
        brand
      ),

      ul(
        cls("hidden md:flex items-stretch h-14"),
        ...links.map(link =>
          li(
            cls("relative group flex items-stretch"),

            a(
              cls(
                "flex items-center gap-1 px-5 text-xs font-bold uppercase tracking-widest transition-colors border-r border-black/10 dark:border-white/10",
                "text-black/50 hover:text-black hover:bg-black hover:text-white",
                "dark:text-white/50 dark:hover:text-black dark:hover:bg-white"
              ),
              link.label,
              link.children && span(cls("ml-1 text-[10px]"), "▾")
            ),

            link.children && div(
              cls(
                "absolute top-full left-0 min-w-52 z-50 border-2 border-black dark:border-white",
                "bg-white dark:bg-black",
                "opacity-0 pointer-events-none -translate-y-1",
                "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0",
                "transition-all duration-150"
              ),
              ul(
                cls(""),
                ...link.children.map((child, i) =>
                  li(
                    a(
                      cls(
                        "flex items-center px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                        "border-b border-black/10 last:border-0 dark:border-white/10",
                        "text-black/60 hover:text-white hover:bg-black",
                        "dark:text-white/60 dark:hover:text-black dark:hover:bg-white"
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
        cls("flex items-center gap-0"),

        button(
          cls(
            "hidden md:inline-flex items-center px-6 py-2 text-xs font-black uppercase tracking-widest transition-colors border-l-2 border-black dark:border-white h-14",
            "bg-black text-white hover:bg-white hover:text-black",
            "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
          ),
          cta
        ),

        button(
          cls("md:hidden flex flex-col gap-1.5 p-3"),
          span(cls("block w-5 h-0.5 bg-black dark:bg-white")),
          span(cls("block w-5 h-0.5 bg-black dark:bg-white")),
          span(cls("block w-5 h-0.5 bg-black dark:bg-white"))
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
  const w = collapsed ? "w-14" : "w-60"

  return aside(
    cls(
      `${w} h-full flex flex-col border-r-2 transition-all duration-300 shrink-0`,
      "border-black bg-white text-black",
      "dark:border-white dark:bg-black dark:text-white"
    ),

    div(
      cls("h-14 flex items-center border-b-2 border-black dark:border-white", collapsed ? "justify-center" : "px-5"),
      !collapsed && span(cls("text-xs font-black uppercase tracking-[0.2em]"), "Dashboard"),
      collapsed  && span(cls("text-lg font-black"), "//")
    ),

    nav(
      cls("flex-1 overflow-y-auto py-2"),
      ...items.map((item, i) =>
        div(
          cls("relative group"),

          a(
            cls(
              "flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer border-l-4",
              i === 0
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-transparent text-black/40 hover:border-black hover:text-black hover:bg-black/5 dark:text-white/40 dark:hover:border-white dark:hover:text-white dark:hover:bg-white/5"
            ),
            span(cls("text-base shrink-0 font-mono"), item.icon || "—"),
            !collapsed && span(cls("flex-1 truncate"), item.label),
            !collapsed && item.children && span(cls("text-[10px] opacity-40"), "▸")
          ),

          item.children && div(
            cls(
              "absolute left-full top-0 ml-0 min-w-48 z-50 border-2",
              "border-black bg-white dark:border-white dark:bg-black",
              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-100"
            ),
            p(cls("px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black dark:border-white text-black/40 dark:text-white/40"), item.label),
            ...item.children.map(child =>
              a(
                cls(
                  "flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors border-b border-black/10 last:border-0 dark:border-white/10",
                  "text-black/60 hover:bg-black hover:text-white dark:text-white/60 dark:hover:bg-white dark:hover:text-black"
                ),
                span(cls("font-mono opacity-50"), child.icon || "·"),
                child.label
              )
            )
          )
        )
      )
    ),

    div(
      cls("border-t-2 border-black dark:border-white py-2"),
      a(
        cls(
          "flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors border-l-4 border-transparent",
          "text-black/40 hover:border-black hover:text-black hover:bg-black/5",
          "dark:text-white/40 dark:hover:border-white dark:hover:text-white dark:hover:bg-white/5"
        ),
        span(cls("text-base font-mono"), "⚙"),
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
    cls(
      "relative overflow-hidden py-28 md:py-40 px-6",
      "bg-white dark:bg-black border-b-2 border-black dark:border-white"
    ),

    // Hard diagonal stripe decoration
    div(
      cls(
        "absolute top-0 right-0 w-1/3 h-full opacity-[0.03] dark:opacity-[0.06] pointer-events-none",
        "bg-[repeating-linear-gradient(-45deg,black_0px,black_1px,transparent_1px,transparent_12px)]",
        "dark:bg-[repeating-linear-gradient(-45deg,white_0px,white_1px,transparent_1px,transparent_12px)]"
      )
    ),

    div(
      cls("relative max-w-5xl mx-auto flex flex-col gap-8"),

      div(
        cls("flex flex-col gap-4"),

        badge && div(
          cls("flex items-center gap-0 w-fit border-2 border-black dark:border-white"),
          span(cls("px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] bg-black text-white dark:bg-white dark:text-black"), "New"),
          span(cls("px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black dark:text-white"), badge)
        ),

        eyebrow && p(
          cls("text-xs font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/30"),
          eyebrow
        ),

        h1(
          cls(
            "text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter",
            "text-black dark:text-white"
          ),
          headline
        ),
      ),

      div(
        cls("flex flex-col md:flex-row md:items-end justify-between gap-8 border-t-2 border-black dark:border-white pt-8"),

        p(
          cls("text-base leading-relaxed max-w-md text-black/60 dark:text-white/60"),
          sub
        ),

        div(
          cls("flex items-center gap-0 shrink-0"),

          button(
            cls(
              "inline-flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest transition-colors",
              "bg-black text-white hover:bg-white hover:text-black border-2 border-black",
              "dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white dark:border-white"
            ),
            primaryCta,
            span(cls("text-base"), "→")
          ),

          button(
            cls(
              "inline-flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest transition-colors",
              "bg-white text-black hover:bg-black hover:text-white border-2 border-l-0 border-black",
              "dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black dark:border-white"
            ),
            secondaryCta
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  FEATURES — grid
//  props: { eyebrow, headline, sub, items }
//  items: [{ icon, title, description }]
// ─────────────────────────────────────────────

function Features({ eyebrow = "Features", headline = "", sub = "", items = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-white dark:bg-black border-b-2 border-black dark:border-white"),

    div(
      cls("max-w-7xl mx-auto"),

      div(
        cls("flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b-2 border-black dark:border-white"),
        div(
          cls("flex flex-col gap-3"),
          eyebrow && p(cls("text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/30"), eyebrow),
          h2(cls("text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter text-black dark:text-white"), headline),
        ),
        sub && p(cls("text-sm leading-relaxed max-w-xs text-black/50 dark:text-white/50 md:text-right"), sub)
      ),

      div(
        cls("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l-2 border-t-2 border-black dark:border-white"),
        ...items.map(item =>
          div(
            cls(
              "flex flex-col gap-5 p-8 border-r-2 border-b-2 border-black dark:border-white group transition-colors",
              "hover:bg-black dark:hover:bg-white"
            ),
            span(
              cls(
                "text-3xl font-mono w-12 h-12 flex items-center justify-center border-2 border-black dark:border-white transition-colors",
                "group-hover:border-white dark:group-hover:border-black group-hover:text-white dark:group-hover:text-black"
              ),
              item.icon || "◆"
            ),
            div(
              cls("flex flex-col gap-2"),
              h3(
                cls("text-sm font-black uppercase tracking-widest transition-colors text-black dark:text-white group-hover:text-white dark:group-hover:text-black"),
                item.title
              ),
              p(
                cls("text-xs leading-relaxed transition-colors text-black/50 dark:text-white/50 group-hover:text-white/70 dark:group-hover:text-black/70"),
                item.description
              )
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
    cls("bg-white dark:bg-black border-b-2 border-black dark:border-white"),

    div(
      cls("max-w-7xl mx-auto"),
      ...items.map((item, i) =>
        div(
          cls(
            "grid grid-cols-1 lg:grid-cols-2 border-b-2 border-black dark:border-white last:border-b-0",
            i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
          ),

          div(
            cls(
              "flex flex-col justify-center gap-6 p-12 lg:p-16",
              i % 2 === 0 ? "lg:border-r-2 border-black dark:border-white" : "lg:border-l-2 border-black dark:border-white"
            ),
            item.eyebrow && span(cls("text-[10px] font-black uppercase tracking-[0.3em] text-black/30 dark:text-white/30"), item.eyebrow),
            h2(cls("text-3xl md:text-5xl font-black uppercase leading-none tracking-tighter text-black dark:text-white"), item.title),
            p(cls("text-sm leading-relaxed text-black/50 dark:text-white/50 max-w-sm"), item.description),
            item.cta && a(
              cls(
                "inline-flex items-center gap-3 w-fit px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors border-2",
                "border-black text-black hover:bg-black hover:text-white",
                "dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
              ),
              item.cta, span(cls(""), "→")
            )
          ),

          div(
            cls(
              "aspect-video flex items-center justify-center",
              "bg-black/5 dark:bg-white/5"
            ),
            item.visual || span(cls("text-6xl font-black text-black/10 dark:text-white/10 font-mono"), "//")
          )
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  LOGOS BAR
//  props: { label, logos }
// ─────────────────────────────────────────────

function LogosBar({ label = "Trusted by teams at", logos = [] }) {
  return section(
    cls("py-12 px-6 border-b-2 border-black dark:border-white bg-black dark:bg-white"),

    div(
      cls("max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"),

      p(
        cls("text-[10px] font-black uppercase tracking-[0.3em] text-white/40 dark:text-black/40 shrink-0"),
        label
      ),

      div(
        cls("w-px h-8 bg-white/20 dark:bg-black/20 hidden md:block shrink-0")
      ),

      div(
        cls("flex flex-wrap items-center justify-center md:justify-start gap-8"),
        ...logos.map(logo =>
          div(
            cls("flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/30 hover:text-white dark:text-black/30 dark:hover:text-black transition-colors"),
            logo.icon && span(cls("text-xl font-mono"), logo.icon),
            span(cls(""), logo.name)
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
    cls("py-24 md:py-32 px-6 bg-white dark:bg-black border-b-2 border-black dark:border-white"),
    div(
      cls("max-w-7xl mx-auto"),

      div(
        cls("mb-16 pb-8 border-b-2 border-black dark:border-white"),
        eyebrow && p(cls("text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-black/30 dark:text-white/30"), eyebrow),
        h2(cls("text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter text-black dark:text-white"), headline)
      ),

      div(
        cls("grid grid-cols-1 md:grid-cols-3 border-l-2 border-t-2 border-black dark:border-white"),
        ...items.map(item =>
          div(
            cls("flex flex-col justify-between gap-8 p-8 border-r-2 border-b-2 border-black dark:border-white"),

            p(
              cls("text-sm leading-relaxed text-black/70 dark:text-white/70 font-mono"),
              `"${item.quote}"`
            ),

            div(
              cls("flex flex-col gap-0.5 border-t-2 border-black dark:border-white pt-5"),
              p(cls("text-xs font-black uppercase tracking-widest text-black dark:text-white"), item.name),
              p(cls("text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40"), item.title)
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
    cls("py-24 md:py-32 px-6 bg-white dark:bg-black border-b-2 border-black dark:border-white"),
    div(
      cls("max-w-6xl mx-auto"),

      div(
        cls("mb-16 pb-8 border-b-2 border-black dark:border-white"),
        eyebrow && p(cls("text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-black/30 dark:text-white/30"), eyebrow),
        h2(cls("text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter text-black dark:text-white"), headline),
        sub && p(cls("mt-4 text-sm text-black/50 dark:text-white/50"), sub)
      ),

      div(
        cls("grid grid-cols-1 md:grid-cols-3 border-l-2 border-t-2 border-black dark:border-white"),
        ...plans.map(plan =>
          div(
            cls(
              "flex flex-col border-r-2 border-b-2 border-black dark:border-white relative",
              plan.highlighted ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-black dark:bg-black dark:text-white"
            ),

            plan.highlighted && div(
              cls("absolute top-0 left-0 right-0 h-1 bg-white dark:bg-black")
            ),

            div(
              cls("p-8 border-b-2", plan.highlighted ? "border-white/20 dark:border-black/20" : "border-black dark:border-white"),
              p(
                cls("text-[10px] font-black uppercase tracking-[0.3em] mb-4", plan.highlighted ? "text-white/50 dark:text-black/50" : "text-black/30 dark:text-white/30"),
                plan.name
              ),
              div(
                cls("flex items-end gap-2 mb-3"),
                span(cls("text-6xl font-black leading-none tracking-tighter font-mono"), plan.price),
                span(cls("text-xs font-bold uppercase tracking-widest mb-1", plan.highlighted ? "text-white/40 dark:text-black/40" : "text-black/30 dark:text-white/30"), plan.period || "/mo")
              ),
              plan.description && p(
                cls("text-xs leading-relaxed", plan.highlighted ? "text-white/60 dark:text-black/60" : "text-black/50 dark:text-white/50"),
                plan.description
              )
            ),

            div(
              cls("p-8 flex-1"),
              ul(
                cls("flex flex-col gap-3 mb-8"),
                ...(plan.features || []).map(feature =>
                  li(
                    cls("flex items-start gap-3 text-xs"),
                    span(
                      cls("shrink-0 font-black font-mono mt-0.5", plan.highlighted ? "text-white dark:text-black" : "text-black dark:text-white"),
                      "+"
                    ),
                    span(
                      cls(plan.highlighted ? "text-white/70 dark:text-black/70" : "text-black/60 dark:text-white/60"),
                      feature
                    )
                  )
                )
              ),

              button(
                cls(
                  "w-full py-3.5 text-xs font-black uppercase tracking-widest transition-colors border-2",
                  plan.highlighted
                    ? "border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
                    : "border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                ),
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
//  props: { eyebrow, headline, items }
//  items: [{ question, answer }]
// ─────────────────────────────────────────────

function FAQ({ eyebrow = "FAQ", headline = "Frequently asked questions", items = [] }) {
  return section(
    cls("py-24 md:py-32 px-6 bg-white dark:bg-black border-b-2 border-black dark:border-white"),
    div(
      cls("max-w-3xl mx-auto"),

      div(
        cls("mb-16 pb-8 border-b-2 border-black dark:border-white"),
        eyebrow && p(cls("text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-black/30 dark:text-white/30"), eyebrow),
        h2(cls("text-4xl md:text-6xl font-black uppercase leading-none tracking-tighter text-black dark:text-white"), headline)
      ),

      div(
        cls("border-t-2 border-black dark:border-white"),
        ...items.map(item =>
          details(
            cls("group border-b-2 border-black dark:border-white"),

            summary(
              cls(
                "flex items-center justify-between gap-4 py-5 cursor-pointer select-none list-none appearance-none [&::-webkit-details-marker]:hidden",
                "transition-colors hover:bg-black/5 dark:hover:bg-white/5 px-2 -mx-2"
              ),
              span(cls("text-xs font-black uppercase tracking-widest text-black dark:text-white"), item.question),
              span(
                cls(
                  "shrink-0 w-6 h-6 border-2 border-black dark:border-white flex items-center justify-center text-xs font-black transition-transform group-open:rotate-45 text-black dark:text-white"
                ),
                "+"
              )
            ),

            div(
              cls("pb-6 pt-4 border-t-2 border-black/10 dark:border-white/10 mt-1"),
              p(cls("text-xs leading-relaxed font-mono text-black/40 dark:text-white/40"), item.answer)
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
    cls("py-0 border-b-2 border-black dark:border-white bg-white dark:bg-black"),
    div(
      cls("max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-black dark:divide-white"),
      ...items.map(item =>
        div(
          cls("flex flex-col gap-1 px-8 py-12"),
          span(cls("text-5xl md:text-6xl font-black tabular-nums tracking-tighter leading-none font-mono text-black dark:text-white"), item.value),
          span(cls("text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30 mt-2"), item.label)
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
    cls("py-0 bg-white dark:bg-black border-b-2 border-black dark:border-white"),

    div(
      cls(
        "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2"
      ),

      div(
        cls("flex flex-col justify-center gap-6 px-12 py-20 lg:border-r-2 border-black dark:border-white"),
        h2(cls("text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter text-black dark:text-white"), headline),
        sub && p(cls("text-sm text-black/50 dark:text-white/50 max-w-sm leading-relaxed"), sub)
      ),

      div(
        cls("flex flex-col justify-center gap-0 px-12 py-20"),

        button(
          cls(
            "w-full py-5 text-xs font-black uppercase tracking-widest transition-colors border-2 border-black mb-0",
            "bg-black text-white hover:bg-white hover:text-black",
            "dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white"
          ),
          primaryCta
        ),

        button(
          cls(
            "w-full py-5 text-xs font-black uppercase tracking-widest transition-colors border-2 border-t-0 border-black",
            "bg-white text-black hover:bg-black hover:text-white",
            "dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black"
          ),
          secondaryCta
        )
      )
    )
  )
}


// ─────────────────────────────────────────────
//  FOOTER
//  props: { brand, columns, copyright }
// ─────────────────────────────────────────────

function Footer({ brand = "Acme", columns = [], copyright = "" }) {
  return footer(
    cls("border-t-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white"),
    div(
      cls("max-w-7xl mx-auto px-6 lg:px-10"),

      div(
        cls("grid grid-cols-2 md:grid-cols-4 border-b-2 border-black dark:border-white"),

        div(
          cls("col-span-2 md:col-span-1 py-12 md:border-r-2 border-black dark:border-white pr-8"),
          p(cls("text-sm font-black uppercase tracking-[0.2em] mb-3"), brand),
          p(cls("text-xs leading-relaxed text-black/40 dark:text-white/40 max-w-xs"), "Building the tools that move modern teams forward.")
        ),

        ...columns.map((col, i) =>
          div(
            cls("py-12 px-8 border-r-2 border-black dark:border-white last:border-r-0"),
            h5(cls("text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-black/30 dark:text-white/30"), col.title),
            ul(
              cls("flex flex-col gap-3"),
              ...col.links.map(link =>
                li(
                  a(
                    cls("text-xs font-bold uppercase tracking-widest transition-colors text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"),
                    link.label
                  )
                )
              )
            )
          )
        )
      ),

      div(
        cls("flex flex-col sm:flex-row items-center justify-between gap-4 py-6"),
        p(cls("text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30"), copyright || `© ${new Date().getFullYear()} ${brand}`),
        div(
          cls("flex gap-6"),
          a(cls("text-[10px] font-bold uppercase tracking-widest transition-colors text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white"), "Privacy"),
          a(cls("text-[10px] font-bold uppercase tracking-widest transition-colors text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white"), "Terms"),
          a(cls("text-[10px] font-bold uppercase tracking-widest transition-colors text-black/30 hover:text-black dark:text-white/30 dark:hover:text-white"), "Cookies")
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
// ─────────────────────────────────────────────

function Button({ label = "Click", variant = "primary", size = "md", disabled = false, icon = null }) {
  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3 text-xs",
    lg: "px-8 py-4 text-sm",
  }

  const variants = {
    primary:   "bg-black text-white border-2 border-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white",
    secondary: "bg-white text-black border-2 border-black hover:bg-black hover:text-white dark:bg-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black",
    ghost:     "bg-transparent text-black border-2 border-transparent hover:border-black dark:text-white dark:hover:border-white",
    danger:    "bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white dark:bg-black dark:text-red-400 dark:border-red-400 dark:hover:bg-red-400 dark:hover:text-black",
    outline:   "bg-transparent text-black border-2 border-black/30 hover:border-black dark:text-white dark:border-white/30 dark:hover:border-white",
  }

  return button(
    cls(
      "inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-colors",
      sizes[size], variants[variant],
      disabled ? "opacity-30 cursor-not-allowed pointer-events-none" : "cursor-pointer"
    ),
    icon && span(cls("font-mono"), icon),
    label
  )
}


// ─────────────────────────────────────────────
//  CARD
//  props: { title, body, footer, badge }
// ─────────────────────────────────────────────

function Card({ title = "", body = "", footer = null, badge = null }) {
  return article(
    cls(
      "border-2 border-black dark:border-white",
      "bg-white text-black dark:bg-black dark:text-white"
    ),

    div(
      cls("p-6 flex flex-col gap-4"),
      badge && span(
        cls("inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] w-fit border border-black dark:border-white text-black dark:text-white"),
        badge
      ),
      title && h3(cls("text-sm font-black uppercase tracking-widest leading-tight"), title),
      body  && p(cls("text-xs leading-relaxed text-black/50 dark:text-white/50 font-mono"), body),
    ),

    footer && div(
      cls("px-6 pb-6 pt-4 border-t-2 border-black dark:border-white"),
      footer
    )
  )
}


// ─────────────────────────────────────────────
//  BADGE
//  props: { label, variant }
// ─────────────────────────────────────────────

function Badge({ label = "", variant = "default" }) {
  const variants = {
    default: "border-black text-black dark:border-white dark:text-white",
    success: "border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-400",
    warning: "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-400",
    danger:  "border-red-600 text-red-700 dark:border-red-400 dark:text-red-400",
    info:    "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400",
  }
  return span(
    cls(`inline-flex items-center px-2 py-0.5 border text-[10px] font-black uppercase tracking-[0.15em] ${variants[variant]}`),
    label
  )
}


// ─────────────────────────────────────────────
//  AVATAR
//  props: { name, size, status }
// ─────────────────────────────────────────────

function Avatar({ name = "User", size = "md", status = null }) {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm", xl: "w-16 h-16 text-base" }
  const statusColors = { online: "bg-black dark:bg-white", offline: "bg-black/30 dark:bg-white/30", away: "bg-black/60 dark:bg-white/60" }
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  return div(
    cls("relative inline-flex shrink-0"),
    div(
      cls(`${sizes[size]} border-2 border-black dark:border-white flex items-center justify-center font-black tracking-tighter bg-white text-black dark:bg-black dark:text-white`),
      initials
    ),
    status && span(
      cls(`absolute bottom-0 right-0 block w-2.5 h-2.5 border-2 border-white dark:border-black ${statusColors[status]}`)
    )
  )
}


// ─────────────────────────────────────────────
//  ALERT
//  props: { title, message, variant }
// ─────────────────────────────────────────────

function Alert({ title = "", message = "", variant = "info" }) {
  const accents = {
    info:    "border-l-4 border-blue-600 dark:border-blue-400",
    success: "border-l-4 border-emerald-600 dark:border-emerald-400",
    warning: "border-l-4 border-amber-500 dark:border-amber-400",
    danger:  "border-l-4 border-red-600 dark:border-red-400",
  }
  const icons = { info: "i", success: "✓", warning: "!", danger: "✕" }
  const iconColors = {
    info:    "text-blue-600 dark:text-blue-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger:  "text-red-600 dark:text-red-400",
  }

  return div(
    cls(`flex gap-4 p-5 border-2 border-black dark:border-white bg-white dark:bg-black ${accents[variant]}`),
    span(cls(`text-sm font-black font-mono shrink-0 mt-0.5 ${iconColors[variant]}`), icons[variant]),
    div(
      cls("flex flex-col gap-1"),
      title   && p(cls("text-xs font-black uppercase tracking-widest text-black dark:text-white"), title),
      message && p(cls("text-xs font-mono text-black/50 dark:text-white/50 leading-relaxed"), message)
    )
  )
}


// ─────────────────────────────────────────────
//  INPUT FIELD
//  props: { label, placeholder, type, hint, error }
// ─────────────────────────────────────────────

function InputField({ label: labelText = "", placeholder = "", type = "text", hint = "", error = "" }) {
  return div(
    cls("flex flex-col gap-2"),

    labelText &&
      label(
        cls("text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white"),
        labelText
      ),

    input(
      cls(
        "w-full px-4 py-3 border-2 text-sm font-mono outline-none transition-colors",
        "bg-white text-black placeholder-black/30 border-black",
        "focus:border-black focus:bg-black/5",
        "dark:bg-black dark:text-white dark:placeholder-white/30 dark:border-white",
        "dark:focus:bg-white/5",
        error ? "border-red-600 dark:border-red-400" : ""
      ),
      { type, placeholder }
    ),

    error &&
      span(
        cls("text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400"),
        error
      ),

    !error && hint &&
      span(
        cls("text-[10px] font-mono text-black/30 dark:text-white/30"),
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
    cls("border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden"),
    div(
      cls("overflow-x-auto"),
      table(
        cls("min-w-full"),

        thead(
          tr(
            cls("border-b-2 border-black dark:border-white bg-black dark:bg-white"),
            ...columns.map(col =>
              th(
                cls("px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-white dark:text-black"),
                col.label
              )
            )
          )
        ),

        tbody(
          ...rows.map(row =>
            tr(
              cls("border-b border-black/10 dark:border-white/10 last:border-b-0 transition-colors hover:bg-black/5 dark:hover:bg-white/5"),
              ...columns.map(col =>
                td(
                  cls("px-5 py-3.5 text-xs font-mono text-black/70 dark:text-white/70"),
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
    cls("flex border-b-2 border-black dark:border-white"),
    ...tabs.map((tab, i) =>
      button(
        cls(
          "flex items-center gap-2 px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-colors border-r border-black/10 dark:border-white/10 last:border-r-0",
          i === activeIndex
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-black/40 hover:text-black hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5"
        ),
        tab.icon && span(cls("font-mono text-sm"), tab.icon),
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
    cls("fixed inset-0 bg-black/80 dark:bg-white/20 flex items-center justify-center z-50 p-4"),
    div(
      cls(`w-full ${sizes[size]} border-2 border-black dark:border-white bg-white dark:bg-black`),

      div(
        cls("flex items-center justify-between px-6 py-4 border-b-2 border-black dark:border-white"),
        h2(cls("text-xs font-black uppercase tracking-widest text-black dark:text-white"), title),
        button(
          cls("w-8 h-8 border-2 border-black dark:border-white flex items-center justify-center text-xs font-black transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white"),
          "✕"
        )
      ),

      div(
        cls("px-6 py-6"),
        p(cls("text-xs font-mono leading-relaxed text-black/50 dark:text-white/50"), body)
      ),

      actions.length > 0 && div(
        cls("flex items-center justify-end gap-0 px-6 py-4 border-t-2 border-black dark:border-white"),
        ...actions
      )
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
    cls("border-2 border-black dark:border-white p-6 flex flex-col gap-5 bg-white dark:bg-black"),

    div(
      cls("flex items-start justify-between"),
      div(
        cls("flex flex-col gap-1"),
        span(cls("text-[10px] font-black uppercase tracking-[0.2em] text-black/30 dark:text-white/30"), label),
        span(cls("text-5xl font-black tabular-nums tracking-tighter leading-none font-mono text-black dark:text-white"), value)
      ),
      icon && div(
        cls("w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center text-base font-mono text-black dark:text-white"),
        icon
      )
    ),

    delta && div(
      cls("flex items-center gap-2 border-t border-black/10 dark:border-white/10 pt-4"),
      span(cls(`text-xs font-black font-mono ${isPos ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`), delta),
      span(cls("text-[10px] uppercase tracking-widest font-bold text-black/30 dark:text-white/30"), "vs last period")
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
      cls(
        "inline-flex items-center gap-3 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest border-2 transition-colors",
        "border-black text-black hover:bg-black hover:text-white",
        "dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
      ),
      trigger, span(cls("font-mono text-xs"), "▾")
    ),
    div(
      cls(
        "absolute right-0 mt-0 min-w-48 border-2 border-t-0 z-50 overflow-hidden",
        "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-100",
        "border-black bg-white dark:border-white dark:bg-black"
      ),
      ul(
        cls(""),
        ...items.map(item =>
          item.divider
            ? li(cls("border-t border-black/10 dark:border-white/10 my-0"))
            : li(
                a(
                  cls(
                    "flex items-center gap-3 px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer border-b border-black/10 last:border-0 dark:border-white/10",
                    "text-black/60 hover:text-white hover:bg-black dark:text-white/60 dark:hover:text-black dark:hover:bg-white"
                  ),
                  item.icon && span(cls("font-mono"), item.icon),
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
//  props: { items }
// ─────────────────────────────────────────────

function Breadcrumb({ items = [] }) {
  return nav(
    cls("flex items-center gap-2"),
    ...items.map((item, i) =>
      div(
        cls("flex items-center gap-2"),
        i > 0 && span(cls("text-[10px] font-black text-black/20 dark:text-white/20"), "/"),
        i < items.length - 1
          ? a(cls("text-[10px] font-bold uppercase tracking-widest transition-colors text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"), item.label)
          : span(cls("text-[10px] font-black uppercase tracking-widest text-black dark:text-white"), item.label)
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
    cls("inline-flex items-center gap-4 cursor-pointer select-none"),
    div(
      cls(
        "relative w-10 h-6 border-2 transition-colors",
        "border-black dark:border-white",
        checked ? "bg-black dark:bg-white" : "bg-white dark:bg-black"
      ),
      span(
        cls(
          "absolute top-0.5 w-4 h-4 transition-transform",
          checked
            ? "translate-x-[18px] bg-white dark:bg-black"
            : "translate-x-0.5 bg-black dark:bg-white"
        )
      )
    ),
    labelText &&
      span(
        cls("text-[10px] font-black uppercase tracking-widest text-black dark:text-white"),
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
    hasAvatar && div(cls("w-10 h-10 shrink-0 animate-pulse bg-black/10 dark:bg-white/10 border-2 border-black/20 dark:border-white/20")),
    div(
      cls("flex-1 flex flex-col gap-3 py-1"),
      ...Array.from({ length: lines }, (_, i) =>
        div(cls(`h-2 animate-pulse bg-black/10 dark:bg-white/10 ${i === lines - 1 ? "w-3/5" : i === 0 ? "w-full" : "w-4/5"}`))
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
  const fills = {
    default: "bg-black dark:bg-white",
    success: "bg-emerald-600 dark:bg-emerald-400",
    warning: "bg-amber-500 dark:bg-amber-400",
    danger:  "bg-red-600 dark:bg-red-400",
  }
  return div(
    cls("flex flex-col gap-2"),
    (label || value !== undefined) && div(
      cls("flex items-center justify-between"),
      label && span(cls("text-[10px] font-black uppercase tracking-widest text-black dark:text-white"), label),
      span(cls("text-[10px] font-black font-mono text-black/40 dark:text-white/40"), `${pct}%`)
    ),
    div(
      cls("w-full h-1.5 bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20"),
      div(cls(`h-full transition-all duration-500 ${fills[variant]}`), { style: `width: ${pct}%` })
    )
  )
}


// ═══════════════════════════════════════════════════════════
//  EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════

/*

const page =
  div(cls("min-h-screen bg-white dark:bg-black"),

    Navbar({
      brand: "MONOLITH",
      cta: "Launch",
      links: [
        { label: "Work",    href: "#", children: [
            { label: "Case Studies", href: "#" },
            { label: "Process",      href: "#" },
            { label: "Archive",      href: "#" },
        ]},
        { label: "Studio",  href: "#" },
        { label: "Journal", href: "#" },
        { label: "Contact", href: "#" },
      ]
    }),

    Hero({
      badge: "SS/2025 Collection",
      eyebrow: "Design infrastructure",
      headline: "Built for the uncompromising.",
      sub: "A component system that refuses to look like everything else.",
      primaryCta: "Start building",
      secondaryCta: "View manifesto",
    }),

    LogosBar({
      label: "Deployed by",
      logos: [
        { name: "Stripe",  icon: "◈" }, { name: "Linear",  icon: "◆" },
        { name: "Vercel",  icon: "▲" }, { name: "Figma",   icon: "✦" },
        { name: "Notion",  icon: "□" },
      ]
    }),

    Features({
      eyebrow: "Principles",
      headline: "No compromises.",
      items: [
        { icon: "01", title: "Zero decoration",   description: "Every element earns its place. Nothing exists for aesthetics alone." },
        { icon: "02", title: "Hard edges",         description: "Borders are load-bearing. Radius is a crutch." },
        { icon: "03", title: "Monospace data",     description: "Numbers and code in mono. Always. Without exception." },
        { icon: "04", title: "Uppercase labels",   description: "UI text is infrastructure signage, not body copy." },
        { icon: "05", title: "Contrast first",     description: "If you can't read it from across the room, redesign it." },
        { icon: "06", title: "Dark by default",    description: "True black. Not zinc-950. Not slate-900. Black." },
      ]
    }),

    StatsBand({
      items: [
        { value: "100%",  label: "Vanilla Tailwind" },
        { value: "0px",   label: "Border radius"    },
        { value: "2px",   label: "Border weight"    },
        { value: "∞",     label: "Opinions"         },
      ]
    }),

    Pricing({
      plans: [
        { name: "Open",      price: "$0",   period: "/mo",  cta: "Take it",       features: ["All components", "MIT license", "No attribution"] },
        { name: "Studio",    price: "$49",  period: "/mo",  cta: "Get access",    features: ["Figma source", "Design tokens", "Priority issues", "Slack channel"], highlighted: true },
        { name: "Corporate", price: "???",  period: "",     cta: "Talk to us",    features: ["Everything", "Custom build", "NDA available", "Dedicated support"] },
      ]
    }),

    FAQ({
      items: [
        { question: "Is this actually production-ready?",  answer: "Yes. It is used in production by multiple teams. The brutalist aesthetic is intentional, not accidental." },
        { question: "Why no border-radius?",               answer: "Because rounded corners are a comfort crutch. Hard edges communicate precision and confidence." },
        { question: "Can I mix this with other libraries?", answer: "You can. You probably shouldn't. The aesthetic coherence is the point." },
      ]
    }),

    CTABand({
      headline: "No more boring UIs.",
      sub: "Ship something people will actually remember.",
      primaryCta: "Start now",
      secondaryCta: "Read the docs",
    }),

    Footer({
      brand: "MONOLITH",
      columns: [
        { title: "Work",    links: [{ label: "Components" }, { label: "Templates" }, { label: "Changelog" }] },
        { title: "Studio",  links: [{ label: "About" },      { label: "Manifesto" }, { label: "Careers" }]   },
        { title: "Connect", links: [{ label: "GitHub" },     { label: "Twitter" },   { label: "Contact" }]   },
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