"use client";

import { memo, useMemo, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bell,
  Blocks,
  Briefcase,
  Building2,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Command,
  CreditCard,
  Globe,
  KeyRound,
  Link2,
  Mail,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { TX, numeric, previewVars, type, type ScreenProps } from "../kit";
import { Avatar, Badge, BrandMark, Button, Card, Kbd, Radio, STROKE, Segmented, Switch, cx } from "../parts";

const TOP_NAV = ["Overview", "Analytics", "Customers", "Reports", "Settings"];

const SETTINGS_NAV: { group: string; items: { icon: LucideIcon; label: string; active?: boolean; meta?: string }[] }[] =
  [
    {
      group: "Account",
      items: [
        { icon: UserRound, label: "Profile", active: true },
        { icon: SlidersHorizontal, label: "Preferences" },
        { icon: Bell, label: "Notifications" },
        { icon: ShieldCheck, label: "Security" },
      ],
    },
    {
      group: "Workspace",
      items: [
        { icon: Building2, label: "General" },
        { icon: Users, label: "Members", meta: "12" },
        { icon: CreditCard, label: "Billing" },
        { icon: Blocks, label: "Integrations" },
        { icon: KeyRound, label: "API keys" },
      ],
    },
  ];

const NOTIFICATIONS = [
  { title: "Weekly performance digest", body: "Revenue, churn and growth in your inbox every Monday.", on: true },
  { title: "Failed payments", body: "Get notified the moment a customer charge fails.", on: true },
  { title: "Product updates", body: "Occasional news about new features and improvements.", on: false },
  { title: "Mentions and comments", body: "When a teammate mentions you in a report.", on: true },
];

const PLANS = [
  { name: "Starter", price: "$0", note: "Up to 1,000 customers", current: false },
  { name: "Growth", price: "$49", note: "Up to 25,000 customers", current: true },
  { name: "Scale", price: "$199", note: "Unlimited, with SSO and SLA", current: false },
];

type FieldState = "default" | "focus" | "error" | "success";

const FIELD_STATE: Record<FieldState, string> = {
  default: "border-[var(--pv-border)] shadow-[var(--pv-sh-xs)] hover:border-[var(--pv-text-3)]",
  focus: "border-[var(--pv-primary)] shadow-[0_0_0_3px_var(--pv-ring)]",
  error: "border-[var(--pv-error)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--pv-error)_16%,transparent)]",
  success: "border-[var(--pv-border)] shadow-[var(--pv-sh-xs)]",
};

function Field({
  label,
  hint,
  hintTone = "muted",
  aside,
  children,
}: {
  label: string;
  hint?: string;
  hintTone?: "muted" | "error" | "success";
  aside?: ReactNode;
  children: ReactNode;
}) {
  const HintIcon = hintTone === "error" ? CircleAlert : hintTone === "success" ? CircleCheck : null;
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span style={type("sm", "medium")}>{label}</span>
        {aside}
      </div>
      {children}
      {hint && (
        <span
          className={cx(
            "flex items-center gap-1.5",
            hintTone === "error"
              ? "text-[var(--pv-error-text)]"
              : hintTone === "success"
                ? "text-[var(--pv-success-text)]"
                : "text-[var(--pv-text-3)]",
          )}
          style={type("xs")}
        >
          {HintIcon && <HintIcon size={13} strokeWidth={2} aria-hidden className="shrink-0" />}
          {hint}
        </span>
      )}
    </div>
  );
}

function Input({
  value,
  placeholder,
  icon: Icon,
  prefix,
  trailing,
  state = "default",
  caret,
}: {
  value?: string;
  placeholder?: string;
  icon?: LucideIcon;
  prefix?: string;
  trailing?: ReactNode;
  state?: FieldState;
  caret?: boolean;
}) {
  return (
    <div
      className={cx(
        "flex h-9 min-w-0 items-center overflow-hidden rounded-[var(--pv-r-lg)] border bg-[var(--pv-field)]",
        TX,
        FIELD_STATE[state],
      )}
      style={type("sm")}
    >
      {prefix && (
        <span className="flex h-full shrink-0 items-center border-r border-[var(--pv-border)] bg-[var(--pv-bg)] px-3 text-[var(--pv-text-3)]">
          {prefix}
        </span>
      )}
      {Icon && <Icon size={15} strokeWidth={STROKE} aria-hidden className="ml-3 shrink-0 text-[var(--pv-text-3)]" />}
      <span className={cx("flex min-w-0 flex-1 items-center truncate px-3", !value && "text-[var(--pv-text-3)]")}>
        {value ?? placeholder}
        {caret && <span aria-hidden className="ml-px inline-block h-4 w-[1.5px] rounded-full bg-[var(--pv-primary)]" />}
      </span>
      {trailing && <span className="flex shrink-0 items-center pr-3">{trailing}</span>}
    </div>
  );
}

