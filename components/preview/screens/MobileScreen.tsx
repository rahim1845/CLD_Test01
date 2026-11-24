"use client";

import { memo, useMemo, type ReactNode } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BatteryFull,
  Bell,
  ChartPie,
  ChevronLeft,
  Coffee,
  CreditCard,
  Delete,
  Ellipsis,
  Eye,
  House,
  LayoutGrid,
  Music,
  Plus,
  ScanLine,
  Search,
  ShoppingBag,
  Signal,
  UserRound,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { TX, brandGradient, numeric, previewVars, type, type ScreenProps, type Tone } from "../kit";
import { Avatar, IconTile, STROKE, cx } from "../parts";

const QUICK_ACTIONS: { icon: LucideIcon; label: string }[] = [
  { icon: ArrowUpRight, label: "Send" },
  { icon: ArrowDownLeft, label: "Request" },
  { icon: Plus, label: "Top up" },
  { icon: LayoutGrid, label: "More" },
];

const ACTIVITY: { icon: LucideIcon; tone: Tone; title: string; meta: string; amount: string; credit?: boolean }[] = [
  { icon: Coffee, tone: "warning", title: "Blue Bottle Coffee", meta: "Today, 8:24 AM", amount: "−$6.40" },
  {
    icon: ArrowDownLeft,
    tone: "success",
    title: "Salary · Acme Inc",
    meta: "Yesterday",
    amount: "+$4,200.00",
    credit: true,
  },
  { icon: ShoppingBag, tone: "info", title: "Apple Store", meta: "Nov 19", amount: "−$1,199.00" },
  { icon: Music, tone: "accent", title: "Spotify Premium", meta: "Nov 18", amount: "−$11.99" },
];

const TABS: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: House, label: "Home", active: true },
  { icon: CreditCard, label: "Cards" },
  { icon: ChartPie, label: "Insights" },
  { icon: UserRound, label: "Profile" },
];

const AMOUNTS = ["$50", "$100", "$240", "Custom"];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"];

function Phone({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <figure
      aria-label={label}
      className={cx(
        "relative h-[684px] w-[316px] shrink-0 rounded-[54px] bg-[var(--pv-device)] p-[11px]",
        "shadow-[var(--pv-sh-2xl),inset_0_0_0_1px_rgb(255_255_255/0.14),inset_0_0_0_3px_rgb(0_0_0/0.4),0_0_0_1px_var(--pv-device-edge)]",
        className,
      )}
    >
      <span aria-hidden className="absolute -left-[3px] top-[118px] h-7 w-[3px] rounded-l-sm bg-[var(--pv-device)]" />
      <span aria-hidden className="absolute -left-[3px] top-[164px] h-12 w-[3px] rounded-l-sm bg-[var(--pv-device)]" />
      <span aria-hidden className="absolute -left-[3px] top-[224px] h-12 w-[3px] rounded-l-sm bg-[var(--pv-device)]" />
      <span aria-hidden className="absolute -right-[3px] top-[176px] h-20 w-[3px] rounded-r-sm bg-[var(--pv-device)]" />
      <div className="relative flex h-full flex-col overflow-hidden rounded-[43px] bg-[var(--pv-bg)]">
        <StatusBar />
        <span
          aria-hidden
          className="absolute left-1/2 top-[11px] z-20 h-[30px] w-[98px] -translate-x-1/2 rounded-full bg-black"
        />
        {children}
        <span
          aria-hidden
          className="absolute bottom-2 left-1/2 z-20 h-[5px] w-[118px] -translate-x-1/2 rounded-full bg-[var(--pv-text)] opacity-90"
        />
      </div>
    </figure>
  );
}

function StatusBar() {
  return (
    <div className="flex h-[52px] shrink-0 items-center justify-between px-7 pt-1.5" aria-hidden>
      <span style={{ ...type("sm", "semibold"), ...numeric }}>9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.25} />
        <Wifi size={15} strokeWidth={2.25} />
        <BatteryFull size={20} strokeWidth={1.75} />
      </span>
    </div>
  );
}

function RoundButton({ icon: Icon, dot }: { icon: LucideIcon; dot?: boolean }) {
  return (
    <span
      className={cx(
        "relative inline-flex size-10 items-center justify-center rounded-[var(--pv-r-full)] border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] shadow-[var(--pv-sh-xs)]",
        TX,
      )}
    >
      <Icon size={18} strokeWidth={STROKE} aria-hidden />
      {dot && (
        <span
          aria-hidden
          className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[var(--pv-error)] ring-2 ring-[var(--pv-surface)]"
        />
      )}
    </span>
  );
}

