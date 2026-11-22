"use client";

import { memo, useMemo, type CSSProperties, type ReactNode } from "react";
import {
  ArrowRight,
  Atom,
  BrainCircuit,
  ChartSpline,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Crown,
  Hexagon,
  LayoutDashboard,
  Plug,
  Quote,
  ShieldCheck,
  Star,
  Sun,
  Triangle,
  Users,
  Wallet,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { TX, brandGradient, eyebrow, numeric, previewVars, textGradient, type, type ScreenProps } from "../kit";
import { Avatar, Badge, BrandMark, Button, Card, IconTile, STROKE, Segmented, Sparkline, cx } from "../parts";

const NAV_LINKS: { label: string; menu?: boolean }[] = [
  { label: "Product", menu: true },
  { label: "Solutions", menu: true },
  { label: "Customers" },
  { label: "Pricing" },
  { label: "Docs" },
];

const LOGOS: { icon: LucideIcon; name: string; style: CSSProperties }[] = [
  { icon: Wind, name: "Northwind", style: type("lg", "bold", "display") },
  {
    icon: Triangle,
    name: "VERTEX",
    style: { ...type("sm", "semibold", "display"), letterSpacing: "var(--pv-ls-widest)" },
  },
  { icon: Sun, name: "helios", style: type("xl", "semibold", "display") },
  { icon: Atom, name: "Quantum", style: type("lg", "medium", "display") },
  {
    icon: Crown,
    name: "Monarch",
    style: { ...type("lg", "extrabold", "display"), letterSpacing: "var(--pv-ls-tighter)" },
  },
  { icon: Hexagon, name: "lattice", style: type("lg", "bold", "mono") },
];

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ChartSpline,
    title: "Live revenue model",
    body: "Billing, product usage and CRM data stitched into one model that refreshes every minute.",
  },
  {
    icon: BrainCircuit,
    title: "Predictive forecasts",
    body: "Forecasts with confidence bands and plain-language drivers you can defend to the board.",
  },
  {
    icon: Users,
    title: "Cohort analysis",
    body: "Slice retention by plan, region or channel in two clicks instead of two days.",
  },
  {
    icon: Zap,
    title: "Instant alerts",
    body: "Hear about churn, failed payments or expansion the moment they drift off trend.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    body: "SOC 2 Type II, SSO, SCIM and granular roles. Your data never trains anything.",
  },
  {
    icon: Plug,
    title: "120+ integrations",
    body: "Stripe, Salesforce, HubSpot, Snowflake and the rest of your stack, connected in minutes.",
  },
];

const STATS = [
  { value: "11 days", label: "earlier churn detection" },
  { value: "38%", label: "faster month-end close" },
  { value: "3.2×", label: "return in the first year" },
];

const TIERS: {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  features: string[];
  featured?: boolean;
}[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "free forever",
    blurb: "For founders validating their first revenue.",
    cta: "Start for free",
    features: ["Up to 1,000 customers", "Core revenue dashboards", "Daily data refresh", "Community support"],
  },
  {
    name: "Growth",
    price: "$49",
    cadence: "per month",
    blurb: "For teams that run the business on metrics.",
    cta: "Start free trial",
    featured: true,
    features: [
      "Up to 25,000 customers",
      "Forecasts and cohorts",
      "Real-time sync",
      "Slack and email alerts",
      "Priority support",
    ],
  },
  {
    name: "Scale",
    price: "$199",
    cadence: "per month",
    blurb: "For finance teams with complex billing.",
    cta: "Talk to sales",
    features: ["Unlimited customers", "Multi-entity and FX", "SSO, SCIM and audit log", "Dedicated success manager"],
  },
];

const FOOTER: { title: string; links: string[] }[] = [
  { title: "Product", links: ["Overview", "Forecasts", "Cohorts", "Integrations", "Changelog"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Press"] },
  { title: "Resources", links: ["Documentation", "Guides", "API reference", "Status"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "DPA"] },
];

const BARS = [42, 56, 48, 64, 58, 72, 88];
const MINI_NAV: { icon: LucideIcon; label: string }[] = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: ChartSpline, label: "Forecasts" },
  { icon: Users, label: "Customers" },
  { icon: Wallet, label: "Revenue" },
];