function Select({ value, icon }: { value: string; icon?: LucideIcon }) {
  return (
    <Input
      value={value}
      icon={icon}
      trailing={<ChevronDown size={15} strokeWidth={STROKE} aria-hidden className="text-[var(--pv-text-3)]" />}
    />
  );
}

function SectionHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-[var(--pv-sp-6)] pt-[var(--pv-sp-6)]">
      <div className="min-w-0">
        <h2 style={type("lg", "semibold", "display")}>{title}</h2>
        <p className="mt-1 text-[var(--pv-text-2)]" style={type("sm")}>
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-6 border-b border-[var(--pv-border)] bg-[var(--pv-surface)] px-[var(--pv-sp-6)]">
      <div className="flex items-center gap-2.5">
        <BrandMark size={28} />
        <span style={type("base", "semibold", "display")}>Lumen</span>
      </div>
      <nav aria-label="Main" className="flex h-full items-stretch gap-1">
        {TOP_NAV.map((item) => {
          const active = item === "Settings";
          return (
            <span
              key={item}
              className={cx(
                "relative flex items-center px-2.5",
                TX,
                active ? "text-[var(--pv-text)]" : "text-[var(--pv-text-2)] hover:text-[var(--pv-text)]",
              )}
              style={type("sm", active ? "semibold" : "medium")}
            >
              {item}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-[var(--pv-primary)]"
                />
              )}
            </span>
          );
        })}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <div className="flex h-8 w-56 items-center gap-2 rounded-[var(--pv-r-lg)] border border-[var(--pv-border)] bg-[var(--pv-field)] pl-2.5 pr-1.5 text-[var(--pv-text-3)]">
          <Search size={14} strokeWidth={STROKE} aria-hidden />
          <span className="flex-1 truncate" style={type("sm")}>
            Search settings
          </span>
          <Kbd className="gap-0.5">
            <Command size={10} strokeWidth={2} aria-hidden />K
          </Kbd>
        </div>
        <Button variant="ghost" icon={Bell} />
        <Avatar name="Maya Patel" tone="brand" size={30} />
      </div>
    </header>
  );
}

function SettingsNav() {
  return (
    <nav aria-label="Settings" className="flex flex-col gap-6">
      {SETTINGS_NAV.map(({ group, items }) => (
        <div key={group} className="flex flex-col gap-px">
          <p className="px-3 pb-2 text-[var(--pv-text-3)]" style={type("xs", "medium")}>
            {group}
          </p>
          {items.map(({ icon: Icon, label, active, meta }) => (
            <span
              key={label}
              className={cx(
                "group flex h-9 items-center gap-2.5 rounded-[var(--pv-r-md)] px-3",
                TX,
                active
                  ? "bg-[var(--pv-surface)] text-[var(--pv-text)] shadow-[var(--pv-sh-xs),0_0_0_1px_var(--pv-border)]"
                  : "text-[var(--pv-text-2)] hover:bg-[var(--pv-hover)] hover:text-[var(--pv-text)]",
              )}
              style={type("sm", active ? "semibold" : "medium")}
            >
              <Icon
                size={16}
                strokeWidth={STROKE}
                aria-hidden
                className={
                  active
                    ? "text-[var(--pv-primary-text)]"
                    : "text-[var(--pv-text-3)] group-hover:text-[var(--pv-text-2)]"
                }
              />
              <span className="flex-1">{label}</span>
              {meta && (
                <span className="text-[var(--pv-text-3)]" style={type("xs", "medium", "mono")}>
                  {meta}
                </span>
              )}
            </span>
          ))}
        </div>
      ))}
    </nav>
  );
}

