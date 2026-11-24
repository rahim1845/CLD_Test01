"use client";

import { memo, useMemo, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bell,
  Blocks,
  Calendar,
  ChartColumn,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  CircleDollarSign,
  CircleHelp,
  Command,
  Download,
  Ellipsis,
  Inbox,
  LayoutDashboard,
  ListFilter,
  Plus,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  UserMinus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { TX, areaPath, numeric, previewVars, smoothPath, toPoints, type, type ScreenProps, type Tone } from "../kit";
import {
  Avatar,
  Badge,
  BrandMark,
  Button,
  Card,
  Checkbox,
  Kbd,
  Progress,
  STROKE,
  Segmented,
  Sparkline,
  cx,
  useSvgId,
} from "../parts";

interface NavEntry {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  count?: string;
  badge?: string;
}

const NAV: NavEntry[] = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: ChartColumn, label: "Analytics" },
  { icon: Users, label: "Customers", count: "2.4k" },
  { icon: Wallet, label: "Revenue" },
  { icon: Inbox, label: "Inbox", badge: "4" },
];

const WORKSPACE_NAV: NavEntry[] = [
  { icon: Blocks, label: "Integrations" },
  { icon: Settings, label: "Settings" },
];

const FAVORITES = [
  { label: "Q4 board metrics", dot: "bg-[var(--pv-series-1)]" },
  { label: "Churn cohorts", dot: "bg-[var(--pv-series-2)]" },
];

const KPIS: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  good: boolean;
  icon: LucideIcon;
  data: number[];
}[] = [
  {
    label: "Net revenue",
    value: "$2.84M",
    delta: "18.2%",
    up: true,
    good: true,
    icon: CircleDollarSign,
    data: [182, 196, 188, 214, 229, 221, 246, 262, 255, 279, 296, 284],
  },
  {
    label: "Subscribers",
    value: "12,847",
    delta: "9.4%",
    up: true,
    good: true,
    icon: Users,
    data: [9.8, 10.1, 10.4, 10.3, 10.9, 11.2, 11.4, 11.9, 12.1, 12.3, 12.6, 12.8],
  },
  {
    label: "Churn rate",
    value: "2.14%",
    delta: "0.32 pt",
    up: false,
    good: true,
    icon: UserMinus,
    data: [3.1, 2.9, 3.0, 2.8, 2.7, 2.75, 2.5, 2.45, 2.3, 2.35, 2.2, 2.14],
  },
  {
    label: "ARPU",
    value: "$42.80",
    delta: "1.2%",
    up: false,
    good: false,
    icon: ChartColumn,
    data: [44.1, 43.8, 44.4, 43.9, 43.2, 43.6, 43.1, 42.7, 43.3, 42.9, 43.1, 42.8],
  },
];

const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const THIS_YEAR = [182, 196, 188, 214, 229, 221, 246, 262, 255, 279, 296, 284];
const LAST_YEAR = [148, 156, 161, 166, 172, 180, 186, 195, 204, 211, 219, 228];
const Y_MAX = 320;
const Y_TICKS = [320, 240, 160, 80, 0];
const FOCUS = 10;

const PLAN_MIX = [
  { label: "Enterprise", value: "$1.31M", pct: 46, stroke: "var(--pv-series-1)", swatch: "bg-[var(--pv-series-1)]" },
  { label: "Growth", value: "$880k", pct: 31, stroke: "var(--pv-series-2)", swatch: "bg-[var(--pv-series-2)]" },
  { label: "Starter", value: "$426k", pct: 15, stroke: "var(--pv-series-3)", swatch: "bg-[var(--pv-series-3)]" },
  { label: "Add-ons", value: "$227k", pct: 8, stroke: "var(--pv-series-4)", swatch: "bg-[var(--pv-series-4)]" },
];

const DONUT_RADIUS = 42;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_GAP = 1.6;

const DONUT_SEGMENTS = PLAN_MIX.map((slice, i) => {
  const start = PLAN_MIX.slice(0, i).reduce((sum, s) => sum + s.pct, 0);
  const length = (slice.pct / 100) * DONUT_CIRCUMFERENCE;
  return {
    ...slice,
    dashArray: `${Math.max(0, length - DONUT_GAP)} ${DONUT_CIRCUMFERENCE}`,
    dashOffset: -(start / 100) * DONUT_CIRCUMFERENCE,
  };
});