function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-[1120px] px-[var(--pv-sp-10)]", className)}>{children}</div>;
}

function SectionHeading({ kicker, title, body }: { kicker: string; title: ReactNode; body?: string }) {
  return (
    <div className="mx-auto flex max-w-[620px] flex-col items-center text-center">
      <span style={eyebrow("primary")}>{kicker}</span>
      <h2 className="mt-3 [text-wrap:balance]" style={type("4xl", "bold", "display")}>
        {title}
      </h2>
      {body && (
        <p
          className="mt-4 text-[var(--pv-text-2)] [text-wrap:pretty]"
          style={{ ...type("lg"), lineHeight: "var(--pv-lh-relaxed)" }}
        >
          {body}
        </p>
      )}
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--pv-border)] bg-[color-mix(in_srgb,var(--pv-bg)_78%,transparent)] backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-10">
        <div className="flex items-center gap-2.5">
          <BrandMark size={28} />
          <span style={type("lg", "bold", "display")}>Lumen</span>
        </div>
        <nav aria-label="Site" className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <span
              key={link.label}
              className={cx(
                "inline-flex h-8 items-center gap-1 rounded-[var(--pv-r-md)] px-3 text-[var(--pv-text-2)] hover:bg-[var(--pv-hover)] hover:text-[var(--pv-text)]",
                TX,
              )}
              style={type("sm", "medium")}
            >
              {link.label}
              {link.menu && <ChevronDown size={14} strokeWidth={STROKE} aria-hidden className="opacity-60" />}
            </span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost">Sign in</Button>
          <Button variant="primary" iconRight={ArrowRight}>
            Get started
          </Button>
        </div>
      </Container>
    </header>
  );
}