function CardNetworkMark() {
  return (
    <span aria-hidden className="flex">
      <span className="size-6 rounded-full bg-white/80 mix-blend-soft-light" />
      <span className="-ml-2.5 size-6 rounded-full bg-white/55" />
    </span>
  );
}

function HomeScreen() {
  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-1">
        <Avatar name="Maya Patel" tone="brand" size={40} text="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-[var(--pv-text-3)]" style={type("xs", "medium")}>
            Good evening
          </p>
          <p className="truncate" style={type("base", "semibold", "display")}>
            Maya Patel
          </p>
        </div>
        <RoundButton icon={Search} />
        <RoundButton icon={Bell} dot />
      </div>

      <div
        className="relative mx-5 mt-5 overflow-hidden rounded-[var(--pv-r-2xl)] p-5 text-[var(--pv-on-brand)] shadow-[var(--pv-sh-lg)]"
        style={{ backgroundImage: brandGradient(140) }}
      >
        <span aria-hidden className="absolute -right-10 -top-12 size-40 rounded-full bg-white/10" />
        <span aria-hidden className="absolute -bottom-16 right-8 size-32 rounded-full bg-white/[0.07]" />
        <div className="relative flex items-center gap-1.5 opacity-80" style={type("xs", "medium")}>
          Total balance
          <Eye size={13} strokeWidth={2} aria-hidden />
        </div>
        <p className="relative mt-1.5" style={{ ...type("3xl", "bold", "display"), ...numeric }}>
          $24,562<span className="opacity-60">.80</span>
        </p>
        <span
          className="relative mt-2.5 inline-flex items-center gap-1 rounded-[var(--pv-r-full)] bg-white/[0.16] px-2 py-0.5"
          style={type("xs", "semibold")}
        >
          <ArrowUpRight size={12} strokeWidth={2.25} aria-hidden />
          $1,284.50 this month
        </span>
        <div className="relative mt-5 flex items-end justify-between">
          <span className="opacity-80" style={{ ...type("xs", "medium", "mono"), letterSpacing: "var(--pv-ls-wider)" }}>
            •••• 4821
          </span>
          <CardNetworkMark />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-4 px-4">
        {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1.5">
            <span
              className={cx(
                "inline-flex size-12 items-center justify-center rounded-[var(--pv-r-full)] bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)]",
                TX,
              )}
            >
              <Icon size={20} strokeWidth={STROKE} aria-hidden />
            </span>
            <span className="text-[var(--pv-text-2)]" style={type("xs", "medium")}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-baseline justify-between px-5">
        <span style={type("base", "semibold", "display")}>Recent activity</span>
        <span className="text-[var(--pv-primary-text)]" style={type("xs", "semibold")}>
          See all
        </span>
      </div>
      <ul className="mt-1 px-5">
        {ACTIVITY.map((item) => (
          <li key={item.title} className="flex items-center gap-3 py-2.5">
            <IconTile icon={item.icon} tone={item.tone} size={40} className="rounded-[var(--pv-r-xl)]" />
            <div className="min-w-0 flex-1">
              <p className="truncate" style={type("sm", "semibold")}>
                {item.title}
              </p>
              <p className="text-[var(--pv-text-3)]" style={type("xs")}>
                {item.meta}
              </p>
            </div>
            <span
              className={item.credit ? "text-[var(--pv-success-text)]" : undefined}
              style={type("sm", "semibold", "mono")}
            >
              {item.amount}
            </span>
          </li>
        ))}
      </ul>

      <TabBar />
    </div>
  );
}

function TabBar() {
  const half = TABS.length / 2;
  const tab = ({ icon: Icon, label, active }: (typeof TABS)[number]) => (
    <span
      key={label}
      className={cx(
        "flex flex-1 flex-col items-center gap-1",
        active ? "text-[var(--pv-primary-text)]" : "text-[var(--pv-text-3)]",
      )}
      style={type("xs", active ? "semibold" : "medium")}
    >
      <Icon size={22} strokeWidth={active ? 2.1 : STROKE} aria-hidden />
      {label}
    </span>
  );

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 border-t border-[var(--pv-border)] bg-[color-mix(in_srgb,var(--pv-surface)_84%,transparent)] px-3 pb-7 pt-2.5 backdrop-blur-xl">
      <div className="flex items-start">
        {TABS.slice(0, half).map(tab)}
        <span className="flex flex-1 justify-center">
          <span
            className="-mt-8 inline-flex size-14 items-center justify-center rounded-[var(--pv-r-full)] text-[var(--pv-on-brand)] shadow-[var(--pv-sh-lg),0_0_0_5px_var(--pv-bg)]"
            style={{ backgroundImage: brandGradient(150) }}
          >
            <ScanLine size={22} strokeWidth={2} aria-hidden />
          </span>
        </span>
        {TABS.slice(half).map(tab)}
      </div>
    </div>
  );
}

function SendScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col [&>*]:shrink-0">
      <div className="flex items-center justify-between px-5 pt-1">
        <RoundButton icon={ChevronLeft} />
        <span style={type("base", "semibold", "display")}>Send money</span>
        <RoundButton icon={Ellipsis} />
      </div>

      <div className="mx-5 mt-3 flex items-center gap-3 rounded-[var(--pv-r-2xl)] border border-[var(--pv-border)] bg-[var(--pv-surface)] p-3 shadow-[var(--pv-sh-sm)]">
        <Avatar name="Jordan Lee" tone="accent" size={44} text="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate" style={type("sm", "semibold")}>
            Jordan Lee
          </p>
          <p className="truncate text-[var(--pv-text-3)]" style={type("xs")}>
            @jordanlee
          </p>
        </div>
        <span className="pr-1 text-[var(--pv-primary-text)]" style={type("xs", "semibold")}>
          Change
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center py-3">
        <div className="flex flex-col items-center">
          <span className="text-[var(--pv-text-3)]" style={type("xs", "medium")}>
            You send
          </span>
          <p className="mt-1 flex items-start" style={{ ...type("4xl", "bold", "display"), ...numeric }}>
            <span className="mr-0.5 mt-[0.18em] text-[0.5em] text-[var(--pv-text-3)]">$</span>
            240
            <span className="text-[var(--pv-text-3)]">.00</span>
          </p>
          <span className="mt-1.5 text-[var(--pv-text-3)]" style={type("xs")}>
            Balance after transfer{" "}
            <span className="text-[var(--pv-text-2)]" style={type("xs", "medium", "mono")}>
              $24,322.80
            </span>
          </span>
        </div>

        <div className="mt-3.5 flex justify-center gap-1.5 px-4">
          {AMOUNTS.map((amount) => {
            const active = amount === "$240";
            return (
              <span
                key={amount}
                className={cx(
                  "inline-flex h-8 items-center rounded-[var(--pv-r-full)] border px-3.5",
                  TX,
                  active
                    ? "border-[var(--pv-primary)] bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)]"
                    : "border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text-2)]",
                )}
                style={type("xs", "semibold")}
              >
                {amount}
              </span>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 px-7">
        {KEYS.map((key) => (
          <span
            key={key}
            className={cx(
              "flex h-11 items-center justify-center rounded-[var(--pv-r-full)] hover:bg-[var(--pv-hover)]",
              TX,
            )}
            style={type("2xl", "medium", "display")}
          >
            {key}
          </span>
        ))}
        <span className="flex h-11 items-center justify-center text-[var(--pv-text-2)]">
          <Delete size={22} strokeWidth={STROKE} aria-label="Delete" />
        </span>
      </div>

      <div className="px-5 pb-7 pt-2">
        <span
          className="flex h-12 items-center justify-center gap-2 rounded-[var(--pv-r-xl)] bg-[var(--pv-primary)] text-[var(--pv-on-primary)] shadow-[var(--pv-sh-md),inset_0_1px_0_rgb(255_255_255/0.16)]"
          style={type("base", "semibold")}
        >
          Send $240.00
          <ArrowRight size={18} strokeWidth={2} aria-hidden />
        </span>
      </div>
    </div>
  );
}

const MobileScreen = memo(function MobileScreen({ theme, dark }: ScreenProps) {
  const vars = useMemo(() => previewVars(theme, dark), [theme, dark]);

  return (
    <div className="preview-scroll relative h-full overflow-auto" style={vars}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(40% 55% at 30% 40%, var(--pv-glow-1), transparent 70%), radial-gradient(40% 55% at 72% 62%, var(--pv-glow-2), transparent 70%)",
        }}
      />
      <div className="relative flex min-h-full">
        <div className="m-auto flex flex-wrap items-center justify-center gap-x-16 gap-y-10 px-6 py-8 animate-[pv-rise_var(--pv-dur-slower)_var(--pv-ease)_both]">
          <Phone label="Wallet home screen">
            <HomeScreen />
          </Phone>
          <Phone label="Send money screen">
            <SendScreen />
          </Phone>
        </div>
      </div>
    </div>
  );
});

export default MobileScreen;