function ProfileSection() {
  return (
    <Card>
      <SectionHeader
        title="Profile"
        description="This is how teammates and customers see you across Lumen."
        action={
          <Button variant="ghost" size="sm" iconRight={ArrowUpRight}>
            View public profile
          </Button>
        }
      />
      <div className="flex flex-col gap-[var(--pv-sp-5)] p-[var(--pv-sp-6)]">
        <div className="flex items-center gap-[var(--pv-sp-4)]">
          <div className="relative">
            <Avatar name="Maya Patel" tone="brand" size={64} text="xl" className="shadow-[var(--pv-sh-md)]" />
            <span
              aria-hidden
              className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-[var(--pv-success)] ring-[3px] ring-[var(--pv-surface)]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button size="sm" icon={Upload}>
                Upload new
              </Button>
              <Button variant="ghost" size="sm">
                Remove
              </Button>
            </div>
            <p className="text-[var(--pv-text-3)]" style={type("xs")}>
              PNG, JPG or GIF, at least 256 px. Max 2 MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[var(--pv-sp-4)]">
          <Field label="First name">
            <Input value="Maya" />
          </Field>
          <Field label="Last name">
            <Input value="Patel" />
          </Field>
        </div>

        <Field label="Email address" hint="We’ll send a confirmation link to verify a new address.">
          <Input
            value="maya@acme.co"
            icon={Mail}
            state="focus"
            caret
            trailing={<Badge tone="success">Verified</Badge>}
          />
        </Field>

        <div className="grid grid-cols-2 gap-[var(--pv-sp-4)]">
          <Field label="Username" hint="This username is available" hintTone="success">
            <Input
              prefix="lumen.so/"
              value="maya"
              state="success"
              trailing={<CircleCheck size={15} strokeWidth={2} aria-hidden className="text-[var(--pv-success)]" />}
            />
          </Field>
          <Field label="Website" hint="Enter a valid URL, like https://acme.co" hintTone="error">
            <Input value="acme,co" icon={Link2} state="error" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-[var(--pv-sp-4)]">
          <Field label="Role">
            <Select value="Head of Product Design" icon={Briefcase} />
          </Field>
          <Field label="Timezone">
            <Select value="Pacific Time (UTC−08:00)" icon={Globe} />
          </Field>
        </div>

        <Field
          label="Bio"
          aside={
            <span className="text-[var(--pv-text-3)]" style={{ ...type("xs", "regular", "mono"), ...numeric }}>
              164 / 280
            </span>
          }
        >
          <div
            className={cx(
              "min-h-[92px] rounded-[var(--pv-r-lg)] border bg-[var(--pv-field)] px-3 py-2.5 text-[var(--pv-text)]",
              FIELD_STATE.default,
              TX,
            )}
            style={{ ...type("sm"), lineHeight: "var(--pv-lh-relaxed)" }}
          >
            Design lead at Acme. I care about calm interfaces, honest data and teams that ship. Previously building
            payments tools at Northwind.
          </div>
        </Field>
      </div>
    </Card>
  );
}