function ProductShot() {
  return (
    <div className="relative mx-auto mt-[var(--pv-sp-16)] w-full max-w-[940px] text-left">
      <div
        aria-hidden
        className="absolute -inset-x-16 -top-12 bottom-10 opacity-90 blur-3xl"
        style={{
          backgroundImage:
            "radial-gradient(50% 60% at 30% 50%, var(--pv-glow-1), transparent 70%), radial-gradient(45% 60% at 75% 40%, var(--pv-glow-2), transparent 70%)",
        }}
      />
      <div className="relative [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <div className="rounded-[var(--pv-r-2xl)] border border-[var(--pv-border)] bg-[color-mix(in_srgb,var(--pv-surface)_72%,transparent)] p-2 shadow-[var(--pv-sh-2xl)] backdrop-blur">
          <div className="grid h-[360px] grid-cols-[184px_minmax(0,1fr)] overflow-hidden rounded-[var(--pv-r-xl)] border border-[var(--pv-border)] bg-[var(--pv-bg)]">
            <aside className="flex flex-col gap-1 border-r border-[var(--pv-border)] bg-[var(--pv-surface)] p-3">
              <div className="mb-3 flex items-center gap-2 px-1.5 pt-1">
                <BrandMark size={22} />
                <span style={type("sm", "semibold", "display")}>Lumen</span>
              </div>
              {MINI_NAV.map(({ icon: Icon, label }, i) => (
                <span
                  key={label}
                  className={cx(
                    "flex h-8 items-center gap-2 rounded-[var(--pv-r-md)] px-2",
                    i === 0 ? "bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)]" : "text-[var(--pv-text-2)]",
                  )}
                  style={type("xs", i === 0 ? "semibold" : "medium")}
                >
                  <Icon size={14} strokeWidth={STROKE} aria-hidden />
                  {label}
                </span>
              ))}
              <div className="mt-auto rounded-[var(--pv-r-lg)] border border-[var(--pv-border)] bg-[var(--pv-bg)] p-2.5">
                <p className="text-[var(--pv-text-3)]" style={type("xs")}>
                  Forecast accuracy
                </p>
                <p style={{ ...type("lg", "semibold", "display"), ...numeric }}>97.4%</p>
              </div>
            </aside>
            <div className="flex min-w-0 flex-col gap-3 p-4">
              <div className="flex items-center justify-between">
                <span style={type("sm", "semibold", "display")}>Revenue overview</span>
                <Segmented size="sm" options={["Q3", "Q4", "FY"]} value="Q4" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "MRR", value: "$236.8k", delta: "+12.4%" },
                  { label: "Net retention", value: "118%", delta: "+3.1 pt" },
                  { label: "Forecast, Q1", value: "$781k", delta: "+9.8%" },
                ].map((kpi) => (
                  <Card key={kpi.label} className="p-3">
                    <p className="text-[var(--pv-text-3)]" style={type("xs", "medium")}>
                      {kpi.label}
                    </p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <span style={{ ...type("xl", "semibold", "display"), ...numeric }}>{kpi.value}</span>
                      <span className="text-[var(--pv-success-text)]" style={type("xs", "semibold", "mono")}>
                        {kpi.delta}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-3">
                <Card className="flex min-h-0 flex-col p-3">
                  <div className="flex items-center justify-between" style={type("xs", "medium")}>
                    <span className="text-[var(--pv-text-2)]">Recurring revenue</span>
                    <span className="inline-flex items-center gap-1.5 text-[var(--pv-text-3)]">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-[var(--pv-success)] animate-[pv-pulse_2s_var(--pv-ease-in-out)_infinite]"
                      />
                      Live
                    </span>
                  </div>
                  <Sparkline
                    data={[38, 41, 40, 46, 49, 47, 55, 58, 57, 63, 69, 72, 78]}
                    domain={[10, 84]}
                    className="mt-2 min-h-0 w-full flex-1"
                  />
                </Card>
                <Card className="flex min-h-0 flex-col p-3">
                  <span className="text-[var(--pv-text-2)]" style={type("xs", "medium")}>
                    New customers
                  </span>
                  <div className="mt-3 flex min-h-0 flex-1 items-end gap-1.5">
                    {BARS.map((h, i) => (
                      <span
                        key={i}
                        className={cx(
                          "flex-1 origin-bottom rounded-t-[var(--pv-r-sm)] animate-[pv-grow-y_var(--pv-dur-slower)_var(--pv-ease)_both]",
                          i === BARS.length - 1
                            ? "bg-[var(--pv-series-1)]"
                            : "bg-[color-mix(in_srgb,var(--pv-series-1)_28%,transparent)]",
                        )}
                        style={{ height: `${h}%`, animationDelay: `${i * 40}ms` }}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--pv-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--pv-grid) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/3 blur-3xl"
        style={{ backgroundImage: "radial-gradient(closest-side, var(--pv-glow-1), transparent)" }}
      />
      <Container className="relative flex flex-col items-center pt-[var(--pv-sp-20)] text-center">
        <span
          className={cx(
            "inline-flex h-8 items-center gap-2 rounded-[var(--pv-r-full)] border border-[var(--pv-border)] bg-[var(--pv-surface)] py-1 pl-1 pr-3 shadow-[var(--pv-sh-xs)] hover:border-[var(--pv-text-3)]",
            TX,
          )}
          style={type("sm", "medium")}
        >
          <Badge tone="primary">New</Badge>
          <span className="text-[var(--pv-text-2)]">Forecasts that explain themselves</span>
          <ChevronRight size={14} strokeWidth={STROKE} aria-hidden className="text-[var(--pv-text-3)]" />
        </span>

        <h1
          className="mt-7 max-w-[820px] [text-wrap:balance]"
          style={{
            ...type("6xl", "extrabold", "display"),
            fontSize: "min(calc(var(--pv-fs-6xl) * 1.25), 80px)",
            lineHeight: "var(--pv-lh-tight)",
            letterSpacing: "calc((var(--pv-ls-tight) + var(--pv-ls-tighter)) / 2)",
          }}
        >
          Revenue analytics that <span style={textGradient}>thinks ahead</span>
        </h1>

        <p
          className="mt-6 max-w-[560px] text-[var(--pv-text-2)] [text-wrap:pretty]"
          style={{ ...type("lg"), lineHeight: "var(--pv-lh-relaxed)" }}
        >
          Lumen turns billing, product and CRM data into one live model of your business, then tells you what is about
          to change and why.
        </p>

        <div className="mt-9 flex items-center gap-3">
          <Button variant="primary" size="lg" iconRight={ArrowRight} className="px-5">
            Start free trial
          </Button>
          <Button variant="secondary" size="lg" icon={CirclePlay} className="px-5">
            Watch the demo
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-5 text-[var(--pv-text-3)]" style={type("xs", "medium")}>
          {["14-day free trial", "No credit card required", "SOC 2 Type II"].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <Check size={13} strokeWidth={2.25} aria-hidden className="text-[var(--pv-primary-text)]" />
              {item}
            </span>
          ))}
        </div>

        <ProductShot />
      </Container>
    </section>
  );
}

