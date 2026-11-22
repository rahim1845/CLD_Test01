"use client";

import React, { memo } from "react";
import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
  dark: boolean;
}

const DashboardScreen = memo(function DashboardScreen({ theme, dark }: Props) {
  const { color, radius, shadow, typography } = theme;

  const bg = dark ? color.surface.background : color.neutral[50];
  const card = dark ? color.surface.card : "#ffffff";
  const border = dark ? color.surface.border : color.neutral[200];
  const textPrimary = dark ? color.text.primary : color.neutral[900];
  const textSecondary = dark ? color.text.secondary : color.neutral[500];
  const textTertiary = dark ? color.text.tertiary : color.neutral[400];

  const navItems = [
    { label: "Overview", active: true, icon: "▦" },
    { label: "Analytics", active: false, icon: "◈" },
    { label: "Customers", active: false, icon: "◎" },
    { label: "Revenue", active: false, icon: "◈" },
    { label: "Settings", active: false, icon: "⊙" },
  ];

  const kpis = [
    { label: "MRR", value: "$48,200", delta: "+12.5%", up: true },
    { label: "Active Users", value: "8,492", delta: "+3.2%", up: true },
    { label: "Churn Rate", value: "2.4%", delta: "-0.8%", up: true },
    { label: "NPS Score", value: "71", delta: "+4", up: true },
  ];

  const tableData = [
    { company: "Acme Corp", plan: "Enterprise", mrr: "$4,200", status: "active" },
    { company: "Globex", plan: "Pro", mrr: "$890", status: "active" },
    { company: "Initech", plan: "Starter", mrr: "$49", status: "trial" },
    { company: "Umbrella", plan: "Pro", mrr: "$890", status: "paused" },
  ];

  const statusStyle = (status: string) => {
    if (status === "active") return { bg: color.semantic.successBg, text: color.semantic.success, border: `${color.semantic.success}33` };
    if (status === "trial") return { bg: color.semantic.infoBg, text: color.semantic.info, border: `${color.semantic.info}33` };
    return { bg: color.semantic.warningBg, text: color.semantic.warning, border: `${color.semantic.warning}33` };
  };

  return (
    <div className="flex h-full text-sm overflow-hidden" style={{ background: bg, fontFamily: typography.fontFamily.body }}>
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 flex flex-col p-3 gap-4" style={{ background: card, borderRight: `1px solid ${border}` }}>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: color.primary[600], borderRadius: radius.md }}>T</div>
          <span className="font-semibold text-xs" style={{ color: textPrimary }}>ThemeForge</span>
        </div>

        <div className="space-y-0.5">
          <p className="text-[9px] uppercase tracking-widest px-2 mb-1" style={{ color: textTertiary }}>Main</p>
          {navItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors"
              style={{
                background: item.active ? `${color.primary[500]}20` : "transparent",
                color: item.active ? color.primary[400] : textSecondary,
                borderRadius: radius.md,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: `${color.primary[500]}15`, borderRadius: radius.md }}>
            <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color.primary[500]}, ${color.accent[500]})`, borderRadius: radius.full }} />
            <div>
              <p className="text-[10px] font-medium" style={{ color: textPrimary }}>Alex Chen</p>
              <p className="text-[9px]" style={{ color: textTertiary }}>Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0" style={{ borderBottom: `1px solid ${border}`, background: card }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: textPrimary }}>Overview</p>
            <p className="text-[10px]" style={{ color: textTertiary }}>April 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-medium text-white rounded-lg" style={{ background: color.primary[600], borderRadius: radius.lg }}>
              + New Report
            </button>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: `linear-gradient(135deg, ${color.primary[500]}, ${color.accent[500]})`, borderRadius: radius.full }}>A</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 preview-scroll">
          {/* KPI Grid */}
          <div className="grid grid-cols-4 gap-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="p-3 rounded-xl" style={{ background: card, border: `1px solid ${border}`, boxShadow: shadow.sm, borderRadius: radius.xl }}>
                <p className="text-[10px] mb-1" style={{ color: textTertiary }}>{kpi.label}</p>
                <p className="font-bold text-base leading-none mb-1.5" style={{ color: textPrimary, fontFamily: typography.fontFamily.display }}>{kpi.value}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: color.semantic.successBg, color: color.semantic.success, borderRadius: radius.full }}>{kpi.delta}</span>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-5 gap-3">
            {/* Bar chart */}
            <div className="col-span-3 p-3 rounded-xl" style={{ background: card, border: `1px solid ${border}`, borderRadius: radius.xl }}>
              <p className="text-xs font-semibold mb-3" style={{ color: textPrimary }}>Revenue Trend</p>
              <div className="flex items-end gap-2 h-20">
                {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                  <div key={i} className="flex-1 h-full flex flex-col items-center gap-1">
                    <div className="flex-1 w-full flex items-end">
                      <div
                        className="w-full rounded-t-md transition-all"
                        style={{
                          height: `${h}%`,
                          background: i === 6 ? color.primary[500] : `${color.primary[500]}40`,
                          borderRadius: `${radius.sm} ${radius.sm} 0 0`,
                        }}
                      />
                    </div>
                    <span className="text-[8px]" style={{ color: textTertiary }}>
                      {["M","T","W","T","F","S","S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut */}
            <div className="col-span-2 p-3 rounded-xl" style={{ background: card, border: `1px solid ${border}`, borderRadius: radius.xl }}>
              <p className="text-xs font-semibold mb-2" style={{ color: textPrimary }}>Plans</p>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={border} strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={color.primary[500]} strokeWidth="3" strokeDasharray="50 50" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={color.accent[500]} strokeWidth="3" strokeDasharray="30 70" strokeDashoffset="-50" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={color.neutral[600]} strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-80" />
                  </svg>
                </div>
                <div className="space-y-1">
                  {[
                    { label: "Enterprise", pct: "50%", color: color.primary[500] },
                    { label: "Pro", pct: "30%", color: color.accent[500] },
                    { label: "Starter", pct: "20%", color: color.neutral[600] },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-[9px]" style={{ color: textSecondary }}>{d.label}</span>
                      <span className="text-[9px] ml-auto" style={{ color: textTertiary }}>{d.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ background: card, border: `1px solid ${border}`, borderRadius: radius.xl }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${border}` }}>
              <p className="text-xs font-semibold" style={{ color: textPrimary }}>Top Accounts</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}` }}>
                  {["Company", "Plan", "MRR", "Status"].map((h) => (
                    <th key={h} className="text-left px-3 py-2 font-medium" style={{ color: textTertiary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => {
                  const s = statusStyle(row.status);
                  return (
                    <tr key={row.company} style={{ borderBottom: `1px solid ${border}` }}>
                      <td className="px-3 py-2 font-medium" style={{ color: textPrimary }}>{row.company}</td>
                      <td className="px-3 py-2" style={{ color: textSecondary }}>{row.plan}</td>
                      <td className="px-3 py-2 font-mono" style={{ color: textPrimary }}>{row.mrr}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium capitalize" style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: radius.full }}>{row.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DashboardScreen;
