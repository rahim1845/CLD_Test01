import { useId } from "react";

/** ThemeForge mark: a tonal ramp rising from one corner, the way a color scale fans out from its base. */
export function LogoMark({ size = 22, className }: { size?: number; className?: string }) {
  const clipId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <clipPath id={clipId}>
          <rect width="24" height="24" rx="6.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="24" height="24" fill="#16161c" />
        <circle cx="5" cy="19" r="16.5" fill="#8b7cff" fillOpacity="0.18" />
        <circle cx="5" cy="19" r="12" fill="#8b7cff" fillOpacity="0.5" />
        <circle cx="5" cy="19" r="7.5" fill="#8b7cff" />
        <circle cx="5" cy="19" r="4" fill="#ededf0" />
      </g>
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" stroke="rgba(255,255,255,0.14)" />
    </svg>
  );
}