function LogoCloud() {
  return (
    <Container className="pb-[var(--pv-sp-20)] pt-[var(--pv-sp-6)]">
      <p className="text-center text-[var(--pv-text-3)]" style={type("sm", "medium")}>
        Trusted by 4,000+ finance and growth teams
      </p>
      <div className="mt-8 flex items-center justify-between gap-6 text-[var(--pv-text-3)]">
        {LOGOS.map(({ icon: Icon, name, style }) => (
          <span
            key={name}
            className={cx("inline-flex items-center gap-2 opacity-80 hover:opacity-100", TX)}
            style={style}
          >
            <Icon size={20} strokeWidth={2} aria-hidden />
            {name}
          </span>
        ))}
      </div>
    </Container>
  );
}

function Features() {
  return (
    <section className="border-t border-[var(--pv-border)] bg-[var(--pv-surface)] py-[var(--pv-sp-24)]">
      <Container>
        <SectionHeading
          kicker="Platform"
          title="Everything you need to grow revenue with confidence"
          body="One workspace for the metrics your board asks about and the signals your team acts on."
        />
        <div className="mt-[var(--pv-sp-16)] grid grid-cols-3 gap-px overflow-hidden rounded-[var(--pv-r-2xl)] border border-[var(--pv-border)] bg-[var(--pv-border)]">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={cx(
                "group flex flex-col bg-[var(--pv-bg)] p-[var(--pv-sp-8)] hover:bg-[var(--pv-surface)]",
                TX,
              )}
            >
              <IconTile icon={feature.icon} size={40} />
              <h3 className="mt-5" style={type("lg", "semibold", "display")}>
                {feature.title}
              </h3>
              <p className="mt-2 text-[var(--pv-text-2)]" style={{ ...type("sm"), lineHeight: "var(--pv-lh-relaxed)" }}>
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="py-[var(--pv-sp-24)]">
      <Container>
        <Card className="relative grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] overflow-hidden rounded-[var(--pv-r-3xl)] shadow-[var(--pv-sh-lg)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full blur-3xl"
            style={{ backgroundImage: "radial-gradient(closest-side, var(--pv-glow-1), transparent)" }}
          />
          <figure className="relative p-[var(--pv-sp-12)]">
            <Quote size={32} strokeWidth={1.5} aria-hidden className="text-[var(--pv-primary-text)]" />
            <blockquote
              className="mt-6 [text-wrap:pretty]"
              style={{ ...type("2xl", "medium", "display"), lineHeight: "var(--pv-lh-snug)" }}
            >
              “Lumen replaced three dashboards and a weekly spreadsheet ritual. We caught a churn spike eleven days
              before it reached revenue.”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <Avatar name="Priya Raman" tone="accent" size={44} text="sm" />
              <div>
                <p style={type("sm", "semibold")}>Priya Raman</p>
                <p className="text-[var(--pv-text-3)]" style={type("xs")}>
                  VP Finance, Northwind
                </p>
              </div>
              <span className="ml-auto flex gap-0.5 text-[var(--pv-warning)]" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={15} strokeWidth={0} fill="currentColor" aria-hidden />
                ))}
              </span>
            </figcaption>
          </figure>
          <div className="relative flex flex-col justify-center divide-y divide-[var(--pv-border)] border-l border-[var(--pv-border)] bg-[var(--pv-bg)] px-[var(--pv-sp-10)]">
            {STATS.map((stat) => (
              <div key={stat.label} className="py-[var(--pv-sp-6)]">
                <p style={{ ...type("4xl", "bold", "display"), ...textGradient, ...numeric }}>{stat.value}</p>
                <p className="mt-1 text-[var(--pv-text-2)]" style={type("sm")}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </Container>
    </section>
  );
}

function PricingCard({ tier }: { tier: (typeof TIERS)[number] }) {
  const body = (
    <div
      className={cx(
        "relative flex h-full flex-col p-[var(--pv-sp-8)]",
        tier.featured ? "rounded-[calc(var(--pv-r-2xl)-1px)] bg-[var(--pv-surface)]" : "",
      )}
      style={
        tier.featured
          ? { backgroundImage: "radial-gradient(120% 60% at 50% 0%, var(--pv-glow-1), transparent 70%)" }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <h3 style={type("lg", "semibold", "display")}>{tier.name}</h3>
        {tier.featured && (
          <span
            className="inline-flex h-6 items-center rounded-[var(--pv-r-full)] px-2.5 text-[var(--pv-on-brand)] shadow-[var(--pv-sh-sm)]"
            style={{ ...type("xs", "semibold"), backgroundImage: brandGradient(90) }}
          >
            Most popular
          </span>
        )}
      </div>
      <p className="mt-2 text-[var(--pv-text-2)]" style={type("sm")}>
        {tier.blurb}
      </p>
      <div className="mt-6 flex items-baseline gap-1.5">
        <span style={{ ...type("5xl", "bold", "display"), ...numeric }}>{tier.price}</span>
        <span className="text-[var(--pv-text-3)]" style={type("sm")}>
          {tier.cadence}
        </span>
      </div>
      <Button variant={tier.featured ? "primary" : "secondary"} size="lg" className="mt-6 w-full">
        {tier.cta}
      </Button>
      <ul className="mt-8 flex flex-col gap-3 border-t border-[var(--pv-border)] pt-6">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-[var(--pv-text-2)]" style={type("sm")}>
            <span
              aria-hidden
              className={cx(
                "inline-flex size-[18px] shrink-0 items-center justify-center rounded-[var(--pv-r-full)]",
                tier.featured
                  ? "bg-[var(--pv-primary)] text-[var(--pv-on-primary)]"
                  : "bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)]",
              )}
            >
              <Check size={11} strokeWidth={3} />
            </span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );

  if (tier.featured) {
    return (
      <div
        className="relative -my-3 rounded-[var(--pv-r-2xl)] p-px shadow-[var(--pv-sh-xl)]"
        style={{ backgroundImage: brandGradient(160) }}
      >
        {body}
      </div>
    );
  }
  return <Card className="rounded-[var(--pv-r-2xl)]">{body}</Card>;
}

function Pricing() {
  return (
    <section className="border-t border-[var(--pv-border)] py-[var(--pv-sp-24)]">
      <Container>
        <SectionHeading
          kicker="Pricing"
          title="Simple pricing that scales with you"
          body="Start free, upgrade when your revenue does. Every plan includes unlimited seats."
        />
        <div className="mt-8 flex items-center justify-center gap-3">
          <Segmented options={["Monthly", "Yearly"]} value="Monthly" />
          <Badge tone="success">Save 20% yearly</Badge>
        </div>
        <div className="mt-[var(--pv-sp-12)] grid grid-cols-3 items-stretch gap-[var(--pv-sp-6)]">
          {TIERS.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CallToAction() {
  return (
    <Container className="pb-[var(--pv-sp-24)]">
      <div
        className="relative flex items-center justify-between gap-8 overflow-hidden rounded-[var(--pv-r-3xl)] px-[var(--pv-sp-12)] py-[var(--pv-sp-12)] text-[var(--pv-on-brand)] shadow-[var(--pv-sh-xl)]"
        style={{ backgroundImage: brandGradient(120) }}
      >
        <span aria-hidden className="absolute -right-20 -top-28 size-80 rounded-full bg-white/10" />
        <span aria-hidden className="absolute -bottom-32 right-40 size-64 rounded-full bg-white/[0.06]" />
        <div className="relative max-w-[520px]">
          <h2 style={type("3xl", "bold", "display")}>See next quarter before it happens</h2>
          <p className="mt-3 opacity-85" style={{ ...type("base"), lineHeight: "var(--pv-lh-relaxed)" }}>
            Connect Stripe in two minutes and get your first forecast before your coffee cools.
          </p>
        </div>
        <div className="relative flex shrink-0 items-center gap-3">
          <span
            className="inline-flex h-11 items-center gap-2 rounded-[var(--pv-r-lg)] bg-[var(--pv-on-brand)] px-5 text-[var(--pv-brand-from)] shadow-[var(--pv-sh-md)]"
            style={type("sm", "semibold")}
          >
            Start free trial
            <ArrowRight size={16} strokeWidth={2} aria-hidden />
          </span>
          <span
            className="inline-flex h-11 items-center rounded-[var(--pv-r-lg)] px-5 shadow-[inset_0_0_0_1px_currentColor] opacity-90"
            style={type("sm", "semibold")}
          >
            Talk to sales
          </span>
        </div>
      </div>
    </Container>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <Container className="grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-8 py-[var(--pv-sp-16)]">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark size={26} />
            <span style={type("base", "bold", "display")}>Lumen</span>
          </div>
          <p
            className="mt-4 max-w-[240px] text-[var(--pv-text-2)]"
            style={{ ...type("sm"), lineHeight: "var(--pv-lh-relaxed)" }}
          >
            Revenue intelligence for teams who would rather know than guess.
          </p>
          <span
            className="mt-6 inline-flex h-7 items-center gap-2 rounded-[var(--pv-r-full)] border border-[var(--pv-border)] px-2.5 text-[var(--pv-text-2)]"
            style={type("xs", "medium")}
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-[var(--pv-success)] shadow-[0_0_0_3px_var(--pv-success-soft)]"
            />
            All systems operational
          </span>
        </div>
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p style={type("sm", "semibold")}>{col.title}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li
                  key={link}
                  className={cx("flex items-center gap-2 text-[var(--pv-text-2)] hover:text-[var(--pv-text)]", TX)}
                  style={type("sm")}
                >
                  {link}
                  {link === "Careers" && <Badge tone="primary">Hiring</Badge>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="flex items-center justify-between border-t border-[var(--pv-border)] py-6 text-[var(--pv-text-3)]">
        <span style={type("xs")}>© 2026 Lumen Labs, Inc. All rights reserved.</span>
        <span style={type("xs")}>Made for people who read the footer.</span>
      </Container>
    </footer>
  );
}

const LandingScreen = memo(function LandingScreen({ theme, dark }: ScreenProps) {
  const vars = useMemo(() => previewVars(theme, dark), [theme, dark]);

  return (
    <div className="preview-scroll h-full min-w-[960px] overflow-y-auto" style={vars}>
      <SiteHeader />
      <main className="animate-[pv-rise_var(--pv-dur-slower)_var(--pv-ease)_both]">
        <Hero />
        <LogoCloud />
        <Features />
        <Testimonial />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
});

export default LandingScreen;
