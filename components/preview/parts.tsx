import { useId, type CSSProperties, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Minus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { TX, areaPath, brandGradient, smoothPath, toPoints, type, type SizeKey, type Tone } from "./kit";

/** Later classes win, so call sites can override a primitive's radius, shadow or border. */
export function cx(...classes: (string | false | null | undefined)[]) {
  return twMerge(...classes);
}

export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^\w-]/g, "")}`;
}

export const STROKE = 1.75;

export const TONE: Record<Tone, { soft: string; text: string; solid: string }> = {
  primary: {
    soft: "bg-[var(--pv-primary-soft)]",
    text: "text-[var(--pv-primary-text)]",
    solid: "bg-[var(--pv-primary)]",
  },
  accent: { soft: "bg-[var(--pv-accent-soft)]", text: "text-[var(--pv-accent-text)]", solid: "bg-[var(--pv-accent)]" },
  success: {
    soft: "bg-[var(--pv-success-soft)]",
    text: "text-[var(--pv-success-text)]",
    solid: "bg-[var(--pv-success)]",
  },
  warning: {
    soft: "bg-[var(--pv-warning-soft)]",
    text: "text-[var(--pv-warning-text)]",
    solid: "bg-[var(--pv-warning)]",
  },
  error: { soft: "bg-[var(--pv-error-soft)]", text: "text-[var(--pv-error-text)]", solid: "bg-[var(--pv-error)]" },
  info: { soft: "bg-[var(--pv-info-soft)]", text: "text-[var(--pv-info-text)]", solid: "bg-[var(--pv-info)]" },
  neutral: {
    soft: "bg-[var(--pv-neutral-soft)]",
    text: "text-[var(--pv-neutral-text)]",
    solid: "bg-[var(--pv-neutral)]",
  },
};

export function BrandMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--pv-r-lg)] text-[var(--pv-on-brand)]",
        "shadow-[var(--pv-sh-xs),inset_0_0_0_1px_rgb(255_255_255/0.14)]",
        className,
      )}
      style={{ width: size, height: size, backgroundImage: brandGradient() }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56}>
        <path
          d="M12 2.75c.7 5.2 3.3 7.8 8.5 8.5v.5c-5.2.7-7.8 3.3-8.5 8.5h-.01c-.7-5.2-3.3-7.8-8.49-8.5v-.5c5.2-.7 7.8-3.3 8.5-8.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function Card({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-[var(--pv-r-xl)] border border-[var(--pv-border)] bg-[var(--pv-surface)] shadow-[var(--pv-sh-xs)]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--pv-primary)] text-[var(--pv-on-primary)] shadow-[var(--pv-sh-xs),inset_0_1px_0_rgb(255_255_255/0.16)] hover:bg-[var(--pv-primary-hover)]",
  secondary:
    "border border-[var(--pv-border)] bg-[var(--pv-surface)] text-[var(--pv-text)] shadow-[var(--pv-sh-xs)] hover:bg-[var(--pv-hover)]",
  ghost: "text-[var(--pv-text-2)] hover:bg-[var(--pv-hover)] hover:text-[var(--pv-text)]",
  soft: "bg-[var(--pv-primary-soft)] text-[var(--pv-primary-text)] hover:brightness-[0.97]",
  danger:
    "bg-[var(--pv-danger)] text-[var(--pv-on-danger)] shadow-[var(--pv-sh-xs),inset_0_1px_0_rgb(255_255_255/0.14)] hover:brightness-[1.08]",
};

const BUTTON_SIZE: Record<ButtonSize, { cls: string; text: SizeKey; icon: number }> = {
  sm: { cls: "h-7 gap-1.5 px-2.5", text: "xs", icon: 14 },
  md: { cls: "h-8 gap-2 px-3", text: "sm", icon: 15 },
  lg: { cls: "h-10 gap-2 px-4", text: "sm", icon: 16 },
};

export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  className,
  style,
  children,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const s = BUTTON_SIZE[size];
  return (
    <span
      className={cx(
        "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-[var(--pv-r-lg)]",
        TX,
        s.cls,
        BUTTON_VARIANT[variant],
        !children && "aspect-square px-0",
        className,
      )}
      style={{ ...type(s.text, "medium"), ...style }}
    >
      {Icon && <Icon size={s.icon} strokeWidth={STROKE} aria-hidden className="shrink-0" />}
      {children}
      {IconRight && (
        <IconRight size={s.icon} strokeWidth={STROKE} aria-hidden className="-mr-0.5 shrink-0 opacity-80" />
      )}
    </span>
  );
}

export function IconTile({
  icon: Icon,
  tone = "primary",
  size = 36,
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--pv-r-lg)]",
        TONE[tone].soft,
        TONE[tone].text,
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.47)} strokeWidth={STROKE} />
    </span>
  );
}

export function Badge({
  tone = "neutral",
  dot = false,
  icon: Icon,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex h-[22px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--pv-r-full)] px-2",
        TONE[tone].soft,
        TONE[tone].text,
        className,
      )}
      style={type("xs", "medium")}
    >
      {dot && <span aria-hidden className={cx("size-1.5 shrink-0 rounded-full", TONE[tone].solid)} />}
      {Icon && <Icon size={12} strokeWidth={2} aria-hidden className="-ml-0.5 shrink-0" />}
      {children}
    </span>
  );
}

export function Avatar({
  name,
  tone = "primary",
  size = 32,
  text = "xs",
  className,
}: {
  name: string;
  tone?: Tone | "brand";
  size?: number;
  text?: SizeKey;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const brand = tone === "brand";
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex shrink-0 select-none items-center justify-center rounded-[var(--pv-r-full)]",
        brand ? "text-[var(--pv-on-brand)]" : cx(TONE[tone].soft, TONE[tone].text),
        className,
      )}
      style={{
        width: size,
        height: size,
        ...type(text, "semibold"),
        lineHeight: 1,
        ...(brand ? { backgroundImage: brandGradient() } : null),
      }}
    >
      {initials}
    </span>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cx(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[var(--pv-r-sm)] border border-[var(--pv-border)]",
        "bg-[var(--pv-surface)] px-1 text-[var(--pv-text-3)] shadow-[0_1px_0_var(--pv-border)]",
        className,
      )}
      style={{ ...type("xs", "medium", "mono"), lineHeight: 1 }}
    >
      {children}
    </kbd>
  );
}

export function Switch({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-[var(--pv-r-full)] p-0.5",
        "transition-colors duration-[var(--pv-dur)] ease-[var(--pv-ease)]",
        on ? "bg-[var(--pv-primary)]" : "bg-[var(--pv-track)]",
        className,
      )}
    >
      <span
        className={cx(
          "size-4 rounded-[var(--pv-r-full)] shadow-[var(--pv-sh-sm)]",
          "transition-transform duration-[var(--pv-dur-slow)] ease-[var(--pv-spring)]",
          on ? "translate-x-4 bg-[var(--pv-on-primary)]" : "bg-white",
        )}
      />
    </span>
  );
}

export function Checkbox({ state, className }: { state: "on" | "off" | "mixed"; className?: string }) {
  const filled = state !== "off";
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-[var(--pv-r-sm)]",
        TX,
        filled
          ? "bg-[var(--pv-primary)] text-[var(--pv-on-primary)]"
          : "border border-[var(--pv-border)] bg-[var(--pv-surface)] shadow-[var(--pv-sh-xs)]",
        className,
      )}
    >
      {state === "on" && <Check size={12} strokeWidth={3} />}
      {state === "mixed" && <Minus size={12} strokeWidth={3} />}
    </span>
  );
}

export function Radio({ on, className }: { on: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full",
        TX,
        on ? "bg-[var(--pv-primary)]" : "border border-[var(--pv-border)] bg-[var(--pv-surface)]",
        className,
      )}
    >
      {on && <span className="size-1.5 rounded-full bg-[var(--pv-on-primary)]" />}
    </span>
  );
}

export function Progress({ value, tone = "primary", className }: { value: number; tone?: Tone; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("block h-1.5 overflow-hidden rounded-[var(--pv-r-full)] bg-[var(--pv-track)]", className)}
    >
      <span
        className={cx(
          "block h-full origin-left rounded-[var(--pv-r-full)] animate-[pv-grow-x_var(--pv-dur-slower)_var(--pv-ease)_both]",
          TONE[tone].solid,
        )}
        style={{ width: `${value}%` }}
      />
    </span>
  );
}

const SPARK_COLOR: Record<Tone, string> = {
  primary: "var(--pv-primary)",
  accent: "var(--pv-accent)",
  success: "var(--pv-success)",
  warning: "var(--pv-warning)",
  error: "var(--pv-error)",
  info: "var(--pv-info)",
  neutral: "var(--pv-neutral)",
};

export function Sparkline({
  data,
  tone = "primary",
  domain,
  className,
}: {
  data: number[];
  tone?: Tone;
  domain?: [number, number];
  className?: string;
}) {
  const id = useSvgId("spark");
  const [min, max] = domain ?? [Math.min(...data), Math.max(...data)];
  const pts = toPoints(data, min, max, 10);
  const color = SPARK_COLOR[tone];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className={cx("overflow-visible", className)}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" style={{ stopColor: color, stopOpacity: 0.24 }} />
          <stop offset="1" style={{ stopColor: color, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={areaPath(pts)} fill={`url(#${id})`} />
      <path
        d={smoothPath(pts)}
        fill="none"
        style={{ stroke: color }}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Segmented({
  options,
  value,
  size = "md",
  className,
}: {
  options: string[];
  value: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-0.5 rounded-[var(--pv-r-lg)] bg-[var(--pv-sunken)] p-0.5",
        size === "sm" ? "h-7" : "h-8",
        className,
      )}
    >
      {options.map((option) => {
        const active = option === value;
        return (
          <span
            key={option}
            className={cx(
              "inline-flex h-full items-center whitespace-nowrap rounded-[var(--pv-r-md)]",
              size === "sm" ? "px-2" : "px-2.5",
              TX,
              active
                ? "bg-[var(--pv-raised)] text-[var(--pv-text)] shadow-[var(--pv-sh-xs),0_0_0_1px_var(--pv-border)]"
                : "text-[var(--pv-text-3)] hover:text-[var(--pv-text)]",
            )}
            style={type("xs", active ? "semibold" : "medium")}
          >
            {option}
          </span>
        );
      })}
    </span>
  );
}
