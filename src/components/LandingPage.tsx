import React from "react";
import { ArrowRight, Leaf, BarChart3, Award, Users, Globe, Flame, Shield, Compass } from "lucide-react";

interface LandingPageProps {
  onStartAudit: () => void;
  onGoToAnalytics: () => void;
  onGoToActions: () => void;
  onGoToSocial: () => void;
  monthlyTotal: number;
  totalSaved: number;
}

export default function LandingPage({
  onStartAudit,
  onGoToAnalytics,
  onGoToActions,
  onGoToSocial,
  monthlyTotal,
  totalSaved
}: LandingPageProps) {
  
  const features = [
    {
      id: "calculator",
      title: "Granular Climate Calculator",
      desc: "Perform a detailed audit of your electricity grids, gas usage, transport, and consumption metrics based on regional equivalents.",
      icon: Leaf,
      color: "text-[#2ECC71] bg-[#2ECC71]/10 border-[#2ECC71]/20",
      action: onStartAudit,
      actionText: "Audit emissions"
    },
    {
      id: "analytics",
      title: "Multi-Interval Trends & Savings",
      desc: "Visualize your footprint progress through daily, weekly, and monthly trend models with comparative actual-to-offset charting.",
      icon: BarChart3,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      action: onGoToAnalytics,
      actionText: "Analyze trendlines"
    },
    {
      id: "milestones",
      title: "Carbon Actions & Milestones",
      desc: "Commit to local micro-habits, complete high-difficulty target events, and unlock verified Net-Zero awards.",
      icon: Award,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      action: onGoToActions,
      actionText: "Commit to actions"
    },
    {
      id: "social",
      title: "Impact Circles & Peers",
      desc: "Connect your passport with friends, compare performance directly to global citizens, and share sustainable tips.",
      icon: Users,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
      action: onGoToSocial,
      actionText: "View peers"
    }
  ];

  const carbonFacts = [
    {
      metric: "1.5°C",
      title: "Global Heating Limit",
      desc: "The critical warming threshold established by international climate treaties to avert severe ecological impacts."
    },
    {
      metric: "2050",
      title: "Global Net-Zero Target",
      desc: "The target year for global emissions to match absorbed carbon via nature-based and engineered offsets."
    },
    {
      metric: "12,500 kg",
      title: "Typical Citizen Footprint",
      desc: "The estimated average annual carbon equivalent emission per capita in modern consumer economies."
    }
  ];

  return (
    <div id="landing-page-root" className="space-y-16 py-6 font-sans select-none animate-fade-in text-[#e0e0e0]">
      {/* 1. Hero Block */}
      <section id="landing-hero" className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-8 md:p-14 overflow-hidden">
        {/* Soft abstract ambient accent */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#2ECC71]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-full text-[#2ECC71] text-xxs font-mono tracking-wider font-bold uppercase">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#2ECC71]" />
            <span>Pathways to Net-Zero Carbon Alignment</span>
          </div>

          <h2 id="hero-main-title" className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-serif leading-tight">
            Navigate Your Unique Journey to <span className="text-[#2ECC71] italic">Net-Zero emissions</span>
          </h2>

          <p id="hero-description" className="text-sm md:text-base text-white/60 leading-relaxed font-sans font-light max-w-2xl">
            ClimeTrack integrates live energy matrices, detailed combustion factors, peer comparative metrics, and dynamic savings trends to support your daily transition to carbon-neutral living.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onStartAudit}
              className="px-6 py-3 bg-[#2ECC71] hover:bg-[#25a259] text-black font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-lg hover:shadow-[#2ECC71]/20 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Begin Footprint Audit</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
            <button
              onClick={onGoToAnalytics}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
            >
              View Analytics Dashboard
            </button>
          </div>
        </div>

        {/* Real-time Counter Grid overlaying current progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8 border-t border-white/5 relative z-10">
          <div className="bg-[#111111]/60 border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 block">Current Footprint Rate</span>
              <span className="text-xl md:text-2xl font-serif font-black text-white">{monthlyTotal} <span className="text-xs font-sans font-normal text-white/50">kg CO₂/mo</span></span>
            </div>
            <div className="text-xs font-serif italic text-white/30 hidden xs:block">Personal Live State</div>
          </div>
          <div className="bg-[#2ECC71]/5 border border-[#2ECC71]/20 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#2ECC71]/60 block">Estimate Cumulative Savings</span>
              <span className="text-xl md:text-2xl font-serif font-black text-[#2ECC71]">{totalSaved} <span className="text-xs font-sans font-normal text-[#2ECC71]/70">kg CO₂</span></span>
            </div>
            <div className="text-xs font-serif italic text-[#2ECC71]/30 hidden xs:block">Avoidative Offset Log</div>
          </div>
        </div>
      </section>

      {/* 2. core Pillars Section */}
      <section id="core-pillars" className="space-y-6">
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-lg font-serif font-bold text-white tracking-tight">Interactive Application Modules</h3>
          <p className="text-xs text-white/40">Launch specialized pathways designed to structure daily decarbonization milestones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.06] transition-all group"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${feat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white font-serif">{feat.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed font-sans">{feat.desc}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/20 font-bold">Module Indicator</span>
                  <button
                    onClick={feat.action}
                    className="text-xs font-bold text-[#2ECC71] hover:text-[#25a259] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Climate Facts Education Hub */}
      <section id="climate-scientific-hub" className="border-t border-white/5 pt-12">
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white font-serif">Global Climate Context & Scientific Targets</h3>
            <p className="text-xxs tracking-wider uppercase font-mono text-white/40">Understanding emissions to drive measurable individual action</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {carbonFacts.map((fact, idx) => (
              <div key={idx} className={`space-y-2 ${idx > 0 ? "pt-6 md:pt-0 md:pl-6" : ""}`}>
                <span className="text-3xl font-serif font-black text-white block leading-none">{fact.metric}</span>
                <span className="text-xs font-bold font-sans text-[#2ECC71] block">{fact.title}</span>
                <p className="text-xs text-white/50 leading-relaxed font-sans font-light">{fact.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 border border-white/5 text-xs text-white/60 leading-relaxed">
            <div className="p-3 bg-[#e67e22]/10 text-[#e67e22] border border-[#e67e22]/20 rounded-xl flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="font-bold text-white block">Scope 1 vs. Scope 3 Personal Framework</span>
              <p className="font-light text-white/50">
                While Scope 1 emissions represent your direct fuel combustion (car gas, household pipelines), Scope 3 includes everything embedded in diet production, electronics manufacture, fast-fashion shipping, and air flights. Targeting both categories ensures a holistic, credible path to net-zero status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Instant Action Challenge Card */}
      <section id="instant-action-challenge" className="bg-[#2ECC71]/5 border border-[#2ECC71]/20 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2ECC71] font-mono">
            <Flame className="w-4 h-4 text-[#2ECC71]" />
            <span>Today's Decarbonization Sprint</span>
          </div>
          <h4 className="text-base font-serif font-bold text-white leading-snug">
            Ready to log immediate avoided emissions?
          </h4>
          <p className="text-xs text-white/50 font-sans leading-relaxed">
            Use the floating green <span className="font-bold text-[#2ECC71]">+</span> button at the bottom-right of your screen from any view to instantly register a daily micro-action, like eating a plant-based lunch or setting an air dry load, for rapid CO₂ offset credits.
          </p>
        </div>
        <button
          onClick={onGoToActions}
          className="px-5 py-3 h-fit whitespace-nowrap bg-[#2ECC71]/15 hover:bg-[#2ECC71]/25 border border-[#2ECC71]/35 hover:border-[#2ECC71]/50 text-[#2ECC71] font-bold text-xs rounded-xl transition-all cursor-pointer self-start sm:self-center"
        >
          Explore All Action Items
        </button>
      </section>
    </div>
  );
}
