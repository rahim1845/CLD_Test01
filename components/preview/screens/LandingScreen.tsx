"use client";

import React, { memo } from "react";
import type { ThemeTokens } from "@/types/theme";

interface Props {
  theme: ThemeTokens;
  dark: boolean;
}

const LandingScreen = memo(function LandingScreen({ theme, dark }: Props) {
  const { color, radius, shadow, typography } = theme;

  const bg = dark ? color.surface.background : color.neutral[50];
  const card = dark ? color.surface.card : "#ffffff";
  const border = dark ? color.surface.border : color.neutral[200];
  const textPrimary = dark ? color.text.primary : color.neutral[900];
  const textSecondary = dark ? color.text.secondary : color.neutral[500];
  const textTertiary = dark ? color.text.tertiary : color.neutral[400];

  const features = [
    { icon: "⬡", title: "AI-Powered", desc: "Generate complete design systems in seconds with state-of-the-art AI." },
    { icon: "◈", title: "Token System", desc: "Export to CSS, Tailwind, Figma Tokens, or any format your team uses." },
    { icon: "⊕", title: "Live Preview", desc: "See your theme applied to real UI components instantly, no refresh needed." },
  ];

  const pricingTiers = [
    { name: "Starter", price: "$0", desc: "For individuals", features: ["5 themes/month", "CSS export", "Basic preview"], featured: false },
    { name: "Pro", price: "$29", desc: "For teams", features: ["Unlimited themes", "All exports", "Priority AI", "Team sharing"], featured: true },
    { name: "Enterprise", price: "$99", desc: "Custom plans", features: ["SSO", "Custom AI training", "SLA", "Dedicated support"], featured: false },
  ];

  return (
    <div className="h-full overflow-y-auto preview-scroll text-sm" style={{ background: bg, fontFamily: typography.fontFamily.body }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-3" style={{ background: `${bg}e0`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg text-white text-xs font-bold flex items-center justify-center" style={{ background: color.primary[600], borderRadius: radius.md }}>T</div>
          <span className="font-bold text-sm" style={{ color: textPrimary, fontFamily: typography.fontFamily.display }}>ThemeForge</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-xs" style={{ color: textSecondary }}>
          {["Features", "Pricing", "Docs", "Blog"].map((l) => (
            <span key={l} className="hover:text-current cursor-pointer" style={{ color: textSecondary }}>{l}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg" style={{ color: textSecondary }}>Sign in</button>
          <button className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg" style={{ background: color.primary[600], borderRadius: radius.md }}>Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: `${color.primary[500]}20`, color: color.primary[400], border: `1px solid ${color.primary[500]}40`, borderRadius: radius.full }}>
          <span>✦</span> Now with streaming AI generation
        </div>
        <h1
          className="font-extrabold leading-tight mb-3"
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            color: textPrimary,
            fontFamily: typography.fontFamily.display,
          }}
        >
          Design tokens that{" "}
          <span style={{ color: color.accent[400] }}>actually ship</span>
        </h1>
        <p className="max-w-lg mx-auto mb-6 text-xs leading-relaxed" style={{ color: textSecondary }}>
          Generate complete, production-ready design systems from a simple description. Export to any format — CSS, Tailwind, Figma Tokens — in one click.
        </p>
        <div className="flex items-center justify-center gap-3 mb-8">
          <button className="px-5 py-2.5 text-xs font-semibold text-white rounded-xl" style={{ background: `linear-gradient(135deg, ${color.primary[600]}, ${color.accent[600]})`, borderRadius: radius.xl, boxShadow: shadow.md }}>
            Start for free →
          </button>
          <button className="px-5 py-2.5 text-xs font-medium rounded-xl" style={{ border: `1px solid ${border}`, color: textSecondary, borderRadius: radius.xl }}>
            View demo
          </button>
        </div>
        {/* Social proof */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {[color.primary[600], color.accent[600], color.primary[400], color.accent[400]].map((c, i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 text-[9px] font-bold text-white flex items-center justify-center" style={{ background: c, borderColor: bg }}>
                {["A","B","C","D"][i]}
              </div>
            ))}
          </div>
          <p className="text-[10px]" style={{ color: textTertiary }}>Trusted by <span style={{ color: textPrimary }}>2,400+</span> designers</p>
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-6" style={{ background: dark ? `${color.surface.card}80` : `${color.neutral[100]}80` }}>
        <p className="text-center text-[10px] uppercase tracking-widest mb-4 font-medium" style={{ color: textTertiary }}>Features</p>
        <div className="grid grid-cols-3 gap-3">
          {features.map((f) => (
            <div key={f.title} className="p-4 rounded-xl" style={{ background: card, border: `1px solid ${border}`, borderRadius: radius.xl }}>
              <div className="text-xl mb-2" style={{ color: color.primary[400] }}>{f.icon}</div>
              <p className="font-semibold text-xs mb-1" style={{ color: textPrimary }}>{f.title}</p>
              <p className="text-[10px] leading-relaxed" style={{ color: textTertiary }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-5 py-8">
        <p className="text-center text-[10px] uppercase tracking-widest mb-1 font-medium" style={{ color: textTertiary }}>Pricing</p>
        <p className="text-center font-bold text-base mb-5" style={{ color: textPrimary, fontFamily: typography.fontFamily.display }}>Simple, transparent pricing</p>
        <div className="grid grid-cols-3 gap-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className="p-4 rounded-xl relative"
              style={{
                background: tier.featured ? `linear-gradient(180deg, ${color.primary[900]}, ${color.surface.card})` : card,
                borderRadius: radius.xl,
                border: tier.featured ? `2px solid ${color.primary[500]}` : `1px solid ${border}`,
                boxShadow: tier.featured ? `0 0 20px ${color.primary[500]}30` : shadow.sm,
              }}
            >
              {tier.featured && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold text-white rounded-full" style={{ background: color.primary[500], borderRadius: radius.full }}>POPULAR</div>
              )}
              <p className="font-semibold text-xs mb-0.5" style={{ color: tier.featured ? color.primary[300] : textSecondary }}>{tier.name}</p>
              <p className="font-extrabold text-xl leading-none mb-0.5" style={{ color: tier.featured ? color.text.onPrimary : textPrimary, fontFamily: typography.fontFamily.display }}>{tier.price}<span className="text-xs font-normal">/mo</span></p>
              <p className="text-[9px] mb-3" style={{ color: textTertiary }}>{tier.desc}</p>
              <ul className="space-y-1.5 mb-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-[10px]" style={{ color: tier.featured ? color.primary[200] : textSecondary }}>
                    <span style={{ color: color.semantic.success }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-1.5 text-[10px] font-semibold rounded-lg"
                style={{
                  background: tier.featured ? color.primary[500] : `${color.primary[500]}15`,
                  color: tier.featured ? color.text.onPrimary : color.primary[400],
                  borderRadius: radius.md,
                }}
              >
                Get started
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export default LandingScreen;
