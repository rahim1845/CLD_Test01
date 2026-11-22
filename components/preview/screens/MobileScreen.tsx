"use client";

import React, { memo } from "react";
import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
  dark: boolean;
}

const MobileScreen = memo(function MobileScreen({ theme, dark }: Props) {
  const { color, radius, shadow, typography } = theme;

  const bg = dark ? color.surface.background : color.neutral[50];
  const card = dark ? color.surface.card : "#ffffff";
  const border = dark ? color.surface.border : color.neutral[200];
  const textPrimary = dark ? color.text.primary : color.neutral[900];
  const textSecondary = dark ? color.text.secondary : color.neutral[500];
  const textTertiary = dark ? color.text.tertiary : color.neutral[400];

  const quickActions = [
    { icon: "↑", label: "Send" },
    { icon: "↓", label: "Receive" },
    { icon: "⊕", label: "Add" },
    { icon: "◈", label: "Analytics" },
  ];

  const activity = [
    { icon: "▲", title: "Stripe Payment", sub: "Subscription · Pro", amount: "+$890", up: true },
    { icon: "▼", title: "AWS Invoice", sub: "Infrastructure · Mar", amount: "-$240", up: false },
    { icon: "▲", title: "New Client", sub: "Onboarding · Acme", amount: "+$4,200", up: true },
    { icon: "◎", title: "Refund", sub: "Customer · Initech", amount: "-$49", up: false },
  ];

  const tabs = ["Home", "Charts", "Wallet", "Profile"];

  return (
    <div className="flex items-center justify-center h-full py-4" style={{ background: dark ? "#030306" : "#e5e7eb" }}>
      {/* Phone frame */}
      <div
        className="relative w-[220px] flex-shrink-0 overflow-hidden flex flex-col"
        style={{
          height: "460px",
          background: bg,
          borderRadius: "28px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
          fontFamily: typography.fontFamily.body,
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <span className="text-[10px] font-semibold" style={{ color: textPrimary }}>9:41</span>
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5 items-end h-3">
              {[2,3,4,5].map(h => <div key={h} className="w-0.5 rounded-sm" style={{ height: `${h * 2}px`, background: textPrimary }} />)}
            </div>
            <span className="text-[10px]" style={{ color: textPrimary }}>⊕</span>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 flex-shrink-0">
          <div>
            <p className="text-[10px]" style={{ color: textTertiary }}>Good morning,</p>
            <p className="font-bold text-sm leading-tight" style={{ color: textPrimary, fontFamily: typography.fontFamily.display }}>Alex Chen</p>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold relative" style={{ background: `linear-gradient(135deg, ${color.primary[500]}, ${color.accent[500]})`, borderRadius: radius.full }}>
            A
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full border" style={{ background: color.semantic.success, borderColor: bg }} />
          </div>
        </div>

        {/* Hero card */}
        <div
          className="mx-3 p-4 rounded-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${color.primary[600]}, ${color.primary[800]})`,
            borderRadius: radius["2xl"],
            boxShadow: shadow.lg,
          }}
        >
          <p className="text-[10px] mb-1" style={{ color: color.primary[300] }}>Total Revenue</p>
          <p className="font-bold text-xl leading-none" style={{ color: color.text.onPrimary, fontFamily: typography.fontFamily.display }}>$48,200</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${color.primary[400]}30`, color: color.primary[200], borderRadius: radius.full }}>↑ 12.5% this month</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-3 mt-3 flex-shrink-0">
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style={{ background: `${color.primary[500]}20`, color: color.primary[400], borderRadius: radius.xl }}>
                  {a.icon}
                </div>
                <span className="text-[9px]" style={{ color: textTertiary }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="flex-1 px-3 mt-3 overflow-hidden">
          <p className="text-[10px] font-semibold mb-2" style={{ color: textPrimary }}>Recent Activity</p>
          <div className="space-y-2">
            {activity.map((item) => (
              <div key={item.title} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs" style={{ background: item.up ? color.semantic.successBg : color.semantic.errorBg, color: item.up ? color.semantic.success : color.semantic.error, borderRadius: radius.full }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium truncate" style={{ color: textPrimary }}>{item.title}</p>
                  <p className="text-[9px] truncate" style={{ color: textTertiary }}>{item.sub}</p>
                </div>
                <span className="text-[10px] font-semibold flex-shrink-0" style={{ color: item.up ? color.semantic.success : color.semantic.error }}>{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tab bar */}
        <div className="flex-shrink-0 flex items-center justify-around py-3 px-2" style={{ borderTop: `1px solid ${border}`, background: card }}>
          {tabs.map((tab, i) => (
            <div key={tab} className="flex flex-col items-center gap-0.5">
              <div className="w-1 h-1 rounded-full" style={{ background: i === 0 ? color.primary[500] : "transparent" }} />
              <span className="text-[9px] font-medium" style={{ color: i === 0 ? color.primary[400] : textTertiary }}>{tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MobileScreen;
