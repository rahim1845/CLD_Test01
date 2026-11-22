"use client";

import React, { memo, useState } from "react";
import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
  dark: boolean;
}

const SettingsScreen = memo(function SettingsScreen({ theme, dark }: Props) {
  const { color, radius, shadow, typography } = theme;
  const [toggles, setToggles] = useState([true, false, true]);

  const bg = dark ? color.surface.background : color.neutral[50];
  const card = dark ? color.surface.card : "#ffffff";
  const border = dark ? color.surface.border : color.neutral[200];
  const textPrimary = dark ? color.text.primary : color.neutral[900];
  const textSecondary = dark ? color.text.secondary : color.neutral[500];
  const textTertiary = dark ? color.text.tertiary : color.neutral[400];

  const navSections = [
    { title: "Account", items: ["Profile", "Security", "Billing"] },
    { title: "Workspace", items: ["General", "Members", "Integrations"] },
    { title: "Developer", items: ["API Keys", "Webhooks", "OAuth"] },
  ];

  const notifLabels = ["Email digests", "Product updates", "Security alerts"];

  return (
    <div className="flex h-full overflow-hidden text-sm" style={{ background: bg, fontFamily: typography.fontFamily.body }}>
      {/* Left nav */}
      <div className="w-40 flex-shrink-0 p-3 space-y-4 overflow-y-auto preview-scroll" style={{ background: card, borderRight: `1px solid ${border}` }}>
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[9px] uppercase tracking-widest px-2 mb-1 font-medium" style={{ color: textTertiary }}>{section.title}</p>
            {section.items.map((item) => (
              <div
                key={item}
                className="px-2 py-1.5 rounded-lg text-xs cursor-pointer"
                style={{
                  color: item === "General" ? color.primary[400] : textSecondary,
                  background: item === "General" ? `${color.primary[500]}15` : "transparent",
                  borderRadius: radius.md,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 preview-scroll">
        {/* Workspace form card */}
        <div className="rounded-xl p-4 space-y-4" style={{ background: card, border: `1px solid ${border}`, borderRadius: radius.xl, boxShadow: shadow.sm }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: textPrimary }}>Workspace Settings</p>
            <p className="text-xs mt-0.5" style={{ color: textSecondary }}>Manage your workspace preferences</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["Workspace Name", "Display URL", "Industry", "Team Size"].map((label) => (
              <div key={label}>
                <label className="block text-xs mb-1 font-medium" style={{ color: textSecondary }}>{label}</label>
                <div className="px-3 py-2 rounded-lg text-xs" style={{ background: bg, border: `1px solid ${border}`, color: textPrimary, borderRadius: radius.md }}>
                  {label === "Workspace Name" ? "ThemeForge HQ" : label === "Industry" ? "SaaS / Design" : ""}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button className="px-4 py-1.5 text-xs font-medium text-white rounded-lg" style={{ background: color.primary[600], borderRadius: radius.md }}>Save changes</button>
            <button className="px-4 py-1.5 text-xs font-medium rounded-lg" style={{ background: bg, border: `1px solid ${border}`, color: textSecondary, borderRadius: radius.md }}>Discard</button>
          </div>
        </div>

        {/* Plan card with gradient */}
        <div
          className="rounded-xl p-4"
          style={{
            background: `linear-gradient(135deg, ${color.primary[900]}, ${color.primary[800]})`,
            border: `1px solid ${color.primary[700]}`,
            borderRadius: radius.xl,
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: color.primary[300] }}>Current Plan</p>
              <p className="font-bold text-base" style={{ color: color.text.onPrimary, fontFamily: typography.fontFamily.display }}>Pro Plan</p>
              <p className="text-xs mt-1" style={{ color: color.primary[300] }}>$89/month · Renews May 1, 2026</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: color.primary[500], color: color.text.onPrimary, borderRadius: radius.md }}>Upgrade</button>
          </div>
        </div>

        {/* Notification toggles */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: card, border: `1px solid ${border}`, borderRadius: radius.xl }}>
          <p className="font-semibold text-sm" style={{ color: textPrimary }}>Notifications</p>
          {notifLabels.map((label, i) => (
            <div key={label} className="flex items-center justify-between py-1.5" style={{ borderBottom: i < notifLabels.length - 1 ? `1px solid ${border}` : "none" }}>
              <div>
                <p className="text-xs font-medium" style={{ color: textPrimary }}>{label}</p>
                <p className="text-[10px]" style={{ color: textTertiary }}>Receive {label.toLowerCase()}</p>
              </div>
              <button
                onClick={() => setToggles((prev) => prev.map((v, j) => j === i ? !v : v))}
                className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
                style={{
                  background: toggles[i] ? color.primary[500] : border,
                  borderRadius: radius.full,
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                  style={{
                    left: toggles[i] ? "calc(100% - 18px)" : "2px",
                    borderRadius: radius.full,
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="rounded-xl p-4 space-y-3" style={{ background: card, border: `1px solid ${color.semantic.error}40`, borderRadius: radius.xl }}>
          <p className="font-semibold text-sm" style={{ color: color.semantic.error }}>Danger Zone</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: textPrimary }}>Delete workspace</p>
              <p className="text-[10px]" style={{ color: textTertiary }}>This action cannot be undone</p>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: `${color.semantic.error}15`, color: color.semantic.error, border: `1px solid ${color.semantic.error}40`, borderRadius: radius.md }}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default SettingsScreen;