type Status = "Paid" | "Pending" | "Failed" | "Refunded";

const STATUS_TONE: Record<Status, Tone> = {
  Paid: "success",
  Pending: "warning",
  Failed: "error",
  Refunded: "neutral",
};

const TRANSACTIONS: {
  name: string;
  email: string;
  tone: Tone;
  plan: string;
  amount: string;
  status: Status;
  date: string;
  selected?: boolean;
}[] = [
  {
    name: "Olivia Martin",
    email: "olivia@northwind.io",
    tone: "primary",
    plan: "Enterprise",
    amount: "$4,200.00",
    status: "Paid",
    date: "Nov 21, 09:42",
  },
  {
    name: "Jackson Lee",
    email: "jackson@vertexlabs.com",
    tone: "accent",
    plan: "Growth",
    amount: "$890.00",
    status: "Pending",
    date: "Nov 21, 08:15",
    selected: true,
  },
  {
    name: "Isabella Nguyen",
    email: "isabella@helios.co",
    tone: "info",
    plan: "Starter",
    amount: "$49.00",
    status: "Paid",
    date: "Nov 20, 22:07",
  },
  {
    name: "William Kim",
    email: "will@quantumhq.com",
    tone: "warning",
    plan: "Growth",
    amount: "$890.00",
    status: "Failed",
    date: "Nov 20, 17:31",
  },
  {
    name: "Sofia Davis",
    email: "sofia@monarch.app",
    tone: "success",
    plan: "Enterprise",
    amount: "$2,450.00",
    status: "Refunded",
    date: "Nov 20, 11:58",
  },
  {
    name: "Ethan Brooks",
    email: "ethan@lattice.dev",
    tone: "neutral",
    plan: "Growth",
    amount: "$1,290.00",
    status: "Paid",
    date: "Nov 19, 16:20",
  },
];