function NotificationsSection() {
  return (
    <Card>
      <SectionHeader title="Notifications" description="Choose what you hear about, and when." />
      <ul className="mt-[var(--pv-sp-4)] border-t border-[var(--pv-border)]">
        {NOTIFICATIONS.map((n) => (
          <li
            key={n.title}
            className="flex items-center gap-4 border-b border-[var(--pv-border)] px-[var(--pv-sp-6)] py-[var(--pv-sp-4)] last:border-b-0"
          >
            <div className="min-w-0 flex-1">
              <p style={type("sm", "medium")}>{n.title}</p>
              <p className="mt-0.5 text-[var(--pv-text-3)]" style={type("xs")}>
                {n.body}
              </p>
            </div>
            <Switch on={n.on} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function PlanSection() {
  return (
    <Card>
      <SectionHeader
        title="Plan"
        description="You’re on Growth, billed annually. Your next invoice is on Dec 1, 2026."
        action={
          <span className="flex shrink-0 items-center gap-2">
            <Segmented size="sm" options={["Monthly", "Annually"]} value="Annually" />
          </span>
        }
      />
      <div className="grid grid-cols-3 gap-[var(--pv-sp-3)] p-[var(--pv-sp-6)]">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cx(
              "relative flex flex-col gap-3 rounded-[var(--pv-r-xl)] border p-[var(--pv-sp-4)]",
              TX,
              plan.current
                ? "border-[var(--pv-primary)] bg-[color-mix(in_srgb,var(--pv-primary-soft)_55%,var(--pv-surface))] shadow-[0_0_0_3px_var(--pv-ring)]"
                : "border-[var(--pv-border)] bg-[var(--pv-surface)] hover:border-[var(--pv-text-3)]",
            )}
          >
            <div className="flex items-center justify-between">
              <span style={type("sm", "semibold")}>{plan.name}</span>
              <Radio on={plan.current} />
            </div>
            <div className="flex items-baseline gap-1">
              <span style={{ ...type("2xl", "bold", "display"), ...numeric }}>{plan.price}</span>
              <span className="text-[var(--pv-text-3)]" style={type("xs")}>
                / month
              </span>
            </div>
            <p className="text-[var(--pv-text-2)]" style={type("xs")}>
              {plan.note}
            </p>
            {plan.current && (
              <Badge tone="primary" className="absolute -top-2.5 right-3">
                Current plan
              </Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function DangerZone() {
  return (
    <Card className="border-[color-mix(in_srgb,var(--pv-error)_40%,var(--pv-border))]">
      <div className="px-[var(--pv-sp-6)] pt-[var(--pv-sp-6)]">
        <h2 className="text-[var(--pv-error-text)]" style={type("lg", "semibold", "display")}>
          Danger zone
        </h2>
        <p className="mt-1 text-[var(--pv-text-2)]" style={type("sm")}>
          These actions are permanent. Proceed with care.
        </p>
      </div>
      <div className="mt-[var(--pv-sp-4)] flex flex-col">
        <div className="flex items-center gap-4 border-t border-[var(--pv-border)] px-[var(--pv-sp-6)] py-[var(--pv-sp-4)]">
          <div className="min-w-0 flex-1">
            <p style={type("sm", "medium")}>Transfer ownership</p>
            <p className="mt-0.5 text-[var(--pv-text-3)]" style={type("xs")}>
              Hand Acme Inc over to another admin in this workspace.
            </p>
          </div>
          <Button size="sm">Transfer</Button>
        </div>
        <div className="flex items-center gap-4 rounded-b-[var(--pv-r-xl)] border-t border-[var(--pv-border)] bg-[color-mix(in_srgb,var(--pv-error-soft)_45%,transparent)] px-[var(--pv-sp-6)] py-[var(--pv-sp-4)]">
          <div className="min-w-0 flex-1">
            <p style={type("sm", "medium")}>Delete workspace</p>
            <p className="mt-0.5 text-[var(--pv-text-3)]" style={type("xs")}>
              Permanently remove Acme Inc, its reports and 248 customers’ data.
            </p>
          </div>
          <Button variant="danger" size="sm" icon={Trash2}>
            Delete workspace
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SaveBar() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-6 pb-[var(--pv-sp-6)] pt-16"
      style={{ backgroundImage: "linear-gradient(to top, var(--pv-bg) 35%, transparent)" }}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-[var(--pv-r-xl)] border border-[var(--pv-border)] bg-[var(--pv-raised)] py-2 pl-4 pr-2 shadow-[var(--pv-sh-xl)] animate-[pv-rise_var(--pv-dur-slow)_var(--pv-spring)_both]">
        <span
          aria-hidden
          className="size-2 rounded-full bg-[var(--pv-warning)] shadow-[0_0_0_3px_var(--pv-warning-soft)]"
        />
        <span className="pr-3" style={type("sm", "medium")}>
          You have unsaved changes
        </span>
        <Button variant="ghost" size="sm">
          Discard
        </Button>
        <Button variant="primary" size="sm">
          Save changes
        </Button>
      </div>
    </div>
  );
}

const SettingsScreen = memo(function SettingsScreen({ theme, dark }: ScreenProps) {
  const vars = useMemo(() => previewVars(theme, dark), [theme, dark]);

  return (
    <div className="relative flex h-full min-w-[960px] flex-col" style={vars}>
      <TopNav />
      <div className="preview-scroll min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1120px] px-[var(--pv-sp-8)] pb-40 pt-[var(--pv-sp-8)] animate-[pv-rise_var(--pv-dur-slow)_var(--pv-ease)_both]">
          <div className="mb-[var(--pv-sp-8)]">
            <h1 style={type("3xl", "semibold", "display")}>Settings</h1>
            <p className="mt-1.5 text-[var(--pv-text-2)]" style={type("base")}>
              Manage your profile, notifications and workspace preferences.
            </p>
          </div>
          <div className="grid grid-cols-[200px_minmax(0,1fr)] items-start gap-[var(--pv-sp-10)]">
            <div className="sticky top-[var(--pv-sp-6)]">
              <SettingsNav />
            </div>
            <div className="flex max-w-[720px] flex-col gap-[var(--pv-sp-6)]">
              <ProfileSection />
              <NotificationsSection />
              <PlanSection />
              <DangerZone />
            </div>
          </div>
        </div>
      </div>
      <SaveBar />
    </div>
  );
});

export default SettingsScreen;
