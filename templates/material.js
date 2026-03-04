// ============================================================
//  MATERIAL DESIGN 3 COMPONENT LIBRARY — FUNCTIONAL TAG DSL
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
  primary:            ["indigo-600",      "indigo-400"      ],
  primaryHover:       ["indigo-500",      "indigo-300"      ],
  primaryDark:        ["indigo-700",      "indigo-500"      ],
  primaryBg:          ["indigo-600",      "indigo-500"      ],   // filled button bg
  primaryBgHover:     ["indigo-500",      "indigo-400"      ],
  primaryTonal:       ["indigo-100",      "indigo-950/60"   ],   // chip / icon container
  primaryTonalText:   ["indigo-700",      "indigo-300"      ],
  primaryTonalHover:  ["indigo-200",      "indigo-950"      ],
  primarySubtle:      ["indigo-50",       "indigo-950/40"   ],   // hover row tint
  primaryRing:        ["indigo-200",      "indigo-800"      ],
  primaryGradFrom:    ["indigo-50",       "indigo-950/30"   ],
  primaryGradTo:      ["purple-50",       "purple-950/20"   ],
  primaryBand:        ["indigo-600",      "indigo-700"      ],   // StatsBand bg
  primaryCta:         ["indigo-600",      "indigo-700"      ],   // CTABand gradient start
  primaryCtaVia:      ["indigo-700",      "indigo-800"      ],
  primaryCtaTo:       ["purple-700",      "purple-900"      ],

  // ── Avatar gradient ──────────────────────────────────────
  avatarFrom:         ["indigo-400",      "indigo-400"      ],
  avatarTo:           ["purple-500",      "purple-500"      ],

  // ── Neutral surface ──────────────────────────────────────
  surface:            ["white",           "neutral-900"     ],
  surfaceAlt:         ["neutral-50",      "neutral-900"     ],   // sidebar, logos bar
  surfaceCard:        ["white",           "neutral-900"     ],
  surfaceInput:       ["neutral-100",     "neutral-800"     ],
  surfaceInputFocus:  ["white",           "neutral-800"     ],

  // ── Neutral foreground ───────────────────────────────────
  onSurface:          ["neutral-900",     "white"           ],
  onSurfaceMid:       ["neutral-700",     "neutral-300"     ],
  onSurfaceSub:       ["neutral-600",     "neutral-400"     ],
  onSurfaceMuted:     ["neutral-500",     "neutral-400"     ],
  onSurfaceFaint:     ["neutral-400",     "neutral-500"     ],
  onSurfaceDisabled:  ["neutral-300",     "neutral-600"     ],

  // ── Dividers ─────────────────────────────────────────────
  divider:            ["neutral-100",     "neutral-800"     ],
  dividerMid:         ["neutral-200",     "neutral-700"     ],
  dividerStrong:      ["neutral-200",     "neutral-800"     ],

  // ── Semantic: Success ────────────────────────────────────
  success:            ["emerald-500",     "emerald-400"     ],
  successBg:          ["emerald-100",     "emerald-950/60"  ],
  successText:        ["emerald-700",     "emerald-400"     ],
  successWrap:        ["emerald-50",      "emerald-950/30"  ],
  successRing:        ["emerald-200",     "emerald-800"     ],

  // ── Semantic: Warning ────────────────────────────────────
  warning:            ["amber-400",       "amber-400"       ],
  warningBg:          ["amber-100",       "amber-950/60"    ],
  warningText:        ["amber-700",       "amber-400"       ],
  warningWrap:        ["amber-50",        "amber-950/30"    ],
  warningRing:        ["amber-200",       "amber-800"       ],

  // ── Semantic: Danger ─────────────────────────────────────
  danger:             ["red-600",         "red-400"         ],
  dangerBg:           ["red-100",         "red-950/60"      ],
  dangerText:         ["red-700",         "red-400"         ],
  dangerWrap:         ["red-50",          "red-950/30"      ],
  dangerRing:         ["red-200",         "red-800"         ],
  dangerBgFilled:     ["red-600",         "red-500"         ],
  dangerBgHover:      ["red-500",         "red-400"         ],

  // ── Semantic: Info ───────────────────────────────────────
  info:               ["blue-600",        "blue-400"        ],
  infoBg:             ["blue-100",        "blue-950/60"     ],
  infoText:           ["blue-700",        "blue-400"        ],
  infoWrap:           ["blue-50",         "blue-950/30"     ],
  infoRing:           ["blue-200",        "blue-800"        ],

  // ── Footer ───────────────────────────────────────────────
  footerBg:           ["neutral-950",     "neutral-950"     ],
  footerText:         ["neutral-300",     "neutral-300"     ],
  footerMuted:        ["neutral-500",     "neutral-500"     ],
  footerFaint:        ["neutral-600",     "neutral-600"     ],
}


// ═══════════════════════════════════════════════════════════
//  TOKEN HELPERS
//
//  T("token", "prefix")  →  "prefix-light dark:prefix-dark"
//  Shorthand aliases cover the most common CSS properties.
// ═══════════════════════════════════════════════════════════