function NavItem({ icon: Icon, label, active, count, badge }: NavEntry) {
  return (
    <div
      className={cx(
        "group flex h-8 items-center gap-2.5 rounded-[var(--pv-r-md)] px-2.5",
        TX,
        active
          ? "bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)]"
          : "text-[var(--pv-text-2)] hover:bg-[var(--pv-hover)] hover:text-[var(--pv-text)]",
      )}
      style={type("sm", active ? "semibold" : "medium")}
    >
      <Icon
        size={16}
        strokeWidth={STROKE}
        aria-hidden
        className={cx("shrink-0", !active && "text-[var(--pv-text-3)] group-hover:text-[var(--pv-text-2)]")}
      />
      <span className="flex-1 truncate">{label}</span>
      {count && (
        <span className="text-[var(--pv-text-3)]" style={type("xs", "medium", "mono")}>
          {count}
        </span>
      )}
      {badge && (
        <span
          className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[var(--pv-r-full)] bg-[var(--pv-primary)] px-1 text-[var(--pv-on-primary)]"
          style={{ ...type("xs", "semibold"), lineHeight: 1 }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function NavGroup({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-px">
      {label && (
        <p className="px-2.5 pb-1.5 text-[var(--pv-text-3)]" style={type("xs", "medium")}>
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex w-[232px] shrink-0 flex-col border-r border-[var(--pv-border)] bg-[var(--pv-surface)]">
      <div className="p-3 pb-2">
        <div className={cx("flex items-center gap-2.5 rounded-[var(--pv-r-lg)] p-1.5 hover:bg-[var(--pv-hover)]", TX)}>
          <BrandMark size={30} />
          <div className="min-w-0 flex-1">
            <p className="truncate" style={type("sm", "semibold", "display")}>
              Lumen
            </p>
            <p className="truncate text-[var(--pv-text-3)]" style={type("xs")}>
              Acme Inc · Pro plan
            </p>
          </div>
          <ChevronsUpDown size={14} strokeWidth={STROKE} aria-hidden className="shrink-0 text-[var(--pv-text-3)]" />
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="flex h-8 items-center gap-2 rounded-[var(--pv-r-lg)] border border-[var(--pv-border)] bg-[var(--pv-bg)] pl-2.5 pr-1.5 text-[var(--pv-text-3)]">
          <Search size={14} strokeWidth={STROKE} aria-hidden className="shrink-0" />
          <span className="flex-1 truncate" style={type("sm")}>
            Search
          </span>
          <Kbd className="gap-0.5">
            <Command size={10} strokeWidth={2} aria-hidden />K
          </Kbd>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4 pt-1 [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,black_calc(100%-16px),transparent)]"
      >
        <NavGroup>
          {NAV.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </NavGroup>
        <NavGroup label="Workspace">
          {WORKSPACE_NAV.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </NavGroup>
        <NavGroup label="Favorites">
          {FAVORITES.map((fav) => (
            <div
              key={fav.label}
              className={cx(
                "flex h-8 items-center gap-2.5 rounded-[var(--pv-r-md)] px-2.5 text-[var(--pv-text-2)] hover:bg-[var(--pv-hover)] hover:text-[var(--pv-text)]",
                TX,
              )}
              style={type("sm", "medium")}
            >
              <span aria-hidden className="flex size-4 items-center justify-center">
                <span className={cx("size-2 rounded-[var(--pv-r-xs)]", fav.dot)} />
              </span>
              <span className="truncate">{fav.label}</span>
            </div>
          ))}
        </NavGroup>
      </nav>

      <div className="flex flex-col gap-2 p-3">
        <div className="rounded-[var(--pv-r-lg)] border border-[var(--pv-border)] bg-[var(--pv-bg)] p-3">
          <div className="flex items-baseline justify-between" style={type("xs", "medium")}>
            <span className="text-[var(--pv-text-2)]">Tracked events</span>
            <span style={type("xs", "semibold", "mono")}>72%</span>
          </div>
          <Progress value={72} className="mt-2" />
          <p className="mt-2 text-[var(--pv-text-3)]" style={type("xs")}>
            7.2M of 10M this cycle
          </p>
          <p
            className="mt-2.5 inline-flex items-center gap-1 text-[var(--pv-primary-text)]"
            style={type("xs", "semibold")}
          >
            Upgrade plan
            <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </p>
        </div>

        <div className={cx("flex items-center gap-2.5 rounded-[var(--pv-r-lg)] p-1.5 hover:bg-[var(--pv-hover)]", TX)}>
          <Avatar name="Maya Patel" tone="brand" size={30} />
          <div className="min-w-0 flex-1">
            <p className="truncate" style={type("sm", "medium")}>
              Maya Patel
            </p>
            <p className="truncate text-[var(--pv-text-3)]" style={type("xs")}>
              maya@acme.co
            </p>
          </div>
          <Ellipsis size={16} strokeWidth={STROKE} aria-hidden className="shrink-0 text-[var(--pv-text-3)]" />
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--pv-border)] bg-[var(--pv-bg)] px-[var(--pv-sp-6)]">
      <div className="flex min-w-0 flex-1 items-center gap-1.5" style={type("sm", "medium")}>
        <span className="text-[var(--pv-text-3)]">Acme Inc</span>
        <ChevronRight size={14} strokeWidth={STROKE} aria-hidden className="text-[var(--pv-text-3)]" />
        <span>Overview</span>
      </div>
      <Button variant="ghost" icon={CircleHelp} />
      <span className="relative">
        <Button variant="ghost" icon={Bell} />
        <span
          aria-hidden
          className="absolute right-[9px] top-[8px] size-[7px] rounded-full bg-[var(--pv-error)] ring-2 ring-[var(--pv-bg)]"
        />
      </span>
      <span aria-hidden className="mx-1.5 h-5 w-px bg-[var(--pv-border)]" />
      <Button variant="secondary" icon={Download}>
        Export
      </Button>
      <Button variant="primary" icon={Plus}>
        New report
      </Button>
    </header>
  );
}

function KpiCard({ label, value, delta, up, good, icon: Icon, data }: (typeof KPIS)[number]) {
  return (
    <Card className="flex min-w-0 flex-col overflow-hidden">
      <div className="px-[var(--pv-sp-5)] pt-[var(--pv-sp-5)]">
        <div className="flex items-center justify-between gap-2 text-[var(--pv-text-2)]">
          <span className="truncate" style={type("sm", "medium")}>
            {label}
          </span>
          <Icon size={15} strokeWidth={STROKE} aria-hidden className="shrink-0 text-[var(--pv-text-3)]" />
        </div>
        <p className="mt-2.5" style={{ ...type("3xl", "semibold", "display"), ...numeric }}>
          {value}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <Badge tone={good ? "success" : "error"} icon={up ? TrendingUp : TrendingDown}>
            {delta}
          </Badge>
          <span className="truncate text-[var(--pv-text-3)]" style={type("xs")}>
            YoY
          </span>
        </div>
      </div>
      <Sparkline data={data} className="mt-3 h-11 w-full" />
    </Card>
  );
}

function LegendKey({ dashed, children }: { dashed?: boolean; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden
        className={cx(
          "w-3.5",
          dashed ? "border-t-2 border-dashed border-[var(--pv-text-3)]" : "h-0.5 rounded-full bg-[var(--pv-primary)]",
        )}
      />
      {children}
    </span>
  );
}

function RevenueChart() {
  const gradient = useSvgId("rev");
  const current = toPoints(THIS_YEAR, 0, Y_MAX);
  const previous = toPoints(LAST_YEAR, 0, Y_MAX);
  const [fx, fy] = current[FOCUS];
  const [, py] = previous[FOCUS];
  const growth = ((THIS_YEAR[FOCUS] - LAST_YEAR[FOCUS]) / LAST_YEAR[FOCUS]) * 100;

  return (
    <div className="mt-[var(--pv-sp-5)] grid h-[228px] grid-cols-[40px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-3 gap-y-2.5">
      <div className="relative" aria-hidden>
        {Y_TICKS.map((tick) => (
          <span
            key={tick}
            className="absolute right-0 -translate-y-1/2 text-[var(--pv-text-3)]"
            style={{ top: `${100 - (tick / Y_MAX) * 100}%`, ...type("xs", "regular", "mono") }}
          >
            {tick === 0 ? "$0" : `$${tick}k`}
          </span>
        ))}
      </div>

      <div className="relative">
        {Y_TICKS.map((tick) => (
          <span
            key={tick}
            aria-hidden
            className={cx(
              "absolute inset-x-0 border-t",
              tick === 0 ? "border-[var(--pv-border)]" : "border-dashed border-[var(--pv-grid)]",
            )}
            style={{ top: `${100 - (tick / Y_MAX) * 100}%` }}
          />
        ))}

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label="Monthly revenue, this year versus last year"
          className="absolute inset-0 size-full overflow-visible animate-[pv-reveal_var(--pv-dur-slower)_var(--pv-ease-in-out)_both]"
        >
          <defs>
            <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--pv-primary)", stopOpacity: 0.26 }} />
              <stop offset="1" style={{ stopColor: "var(--pv-primary)", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={areaPath(current)} fill={`url(#${gradient})`} />
          <path
            d={smoothPath(previous)}
            fill="none"
            style={{ stroke: "var(--pv-text-3)" }}
            strokeWidth={1.5}
            strokeDasharray="4 4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={smoothPath(current)}
            fill="none"
            style={{ stroke: "var(--pv-primary)" }}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          aria-hidden
          className="absolute inset-y-0 border-l border-[var(--pv-text-3)] opacity-40"
          style={{ left: `${fx}%` }}
        />
        <span
          aria-hidden
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--pv-text-3)] ring-2 ring-[var(--pv-surface)]"
          style={{ left: `${fx}%`, top: `${py}%` }}
        />
        <span
          aria-hidden
          className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--pv-primary)] ring-[3px] ring-[var(--pv-surface)] shadow-[0_0_0_7px_var(--pv-ring)]"
          style={{ left: `${fx}%`, top: `${fy}%` }}
        />

        <div
          className="absolute w-[168px] rounded-[var(--pv-r-lg)] border border-[var(--pv-border)] bg-[var(--pv-raised)] p-3 shadow-[var(--pv-sh-lg)] animate-[pv-rise_var(--pv-dur-slow)_var(--pv-ease)_both]"
          style={{ left: `${fx}%`, top: `${fy}%`, translate: "calc(-100% - 20px) -28%" }}
        >
          <p className="text-[var(--pv-text-3)]" style={type("xs", "medium")}>
            October 2026
          </p>
          <div className="mt-2 flex flex-col gap-1.5" style={type("xs")}>
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rounded-[var(--pv-r-xs)] bg-[var(--pv-primary)]" />
              <span className="flex-1 text-[var(--pv-text-2)]">This year</span>
              <span style={type("xs", "semibold", "mono")}>${THIS_YEAR[FOCUS]}k</span>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden className="h-2 w-2 rounded-[var(--pv-r-xs)] bg-[var(--pv-text-3)]" />
              <span className="flex-1 text-[var(--pv-text-2)]">Last year</span>
              <span style={type("xs", "medium", "mono")}>${LAST_YEAR[FOCUS]}k</span>
            </div>
          </div>
          <div
            className="mt-2.5 flex items-center justify-between border-t border-[var(--pv-border)] pt-2"
            style={type("xs")}
          >
            <span className="text-[var(--pv-text-3)]">Growth</span>
            <span className="text-[var(--pv-success-text)]" style={type("xs", "semibold", "mono")}>
              +{growth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <div aria-hidden />
      <div className="relative h-4" aria-hidden>
        {MONTHS.map((month, i) => (
          <span
            key={month}
            className={cx(
              "absolute top-0 -translate-x-1/2",
              i === FOCUS ? "text-[var(--pv-text)]" : "text-[var(--pv-text-3)]",
            )}
            style={{ left: `${(i / (MONTHS.length - 1)) * 100}%`, ...type("xs", i === FOCUS ? "semibold" : "regular") }}
          >
            {month}
          </span>
        ))}
      </div>
    </div>
  );
}

function RevenueCard() {
  return (
    <Card className="min-w-0 p-[var(--pv-sp-5)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[var(--pv-text-2)]" style={type("sm", "medium")}>
            Revenue
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span style={{ ...type("2xl", "semibold", "display"), ...numeric }}>$2,841,390</span>
            <Badge tone="success" icon={TrendingUp}>
              18.2%
            </Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 pt-1 text-[var(--pv-text-2)]" style={type("xs", "medium")}>
          <LegendKey>This year</LegendKey>
          <LegendKey dashed>Last year</LegendKey>
        </div>
      </div>
      <RevenueChart />
    </Card>
  );
}

function PlanMixCard() {
  return (
    <Card className="flex min-w-0 flex-col p-[var(--pv-sp-5)]">
      <div className="flex items-center justify-between">
        <p className="text-[var(--pv-text-2)]" style={type("sm", "medium")}>
          Revenue by plan
        </p>
        <Ellipsis size={16} strokeWidth={STROKE} aria-hidden className="text-[var(--pv-text-3)]" />
      </div>

      <div className="relative mx-auto mt-[var(--pv-sp-5)] size-[148px]">
        <svg
          viewBox="0 0 100 100"
          role="img"
          aria-label="Revenue share by plan"
          className="size-full -rotate-90 animate-[pv-fade_var(--pv-dur-slower)_var(--pv-ease)_both]"
        >
          {DONUT_SEGMENTS.map((slice) => (
            <circle
              key={slice.label}
              cx="50"
              cy="50"
              r={DONUT_RADIUS}
              fill="none"
              strokeWidth={11}
              style={{ stroke: slice.stroke }}
              strokeDasharray={slice.dashArray}
              strokeDashoffset={slice.dashOffset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ ...type("xl", "semibold", "display"), ...numeric }}>$2.84M</span>
          <span className="text-[var(--pv-text-3)]" style={type("xs")}>
            Total ARR
          </span>
        </div>
      </div>

      <ul className="mt-[var(--pv-sp-5)] flex flex-col gap-2.5">
        {PLAN_MIX.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2.5" style={type("sm")}>
            <span aria-hidden className={cx("size-2.5 shrink-0 rounded-[var(--pv-r-xs)]", slice.swatch)} />
            <span className="flex-1 truncate text-[var(--pv-text-2)]">{slice.label}</span>
            <span style={type("sm", "medium", "mono")}>{slice.value}</span>
            <span className="w-9 text-right text-[var(--pv-text-3)]" style={type("xs", "regular", "mono")}>
              {slice.pct}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Th({
  children,
  align = "left",
  className,
}: {
  children?: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cx("h-9 px-3 text-[var(--pv-text-3)]", align === "right" ? "text-right" : "text-left", className)}
      style={type("xs", "medium")}
    >
      {children}
    </th>
  );
}

function PageButton({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex size-7 items-center justify-center rounded-[var(--pv-r-md)]",
        TX,
        active
          ? "bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)]"
          : "text-[var(--pv-text-2)] hover:bg-[var(--pv-hover)]",
      )}
      style={type("xs", active ? "semibold" : "medium", "mono")}
    >
      {children}
    </span>
  );
}

function TransactionsCard() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-[var(--pv-sp-5)] py-4">
        <div className="min-w-0">
          <h2 style={type("base", "semibold", "display")}>Recent transactions</h2>
          <p className="mt-0.5 truncate text-[var(--pv-text-3)]" style={type("xs")}>
            Payments captured across all plans in the last 48 hours.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Segmented size="sm" options={["All", "Paid", "Pending", "Failed"]} value="All" />
          <Button size="sm" icon={ListFilter}>
            Filter
          </Button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-y border-[var(--pv-border)] bg-[var(--pv-bg)]">
            <Th className="w-11 pl-[var(--pv-sp-5)]">
              <Checkbox state="mixed" />
            </Th>
            <Th>Customer</Th>
            <Th>Plan</Th>
            <Th align="right">Amount</Th>
            <Th>Status</Th>
            <Th>Date</Th>
            <Th className="w-12" />
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map((row) => (
            <tr
              key={row.email}
              className={cx(
                "border-b border-[var(--pv-border)] last:border-b-0",
                TX,
                row.selected
                  ? "bg-[color-mix(in_srgb,var(--pv-primary-soft)_55%,transparent)]"
                  : "hover:bg-[var(--pv-hover)]",
              )}
              style={type("sm")}
            >
              <td className="py-2.5 pl-[var(--pv-sp-5)] pr-3">
                <Checkbox state={row.selected ? "on" : "off"} />
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <Avatar name={row.name} tone={row.tone} size={32} />
                  <div className="min-w-0">
                    <p className="truncate" style={type("sm", "medium")}>
                      {row.name}
                    </p>
                    <p className="truncate text-[var(--pv-text-3)]" style={type("xs")}>
                      {row.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-3 py-2.5 text-[var(--pv-text-2)]">{row.plan}</td>
              <td className="px-3 py-2.5 text-right" style={type("sm", "medium", "mono")}>
                {row.amount}
              </td>
              <td className="px-3 py-2.5">
                <Badge tone={STATUS_TONE[row.status]} dot>
                  {row.status}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-[var(--pv-text-2)]">{row.date}</td>
              <td className="py-2.5 pr-[var(--pv-sp-5)] text-right">
                <Button variant="ghost" size="sm" icon={Ellipsis} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--pv-border)] px-[var(--pv-sp-5)] py-3">
        <p className="text-[var(--pv-text-3)]" style={type("xs")}>
          Showing{" "}
          <span className="text-[var(--pv-text)]" style={type("xs", "medium")}>
            1–6
          </span>{" "}
          of{" "}
          <span className="text-[var(--pv-text)]" style={type("xs", "medium")}>
            248
          </span>{" "}
          transactions
        </p>
        <div className="flex items-center gap-1">
          <Button size="sm" icon={ChevronLeft} className="mr-1">
            Previous
          </Button>
          <PageButton active>1</PageButton>
          <PageButton>2</PageButton>
          <PageButton>3</PageButton>
          <span className="inline-flex w-6 justify-center text-[var(--pv-text-3)]" aria-hidden>
            <Ellipsis size={14} strokeWidth={STROKE} />
          </span>
          <PageButton>42</PageButton>
          <Button size="sm" iconRight={ChevronRight} className="ml-1">
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}

const DashboardScreen = memo(function DashboardScreen({ theme, dark }: ScreenProps) {
  const vars = useMemo(() => previewVars(theme, dark), [theme, dark]);

  return (
    <div className="flex h-full min-w-[980px]" style={vars}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="preview-scroll min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-[var(--pv-sp-5)] p-[var(--pv-sp-6)] animate-[pv-rise_var(--pv-dur-slow)_var(--pv-ease)_both]">
            <div className="flex items-end justify-between gap-6">
              <div className="min-w-0 flex-1">
                <h1 className="truncate" style={type("2xl", "semibold", "display")}>
                  Good morning, Maya
                </h1>
                <p className="mt-1 text-[var(--pv-text-2)] [text-wrap:pretty]" style={type("sm")}>
                  Here’s how Acme Inc performed over the last 12 months.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Segmented options={["12M", "30D", "7D", "24H"]} value="12M" />
                <Button icon={Calendar} iconRight={ChevronDown}>
                  Dec 2025 – Nov 2026
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-[var(--pv-sp-4)]">
              {KPIS.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
            </div>

            <div className="grid grid-cols-[minmax(0,1.85fr)_minmax(272px,1fr)] gap-[var(--pv-sp-4)]">
              <RevenueCard />
              <PlanMixCard />
            </div>

            <TransactionsCard />
          </div>
        </main>
      </div>
    </div>
  );
});

export default DashboardScreen;