function T(token, prefix = "text") {
  const pair = PALETTE[token]
  if (!pair) throw new Error(`Unknown palette token: "${token}"`)
  const [light, dark] = pair
  return `${prefix}-${light} dark:${prefix}-${dark}`
}

const bg     = t => T(t, "bg")
const tx     = t => T(t, "text")
const bdr    = t => T(t, "border")
const rng    = t => T(t, "ring")
const shd    = t => T(t, "shadow")
const frm    = t => T(t, "from")
const too    = t => T(t, "to")
const via    = t => T(t, "via")
const ph     = t => T(t, "placeholder")
const divide = t => T(t, "divide")


// ═══════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════


// ─────────────────────────────────────────────
//  NAVBAR
//  props: { brand, links, cta }
//  links: [{ label, href, children?: [{ label, href }] }]
// ─────────────────────────────────────────────

function Navbar({ brand = "Acme", links = [], cta = "Get Started" }) {
  // Unique ID so multiple Navbars on the same page don't collide
  const menuId = `nav-menu-${Math.random().toString(36).slice(2, 7)}`

  const toggleMenu = `
    (function(btn) {
      var menu = document.getElementById('${menuId}');
      var isHidden = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!isHidden));
    })(this)
  `.trim()

  return nav(
    cls(
      "w-full sticky top-0 z-50 px-6 lg:px-10 backdrop-blur-md shadow-sm",
      bg("surface"), "bg-opacity-90"
    ),

    // ── Top bar ──────────────────────────────────────────────
    div(
      cls("max-w-7xl mx-auto flex items-center justify-between h-16"),

      a(cls("text-base font-semibold tracking-tight shrink-0", tx("primary")), brand),

      // Desktop links
      ul(
        cls("hidden md:flex items-stretch h-16"),
        ...links.map(link =>
          li(
            cls("relative group flex items-stretch"),

            a(
              cls(
                "flex items-center gap-1 px-4 text-sm font-medium transition-colors",
                tx("onSurfaceSub"),
                `hover:${tx("primary").split(" ")[0]} hover:${bg("primarySubtle").split(" ")[0]}`
              ),
              link.label,
              link.children && span(cls("ml-1 text-[10px] opacity-60"), "▾")
            ),

            link.children && div(
              cls(
                "absolute top-full left-0 min-w-52 z-50 rounded-xl overflow-hidden py-2",
                bg("surface"),
                "shadow-xl shadow-black/10 dark:shadow-black/40",
                "ring-1 ring-black/5 dark:ring-white/10",
                "opacity-0 pointer-events-none -translate-y-2",
                "group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-1",
                "transition-all duration-200"
              ),
              ul(
                cls(""),
                ...link.children.map(child =>
                  li(
                    a(
                      cls(
                        "flex items-center px-4 py-2.5 text-sm font-medium transition-colors",
                        tx("onSurfaceMid"),
                        `hover:${tx("primary").split(" ")[0]} hover:${bg("primarySubtle").split(" ")[0]}`
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

        // Desktop CTA
        button(
          cls(
            "hidden md:inline-flex items-center px-5 py-2 text-sm font-semibold transition-all rounded-full text-white",
            bg("primaryBg"),
            `hover:${bg("primaryBgHover").split(" ")[0]}`,
            "shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40"
          ),
          cta
        ),

        // Hamburger — onclick toggles the mobile drawer
        button(
          cls("md:hidden flex flex-col gap-1.5 p-2 rounded-full transition-colors", `hover:${bg("surfaceAlt").split(" ")[0]}`),
          { onclick: toggleMenu, "aria-expanded": "false", "aria-controls": menuId, "aria-label": "Toggle menu" },
          span(cls("block w-5 h-0.5 rounded-full", bg("onSurfaceMid"))),
          span(cls("block w-5 h-0.5 rounded-full", bg("onSurfaceMid"))),
          span(cls("block w-5 h-0.5 rounded-full", bg("onSurfaceMid")))
        )
      )
    ),

    // ── Mobile drawer (hidden by default) ────────────────────
    div(
      { id: menuId },
      cls(
        "hidden md:hidden border-t pb-4 pt-2",
        bg("surface"), bdr("divider")
      ),

      // Flat list — children indented inline under their parent
      ul(
        cls("flex flex-col"),
        ...links.flatMap(link => [
          li(
            a(
              cls(
                "flex items-center px-4 py-3 text-sm font-semibold transition-colors rounded-xl mx-2",
                tx("onSurface"),
                `hover:${bg("primarySubtle").split(" ")[0]} hover:${tx("primary").split(" ")[0]}`
              ),
              link.label
            )
          ),
          ...(link.children || []).map(child =>
            li(
              a(
                cls(
                  "flex items-center pl-8 pr-4 py-2.5 text-sm font-medium transition-colors rounded-xl mx-2",
                  tx("onSurfaceSub"),
                  `hover:${bg("primarySubtle").split(" ")[0]} hover:${tx("primary").split(" ")[0]}`
                ),
                span(cls("mr-2 text-xs opacity-30"), "↳"),
                child.label
              )
            )
          ),
        ])
      ),

      // Mobile CTA
      div(
        cls("px-4 pt-3"),
        button(
          cls(
            "w-full py-3 text-sm font-semibold transition-all rounded-full text-white",
            bg("primaryBg"), `hover:${bg("primaryBgHover").split(" ")[0]}`,
            "shadow-md shadow-indigo-500/30"
          ),
          cta
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
  const w = collapsed ? "w-[72px]" : "w-64"

  return aside(
    cls(
      `${w} h-full flex flex-col transition-all duration-300 shrink-0 rounded-r-3xl overflow-hidden`,
      bg("surfaceAlt"),
      "shadow-lg shadow-black/5 dark:shadow-black/30"
    ),

    div(
      cls("h-16 flex items-center", collapsed ? "justify-center px-4" : "px-5"),
      !collapsed && span(cls("text-sm font-semibold tracking-tight", tx("primary")), "Dashboard"),
      collapsed  && span(cls("text-xl font-bold", tx("primary")), "D")
    ),

    nav(
      cls("flex-1 overflow-y-auto py-2 px-3"),
      ...items.map((item, i) =>
        div(
          cls("relative group mb-1"),

          a(
            cls(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-2xl",
              i === 0
                ? `${bg("primaryTonal")} ${tx("primaryTonalText")}`
                : `${tx("onSurfaceSub")} hover:${bg("dividerMid").split(" ")[0]} hover:${tx("onSurface").split(" ")[0]}`
            ),
            span(cls("text-base shrink-0 font-medium"), item.icon || "•"),
            !collapsed && span(cls("flex-1 truncate"), item.label),
            !collapsed && item.children && span(cls("text-[10px] opacity-40"), "▸")
          ),

          item.children && div(
            cls(
              "absolute left-full top-0 ml-2 min-w-48 z-50 rounded-xl overflow-hidden",
              bg("surface"),
              "shadow-xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10",
              "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-150"
            ),
            p(cls("px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest border-b", tx("onSurfaceFaint"), bdr("divider")), item.label),
            ...item.children.map(child =>
              a(
                cls(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors",
                  tx("onSurfaceMid"),
                  `hover:${bg("primarySubtle").split(" ")[0]} hover:${tx("primary").split(" ")[0]}`
                ),
                span(cls("opacity-50 text-sm"), child.icon || "·"),
                child.label
              )
            )
          )
        )
      )
    ),

    div(
      cls("py-3 px-3 border-t", bdr("dividerStrong")),
      a(
        cls(
          "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-2xl",
          tx("onSurfaceSub"),
          `hover:${bg("dividerMid").split(" ")[0]} hover:${tx("onSurface").split(" ")[0]}`
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
    cls(
      "relative overflow-hidden py-28 md:py-40 px-6",
      `bg-gradient-to-br ${frm("primaryGradFrom")} via-white ${too("primaryGradTo")}`,
      "dark:via-neutral-950"
    ),

    div(cls("absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.2),transparent)]")),

    div(
      cls("relative max-w-4xl mx-auto flex flex-col gap-8 text-center items-center"),

      div(
        cls("flex flex-col items-center gap-4"),

        badge && div(
          cls("inline-flex items-center gap-2 px-4 py-1.5 rounded-full ring-1", bg("primaryTonal"), rng("primaryRing")),
          span(cls("w-1.5 h-1.5 rounded-full animate-pulse", bg("primary"))),
          span(cls("text-xs font-semibold", tx("primaryTonalText")), badge)
        ),

        eyebrow && p(cls("text-xs font-semibold uppercase tracking-widest", tx("primary")), eyebrow),

        h1(cls("text-5xl md:text-7xl font-bold leading-tight tracking-tight", tx("onSurface")), headline),
      ),

      div(
        cls("flex flex-col items-center gap-6 pt-2"),

        p(cls("text-lg leading-relaxed max-w-lg", tx("onSurfaceMuted")), sub),

        div(
          cls("flex flex-wrap items-center justify-center gap-3"),

          button(
            cls(
              "inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all rounded-full text-white",
              bg("primaryBg"), `hover:${bg("primaryBgHover").split(" ")[0]}`,
              "shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            ),
            primaryCta, span(cls("text-base"), "→")
          ),

          button(
            cls(
              "inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold transition-all rounded-full hover:-translate-y-0.5",
              bg("surface"), tx("onSurfaceMid"),
              "shadow-md shadow-black/8 hover:shadow-lg ring-1", rng("dividerMid")
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
    cls("py-24 md:py-32 px-6", bg("surface")),

    div(
      cls("max-w-7xl mx-auto"),

      div(
        cls("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"),
        div(
          cls("flex flex-col gap-3"),
          eyebrow && p(cls("text-xs font-semibold uppercase tracking-widest", tx("primary")), eyebrow),
          h2(cls("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")), headline),
        ),
        sub && p(cls("text-sm leading-relaxed max-w-xs md:text-right", tx("onSurfaceMuted")), sub)
      ),

      div(
        cls("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"),
        ...items.map(item =>
          div(
            cls(
              "flex flex-col gap-5 p-7 rounded-3xl group transition-all duration-300 cursor-default",
              bg("surfaceAlt"),
              `hover:${bg("primaryBg").split(" ")[0]}`,
              "hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1"
            ),
            span(
              cls("text-2xl w-12 h-12 flex items-center justify-center rounded-2xl transition-colors", bg("primaryTonal"), "group-hover:bg-white/20"),
              item.icon || "◆"
            ),
            div(
              cls("flex flex-col gap-2"),
              h3(cls("text-sm font-semibold tracking-tight transition-colors group-hover:text-white", tx("onSurface")), item.title),
              p(cls("text-xs leading-relaxed transition-colors group-hover:text-white/70", tx("onSurfaceMuted")), item.description)
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
    cls("py-12 px-6", bg("surface")),

    div(
      cls("max-w-7xl mx-auto flex flex-col gap-8"),
      ...items.map((item, i) =>
        div(
          cls(
            "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl overflow-hidden",
            bg("surfaceAlt"),
            i % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
          ),

          div(
            cls("flex flex-col justify-center gap-5 p-10 lg:p-14"),
            item.eyebrow && span(cls("text-xs font-semibold uppercase tracking-widest", tx("primary")), item.eyebrow),
            h2(cls("text-3xl md:text-4xl font-bold leading-tight tracking-tight", tx("onSurface")), item.title),
            p(cls("text-sm leading-relaxed max-w-sm", tx("onSurfaceMuted")), item.description),
            item.cta && a(
              cls(
                "inline-flex items-center gap-2 w-fit px-5 py-2.5 text-sm font-semibold transition-all rounded-full text-white",
                bg("primaryBg"), `hover:${bg("primaryBgHover").split(" ")[0]}`,
                "shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30"
              ),
              item.cta, span(cls(""), "→")
            )
          ),

          div(
            cls("aspect-video flex items-center justify-center", `bg-gradient-to-br ${frm("primaryTonal")} ${too("primaryGradTo")}`),
            item.visual || span(cls("text-5xl text-indigo-300/50 dark:text-indigo-700/50"), "◈")
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
    cls("py-12 px-6", bg("surfaceAlt")),

    div(
      cls("max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"),

      p(cls("text-xs font-semibold uppercase tracking-widest shrink-0", tx("onSurfaceFaint")), label),

      div(cls("w-px h-8 hidden md:block shrink-0", bg("dividerMid"))),

      div(
        cls("flex flex-wrap items-center justify-center md:justify-start gap-8"),
        ...logos.map(logo =>
          div(
            cls("flex items-center gap-2 text-sm font-semibold transition-colors", tx("onSurfaceDisabled"), `hover:${tx("onSurfaceMid").split(" ")[0]}`),
            logo.icon && span(cls("text-lg"), logo.icon),
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
    cls("py-24 md:py-32 px-6", bg("surfaceAlt")),
    div(
      cls("max-w-7xl mx-auto"),

      div(
        cls("mb-16 text-center"),
        eyebrow && p(cls("text-xs font-semibold uppercase tracking-widest mb-3", tx("primary")), eyebrow),
        h2(cls("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")), headline)
      ),

      div(
        cls("grid grid-cols-1 md:grid-cols-3 gap-5"),
        ...items.map(item =>
          div(
            cls("flex flex-col justify-between gap-8 p-7 rounded-3xl shadow-sm shadow-black/5 dark:shadow-black/20 ring-1", bg("surfaceCard"), rng("divider")),

            p(cls("text-sm leading-relaxed", tx("onSurfaceSub")), `"${item.quote}"`),

            div(
              cls("flex items-center gap-3 pt-5 border-t", bdr("divider")),
              div(
                cls("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold", `bg-gradient-to-br ${frm("avatarFrom")} ${too("avatarTo")}`),
                item.name.split(" ").map(n => n[0]).join("").slice(0, 2)
              ),
              div(
                cls("flex flex-col gap-0.5"),
                p(cls("text-xs font-semibold", tx("onSurface")), item.name),
                p(cls("text-[10px] font-medium", tx("onSurfaceFaint")), item.title)
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
    cls("py-24 md:py-32 px-6", bg("surface")),
    div(
      cls("max-w-6xl mx-auto"),

      div(
        cls("mb-16 text-center"),
        eyebrow && p(cls("text-xs font-semibold uppercase tracking-widest mb-3", tx("primary")), eyebrow),
        h2(cls("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")), headline),
        sub && p(cls("mt-4 text-sm", tx("onSurfaceMuted")), sub)
      ),

      div(
        cls("grid grid-cols-1 md:grid-cols-3 gap-5 items-start"),
        ...plans.map(plan =>
          div(
            cls(
              "flex flex-col rounded-3xl overflow-hidden",
              plan.highlighted
                ? `${bg("primaryBg")} text-white shadow-2xl shadow-indigo-500/30 scale-[1.02]`
                : `${bg("surfaceAlt")} shadow-sm shadow-black/5 ring-1 ${rng("divider")}`
            ),

            div(
              cls("p-8 pb-6"),
              p(cls("text-xs font-semibold uppercase tracking-widest mb-5", plan.highlighted ? "text-indigo-200" : tx("primary")), plan.name),
              div(
                cls("flex items-end gap-1.5 mb-3"),
                span(cls("text-5xl font-bold leading-none tracking-tight", plan.highlighted ? "text-white" : tx("onSurface")), plan.price),
                span(cls("text-sm font-medium mb-1", plan.highlighted ? "text-indigo-200" : tx("onSurfaceFaint")), plan.period || "/mo")
              ),
              plan.description && p(cls("text-xs leading-relaxed", plan.highlighted ? "text-indigo-100" : tx("onSurfaceMuted")), plan.description)
            ),

            div(
              cls("px-8 pb-8 flex-1"),
              ul(
                cls("flex flex-col gap-3 mb-8"),
                ...(plan.features || []).map(feature =>
                  li(
                    cls("flex items-start gap-3 text-sm"),
                    span(
                      cls("shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5",
                        plan.highlighted ? "bg-white/20 text-white" : `${bg("primaryTonal")} ${tx("primaryTonalText")}`),
                      "✓"
                    ),
                    span(cls(plan.highlighted ? "text-indigo-100" : tx("onSurfaceSub")), feature)
                  )
                )
              ),

              button(
                cls(
                  "w-full py-3 text-sm font-semibold transition-all rounded-full",
                  plan.highlighted
                    ? `${bg("surface")} ${tx("primary")} hover:bg-indigo-50 shadow-md`
                    : `${bg("primaryBg")} text-white hover:${bg("primaryBgHover").split(" ")[0]} shadow-md shadow-indigo-500/25`
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
    cls("py-24 md:py-32 px-6", bg("surface")),
    div(
      cls("max-w-2xl mx-auto"),

      div(
        cls("mb-12 text-center"),
        eyebrow && p(cls("text-xs font-semibold uppercase tracking-widest mb-3", tx("primary")), eyebrow),
        h2(cls("text-4xl md:text-5xl font-bold leading-tight tracking-tight", tx("onSurface")), headline)
      ),

      div(
        cls("flex flex-col gap-3"),
        ...items.map(item =>
          details(
            cls("group rounded-2xl overflow-hidden ring-1", bg("surfaceAlt"), rng("divider")),

            summary(
              cls(
                "flex items-center justify-between gap-4 p-5 cursor-pointer select-none list-none appearance-none [&::-webkit-details-marker]:hidden transition-colors",
                `hover:${bg("primarySubtle").split(" ")[0]}`
              ),
              span(cls("text-sm font-medium", tx("onSurface")), item.question),
              span(
                cls(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                  bg("primaryTonal"), tx("primaryTonalText"),
                  "group-open:rotate-45",
                  `group-open:${bg("primaryBg").split(" ")[0]} group-open:text-white`
                ),
                "+"
              )
            ),

            div(
              cls("px-5 pb-5"),
              p(cls("text-sm leading-relaxed", tx("onSurfaceMuted")), item.answer)
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
    cls("py-6 px-6", bg("primaryBand")),
    div(
      cls("max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6"),
      ...items.map(item =>
        div(
          cls("flex flex-col gap-1 px-6 py-8 text-center rounded-2xl bg-white/10"),
          span(cls("text-4xl md:text-5xl font-bold tabular-nums tracking-tight leading-none text-white"), item.value),
          span(cls("text-xs font-medium uppercase tracking-wider mt-2 text-indigo-200"), item.label)
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
    cls("py-20 px-6", `bg-gradient-to-br ${frm("primaryCta")} ${via("primaryCtaVia")} ${too("primaryCtaTo")}`),

    div(
      cls("max-w-4xl mx-auto text-center flex flex-col items-center gap-8"),

      div(
        cls("flex flex-col items-center gap-4"),
        h2(cls("text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white"), headline),
        sub && p(cls("text-base text-indigo-200 max-w-md leading-relaxed"), sub)
      ),

      div(
        cls("flex flex-wrap items-center justify-center gap-3"),

        button(
          cls("px-8 py-3.5 text-sm font-semibold transition-all rounded-full hover:-translate-y-0.5 bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl shadow-black/20"),
          primaryCta
        ),

        button(
          cls("px-8 py-3.5 text-sm font-semibold transition-all rounded-full hover:-translate-y-0.5 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm ring-1 ring-white/30"),
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
    cls(bg("footerBg"), tx("footerText")),
    div(
      cls("max-w-7xl mx-auto px-6 lg:px-10"),

      div(
        cls("grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-neutral-800"),

        div(
          cls("col-span-2 md:col-span-1"),
          p(cls("text-base font-semibold tracking-tight mb-3 text-white"), brand),
          p(cls("text-sm leading-relaxed max-w-xs", tx("footerMuted")), "Building the tools that move modern teams forward.")
        ),

        ...columns.map(col =>
          div(
            cls(""),
            h5(cls("text-xs font-semibold uppercase tracking-widest mb-5", tx("footerMuted")), col.title),
            ul(
              cls("flex flex-col gap-3"),
              ...col.links.map(link =>
                li(a(cls("text-sm font-medium transition-colors hover:text-white", tx("footerMuted")), link.label))
              )
            )
          )
        )
      ),

      div(
        cls("flex flex-col sm:flex-row items-center justify-between gap-4 py-6"),
        p(cls("text-xs font-medium", tx("footerFaint")), copyright || `© ${new Date().getFullYear()} ${brand}`),
        div(
          cls("flex gap-6"),
          a(cls("text-xs font-medium transition-colors hover:text-white", tx("footerFaint")), "Privacy"),
          a(cls("text-xs font-medium transition-colors hover:text-white", tx("footerFaint")), "Terms"),
          a(cls("text-xs font-medium transition-colors hover:text-white", tx("footerFaint")), "Cookies")
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
    sm: "px-4 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  }

  const variants = {
    primary:   `${bg("primaryBg")} text-white hover:${bg("primaryBgHover").split(" ")[0]} shadow-md shadow-indigo-500/25 hover:shadow-lg`,
    secondary: `${bg("primaryTonal")} ${tx("primaryTonalText")} hover:${bg("primaryTonalHover").split(" ")[0]}`,
    ghost:     `bg-transparent ${tx("primary")} hover:${bg("primarySubtle").split(" ")[0]}`,
    danger:    `${bg("dangerBgFilled")} text-white hover:${bg("dangerBgHover").split(" ")[0]} shadow-md shadow-red-500/25`,
    outline:   `bg-transparent ${tx("primary")} ring-1 ${rng("primaryRing")} hover:${bg("primarySubtle").split(" ")[0]}`,
  }

  return button(
    cls(
      "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-full",
      sizes[size], variants[variant],
      disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "cursor-pointer hover:-translate-y-px"
    ),
    icon && span(cls(""), icon),
    label
  )
}


// ─────────────────────────────────────────────
//  CARD
//  props: { title, body, footer, badge }
// ─────────────────────────────────────────────

function Card({ title = "", body = "", footer = null, badge = null }) {
  return article(
    cls("rounded-3xl overflow-hidden shadow-sm shadow-black/5 dark:shadow-black/20 ring-1", bg("surfaceCard"), rng("divider")),

    div(
      cls("p-6 flex flex-col gap-3"),
      badge && span(cls("inline-block px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full w-fit", bg("primaryTonal"), tx("primaryTonalText")), badge),
      title && h3(cls("text-base font-semibold tracking-tight", tx("onSurface")), title),
      body  && p(cls("text-sm leading-relaxed", tx("onSurfaceMuted")), body),
    ),

    footer && div(cls("px-6 pb-6 pt-4 border-t", bdr("divider")), footer)
  )
}


// ─────────────────────────────────────────────
//  BADGE
//  props: { label, variant }
// ─────────────────────────────────────────────

function Badge({ label = "", variant = "default" }) {
  const variants = {
    default: `${bg("surfaceAlt")} ${tx("onSurfaceMid")}`,
    success: `${bg("successBg")} ${tx("successText")}`,
    warning: `${bg("warningBg")} ${tx("warningText")}`,
    danger:  `${bg("dangerBg")}  ${tx("dangerText")}`,
    info:    `${bg("infoBg")}    ${tx("infoText")}`,
  }
  return span(
    cls(`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`),
    label
  )
}


// ─────────────────────────────────────────────
//  AVATAR
//  props: { name, size, status }
// ─────────────────────────────────────────────

function Avatar({ name = "User", size = "md", status = null }) {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm", xl: "w-16 h-16 text-base" }
  const statusColors = {
    online:  bg("success"),
    offline: bg("onSurfaceDisabled"),
    away:    bg("warning"),
  }
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()

  return div(
    cls("relative inline-flex shrink-0"),
    div(
      cls(`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white shadow-md shadow-indigo-500/20`, `bg-gradient-to-br ${frm("avatarFrom")} ${too("avatarTo")}`),
      initials
    ),
    status && span(cls(`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-neutral-900 ${statusColors[status]}`))
  )
}


// ─────────────────────────────────────────────
//  ALERT
//  props: { title, message, variant }
// ─────────────────────────────────────────────

function Alert({ title = "", message = "", variant = "info" }) {
  const styles = {
    info:    { wrap: `${bg("infoWrap")} ring-1 ${rng("infoRing")}`,       icon: `${bg("infoBg")} ${tx("info")}`,       label: tx("infoText"),    body: tx("info")    },
    success: { wrap: `${bg("successWrap")} ring-1 ${rng("successRing")}`, icon: `${bg("successBg")} ${tx("success")}`, label: tx("successText"), body: tx("success") },
    warning: { wrap: `${bg("warningWrap")} ring-1 ${rng("warningRing")}`, icon: `${bg("warningBg")} ${tx("warning")}`, label: tx("warningText"), body: tx("warning") },
    danger:  { wrap: `${bg("dangerWrap")} ring-1 ${rng("dangerRing")}`,   icon: `${bg("dangerBg")} ${tx("danger")}`,   label: tx("dangerText"),  body: tx("danger")  },
  }
  const icons = { info: "i", success: "✓", warning: "!", danger: "✕" }
  const s = styles[variant]

  return div(
    cls(`flex gap-4 p-4 rounded-2xl ${s.wrap}`),
    span(cls(`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${s.icon}`), icons[variant]),
    div(
      cls("flex flex-col gap-1"),
      title   && p(cls(`text-sm font-semibold ${s.label}`), title),
      message && p(cls(`text-xs leading-relaxed ${s.body}`), message)
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

    labelText && label(
      cls("text-xs font-semibold", tx("onSurfaceMid")),
      labelText
    ),

    input(
      cls(
        "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all",
        bg("surfaceInput"), tx("onSurface"), ph("onSurfaceFaint"),
        `focus:${bg("surfaceInputFocus").split(" ")[0]} focus:ring-2 focus:ring-indigo-500/40`,
        error ? `ring-2 ${rng("danger")} ${bg("dangerWrap").split(" ")[0]}` : ""
      ),
      { type, placeholder }
    ),

    error && span(cls("text-xs font-medium", tx("dangerText")), error),
    !error && hint && span(cls("text-xs", tx("onSurfaceFaint")), hint)
  )
}


// ─────────────────────────────────────────────
//  FORM GROUP
//  A fieldset wrapper that groups related inputs under a shared
//  legend, optional hint line, and an inline error summary.
//
//  props: {
//    legend   — string  : section label rendered as <legend>
//    hint     — string  : helper text shown below the legend
//    error    — string  : validation error shown at the bottom
//    children — array   : InputField / Toggle / Select nodes
//  }
// ─────────────────────────────────────────────

function FormGroup({ legend: legendText = "", hint = "", error = "", children = [] }) {
  return fieldset(
    cls("rounded-2xl ring-1 p-6 flex flex-col gap-5", bg("surfaceCard"), rng("divider")),

    // <legend> must be the first child of <fieldset> for correct rendering
    legendText && legend(
      cls("text-xs font-bold uppercase tracking-widest px-1 -mx-1 float-left w-full mb-1", tx("primary")),
      legendText
    ),

    hint && p(cls("text-xs leading-relaxed", tx("onSurfaceFaint")), hint),

    // field nodes
    ...children,

    // inline error summary
    error && div(
      cls(`flex items-start gap-2.5 mt-1 p-3 rounded-xl ring-1 ${bg("dangerWrap")} ${rng("dangerRing")}`),
      span(cls(`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-px ${bg("dangerBg")} ${tx("dangerText")}`), "!"),
      p(cls(`text-xs leading-relaxed ${tx("dangerText")}`), error)
    )
  )
}


// ─────────────────────────────────────────────
//  TABLE
//  props: { columns, rows }
// ─────────────────────────────────────────────

function Table({ columns = [], rows = [] }) {
  return div(
    cls("rounded-2xl overflow-hidden shadow-sm shadow-black/5 ring-1", bg("surface"), rng("dividerMid")),
    div(
      cls("overflow-x-auto"),
      table(
        cls("min-w-full"),

        thead(
          tr(
            cls("border-b", bg("surfaceAlt"), bdr("dividerMid")),
            ...columns.map(col =>
              th(cls("px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest", tx("onSurfaceFaint")), col.label)
            )
          )
        ),

        tbody(
          ...rows.map(row =>
            tr(
              cls("border-b last:border-b-0 transition-colors", bdr("divider"), `hover:${bg("primarySubtle").split(" ")[0]}`),
              ...columns.map(col =>
                td(cls("px-5 py-3.5 text-sm", tx("onSurfaceMid")), row[col.key] ?? "—")
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
    cls("flex gap-1 p-1 rounded-xl", bg("surfaceInput")),
    ...tabs.map((tab, i) =>
      button(
        cls(
          "flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all rounded-lg",
          i === activeIndex
            ? `${bg("surface")} ${tx("onSurface")} shadow-sm`
            : `${tx("onSurfaceFaint")} hover:${tx("onSurfaceMid").split(" ")[0]}`
        ),
        tab.icon && span(cls("text-sm"), tab.icon),
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
    cls("fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"),
    div(
      cls(`w-full ${sizes[size]} rounded-3xl overflow-hidden shadow-2xl shadow-black/20`, bg("surfaceCard")),

      div(
        cls("flex items-center justify-between px-6 py-4 border-t-0 border-b", bdr("divider")),
        h2(cls("text-sm font-semibold", tx("onSurface")), title),
        button(
          cls("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors", tx("onSurfaceFaint"), `hover:${bg("surfaceAlt").split(" ")[0]}`),
          "✕"
        )
      ),

      div(cls("px-6 py-5"), p(cls("text-sm leading-relaxed", tx("onSurfaceMuted")), body)),

      actions.length > 0 && div(
        cls("flex items-center justify-end gap-2 px-6 py-4 border-t", bdr("divider")),
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
    cls("p-6 flex flex-col gap-4 rounded-3xl shadow-sm shadow-black/5 dark:shadow-black/20 ring-1", bg("surfaceCard"), rng("divider")),

    div(
      cls("flex items-start justify-between"),
      div(
        cls("flex flex-col gap-1"),
        span(cls("text-xs font-medium", tx("onSurfaceFaint")), label),
        span(cls("text-4xl font-bold tabular-nums tracking-tight leading-none", tx("onSurface")), value)
      ),
      icon && div(cls("w-11 h-11 rounded-2xl flex items-center justify-center text-lg", bg("primaryTonal"), tx("primaryTonalText")), icon)
    ),

    delta && div(
      cls("flex items-center gap-2 pt-3 border-t", bdr("divider")),
      span(
        cls("text-xs font-semibold px-2 py-0.5 rounded-full",
          isPos ? `${bg("successBg")} ${tx("successText")}` : `${bg("dangerBg")} ${tx("dangerText")}`),
        delta
      ),
      span(cls("text-xs", tx("onSurfaceFaint")), "vs last period")
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
        "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all rounded-full shadow-sm shadow-black/8 hover:shadow-md ring-1",
        bg("surface"), tx("onSurfaceMid"), rng("dividerMid"), `hover:${bg("surfaceAlt").split(" ")[0]}`
      ),
      trigger, span(cls("text-xs opacity-50"), "▾")
    ),
    div(
      cls(
        "absolute right-0 mt-2 min-w-48 rounded-2xl overflow-hidden z-50 py-1.5",
        "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
        "translate-y-1 group-hover:translate-y-0 transition-all duration-150",
        bg("surface"),
        "shadow-xl shadow-black/10 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/10"
      ),
      ul(
        cls(""),
        ...items.map(item =>
          item.divider
            ? li(cls("border-t my-1", bdr("divider")))
            : li(
                a(
                  cls(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                    tx("onSurfaceMid"),
                    `hover:${bg("primarySubtle").split(" ")[0]} hover:${tx("primary").split(" ")[0]}`
                  ),
                  item.icon && span(cls("text-base"), item.icon),
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
    cls("flex items-center gap-1.5"),
    ...items.map((item, i) =>
      div(
        cls("flex items-center gap-1.5"),
        i > 0 && span(cls("text-xs", tx("onSurfaceDisabled")), "/"),
        i < items.length - 1
          ? a(cls("text-xs font-medium transition-colors", tx("onSurfaceMuted"), `hover:${tx("onSurface").split(" ")[0]}`), item.label)
          : span(cls("text-xs font-semibold", tx("onSurface")), item.label)
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
      cls("relative w-11 h-6 rounded-full transition-colors duration-200", checked ? bg("primaryBg") : bg("dividerMid")),
      span(cls("absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200", checked ? "translate-x-[22px]" : "translate-x-1"))
    ),
    labelText && span(cls("text-sm font-medium", tx("onSurfaceMid")), labelText)
  )
}


// ─────────────────────────────────────────────
//  SKELETON
//  props: { lines, hasAvatar }
// ─────────────────────────────────────────────

function Skeleton({ lines = 3, hasAvatar = false }) {
  return div(
    cls("flex gap-4 p-4"),
    hasAvatar && div(cls("w-10 h-10 shrink-0 animate-pulse rounded-full", bg("dividerMid"))),
    div(
      cls("flex-1 flex flex-col gap-3 py-1"),
      ...Array.from({ length: lines }, (_, i) =>
        div(cls(`h-3 rounded-full animate-pulse ${bg("dividerMid")} ${i === lines - 1 ? "w-3/5" : i === 0 ? "w-full" : "w-4/5"}`))
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
    default: bg("primaryBg"),
    success: bg("success"),
    warning: bg("warning"),
    danger:  bg("danger"),
  }
  return div(
    cls("flex flex-col gap-2"),
    (label || value !== undefined) && div(
      cls("flex items-center justify-between"),
      label && span(cls("text-xs font-medium", tx("onSurfaceMid")), label),
      span(cls("text-xs font-semibold", tx("onSurfaceFaint")), `${pct}%`)
    ),
    div(
      cls("w-full h-2 rounded-full", bg("divider")),
      div(cls(`h-full rounded-full transition-all duration-500 ${fills[variant]}`), { style: `width: ${pct}%` })
    )
  )
}


// ═══════════════════════════════════════════════════════════
//  EXAMPLE USAGE
// ═══════════════════════════════════════════════════════════

/*

const page =
  div(cls("min-h-screen", bg("surface")),

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

    // FormGroup example
    div(cls("max-w-lg mx-auto py-16 px-6"),
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

    // To retheme the whole library, just change PALETTE above, e.g.:
    //   primaryBg:  ["violet-600", "violet-500"],
    //   primaryBgHover: ["violet-500", "violet-400"],
    //   ...etc.

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
  // Palette & token helpers (re-export so consumers can extend or fork)
  PALETTE, T, bg, tx, bdr, rng, shd, frm, too, via, ph, divide,

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