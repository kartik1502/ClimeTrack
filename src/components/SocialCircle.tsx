import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { FriendImpactProfile, FootprintData } from "../types";
import { 
  Copy, 
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  Share2, 
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Send,
  Download,
  Palette,
  Check,
  Image as ImageIcon
} from "lucide-react";

interface SocialCircleProps {
  friendProfiles: FriendImpactProfile[];
  addFriendProfile: (profile: FriendImpactProfile) => void;
  userFootprint: FootprintData;
  monthlyTotal: number;
  completedActionsCount: number;
}

export default function SocialCircle({
  userFootprint,
  monthlyTotal,
  completedActionsCount
}: SocialCircleProps) {
  // Carousel Creator state
  const slideRef = useRef<HTMLDivElement>(null);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [activePlatform, setActivePlatform] = useState<"instagram" | "facebook" | "linkedin" | "twitter" | "whatsapp">("instagram");
  const [activeThemeIdx, setActiveThemeIdx] = useState<number>(0);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  const completedCount = completedActionsCount;
  const selfAnnualEmissions = Math.round(monthlyTotal * 12);

  // High-fidelity Slide PNG Exporter
  const handleDownloadSlideImage = async () => {
    if (!slideRef.current) return;
    
    setIsDownloadingImage(true);
    try {
      // Small delay to ensure styles and layouts are polished
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(slideRef.current, {
        cacheBust: true,
        quality: 1.0,
        backgroundColor: "transparent",
        pixelRatio: 2, // Scale rendering to produce crisp, high-resolution social-ready images
        style: {
          margin: "0",
          transform: "scale(1)",
        }
      });
      
      const link = document.createElement("a");
      link.download = `climetrack_slide_${slideIndex + 1}_theme_${SLIDE_THEMES[activeThemeIdx].id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate or download slide image:", error);
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Category emissions breakdown calculations (dynamic on-the-fly client side, no AI)
  const computeEmissionsBreakdown = () => {
    const electricityCo2 = userFootprint.electricityUsage * 0.38;
    const gasCo2 = userFootprint.gasUsage * 5.3;
    const carCo2 = userFootprint.carEfficiency > 0 ? (userFootprint.carDistance / userFootprint.carEfficiency) * 2.31 : 0;
    
    let bikeCo2 = 0;
    if (userFootprint.bikeCc && userFootprint.bikeCc !== "none" && userFootprint.bikeDistance > 0) {
      const bikeFactors = {
        "under-125": 0.045,
        "125-250": 0.065,
        "250-500": 0.09,
        "over-500": 0.13,
        "none": 0
      };
      const factor = bikeFactors[userFootprint.bikeCc] || 0;
      bikeCo2 = userFootprint.bikeDistance * factor;
    }

    const publicTransitCo2 = userFootprint.publicTransitDistance * 0.08;
    const flightCo2 = (userFootprint.flightHours * 150) / 12;

    const dietMultipliers = { vegan: 125, vegetarian: 141, balanced: 183, "meat-heavy": 275 };
    const dietCo2 = dietMultipliers[userFootprint.dietType] || 183;

    const shoppingMultipliers = { minimalist: 50, moderate: 120, shopaholic: 250 };
    const shoppingCo2 = shoppingMultipliers[userFootprint.shoppingHabits] || 120;

    const totalMobility = carCo2 + bikeCo2 + publicTransitCo2 + flightCo2;
    const totalEnergy = electricityCo2 + gasCo2;
    const totalHabits = dietCo2 + shoppingCo2;

    const total = totalMobility + totalEnergy + totalHabits;
    if (total === 0) return { mobilityPct: 33, energyPct: 33, habitsPct: 34 };

    return {
      mobilityPct: (totalMobility / total) * 100,
      energyPct: (totalEnergy / total) * 100,
      habitsPct: (totalHabits / total) * 100,
    };
  };

  const { mobilityPct, energyPct, habitsPct } = computeEmissionsBreakdown();

  const SLIDE_THEMES = [
    {
      id: "forest",
      name: "Forest Shadow",
      bg: "bg-gradient-to-br from-[#0c1f15] via-[#143221] to-[#1d422d]",
      text: "text-emerald-50",
      accent: "text-[#2ECC71]",
      border: "border-emerald-800/40",
      accentBg: "bg-[#2ECC71]/10",
      accentBorder: "border-[#2ECC71]/20",
      pill: "bg-[#2ECC71]/15 text-[#2ECC71]"
    },
    {
      id: "cosmic",
      name: "Midnight Space",
      bg: "bg-gradient-to-br from-[#0A0D1A] via-[#131930] to-[#1B2342]",
      text: "text-blue-50",
      accent: "text-blue-400",
      border: "border-blue-900/40",
      accentBg: "bg-blue-500/10",
      accentBorder: "border-blue-500/20",
      pill: "bg-blue-500/15 text-blue-400"
    },
    {
      id: "sunset",
      name: "Sunset Warmth",
      bg: "bg-gradient-to-br from-[#1c1214] via-[#331c21] to-[#452329]",
      text: "text-rose-50",
      accent: "text-rose-400",
      border: "border-rose-950/40",
      accentBg: "bg-rose-500/10",
      accentBorder: "border-rose-500/20",
      pill: "bg-rose-500/15 text-rose-400"
    },
    {
      id: "slate",
      name: "Eco Tech Slate",
      bg: "bg-gradient-to-br from-[#121212] via-[#222222] to-[#2d2d2d]",
      text: "text-white",
      accent: "text-[#2ECC71]",
      border: "border-white/10",
      accentBg: "bg-white/5",
      accentBorder: "border-white/10",
      pill: "bg-[#2ECC71]/10 text-[#2ECC71]"
    }
  ];

  const currentTheme = SLIDE_THEMES[activeThemeIdx];

  const getCustomCaption = (platform: string): string => {
    const tons = (selfAnnualEmissions / 1000).toFixed(1);
    
    switch (platform) {
      case "instagram":
        return `🌿 TRACKING ZERO: My Net-Zero footprint is down to ${tons} Tons of CO₂ annually! 📉 \n\nI've already solved ${completedCount} climate action items using ClimeTrack. Small daily choices like diet adjustments and energy efficiency really accumulate. Check out my carbon slide deck and join the zero-emissions movement! 🌎\n\n#ClimeTrack #NetZero #Sustainability #GoGreen #ClimateAction #CarbonFootprint #EcoWarrior`;

      case "facebook":
        return `🌎 We're racing toward a Net-Zero future, and I just compiled my annual carbon emission profile on ClimeTrack! \n\nMy current annual emissions indicator is ${selfAnnualEmissions.toLocaleString()} kg CO₂ (${tons} Tons/Yr), with ${completedCount} key dynamic climate modifications completed! Check out my 5-slide progress report! \n\nJoin our green movement today! 🌱`;

      case "linkedin":
        return `💼 Personal ESG & Decarbonization Update: \nI'm proud to share my transparent carbon lifestyle audit score generated via ClimeTrack. \n\n📉 Annual Baseline: ${tons} Metric Tons CO₂/yr\n✅ Environmental Actions Audited: ${completedCount}\n🥕 Diet Strategy: Minimalist/Planetary approach\n\nPersonal behavioral transitions play a pivotal role in decentralized resource conservation. Let's connect on environmental efficiency.`;

      case "twitter":
        return `My annual footprint indicator is down to ${tons} Tons of CO₂ with ${completedCount} sustainable challenges cleared on ClimeTrack! Check out my slide summary deck! 📉🌿 #EcoFriendly #NetZero`;

      case "whatsapp":
        return `Hey! I just checked my carbon footprint on ClimeTrack:\n📉 Annual CO2: ${selfAnnualEmissions.toLocaleString()} kg (${tons} Tons/Yr)\n🌱 Diet category: ${userFootprint.dietType}\n✅ Action checkpoints completed: ${completedCount}\n\nDownload ClimeTrack to calculate your footprint too!`;

      default:
        return "";
    }
  };

  const handleDownloadSlideSummary = () => {
    const textContent = `--- CLIMETRACK SOCIAL POST SLIDES ---
[SLIDE 1: COVER]
Title: Pathway to Net-Zero
Emissions: ${(selfAnnualEmissions / 1000).toFixed(1)} Tons CO₂ annually
Status: Eco-conscious Pioneer

[SLIDE 2: BREAKDOWN]
Mobility sector: ${Math.round(mobilityPct)}%
Household utility power: ${Math.round(energyPct)}%
Consumer diet & lifestyle: ${Math.round(habitsPct)}%

[SLIDE 3: CHECKPOINTS COMPLETED]
Challenges completed: ${completedCount} Actions Completed
Micro-habits commitment: Active state tracker enabled

[SLIDE 4: THE ECO RATING]
Diet type: ${userFootprint.dietType.toUpperCase()}
Waste mitigation factor: ${userFootprint.wasteRecyclingRate}%
Rating grade: ${completedCount > 5 ? "A+ Excellence" : completedCount > 2 ? "B- Steady" : "C Eco Aspirant"}

[SLIDE 5: OUR PLEDGE]
Sustainable Commitment: Lowering emissions, supporting green energy grids, and encouraging clean alternatives.
Status: Verification Completed

------------------------------------
Exported securely via ClimeTrack. Built for an authentic zero-emissions trajectory.`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `climetrack_slides_export.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="social-circle-module" className="space-y-8 animate-fade-in text-[#e0e0e0]">
      
      {/* Interactive Slideshow Carousel Builder */}
      <div id="social-slideshow-creator" className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
        <div id="slideshow-header" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
          <div>
            <h3 id="slideshow-title" className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2ECC71] block" /> 🎨 Social Post & Slide Carousel Creator
            </h3>
            <p id="slideshow-subtitle" className="text-xs text-white/40">Design a 5-slide shareable carousel containing your carbon indicators and milestones.</p>
          </div>
          
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto max-w-full">
            <span className="text-[10px] uppercase font-bold text-white/30 font-mono flex items-center gap-1 shrink-0">
              <Palette className="w-3.5 h-3.5 text-white/40" /> Theme:
            </span>
            {SLIDE_THEMES.map((theme, i) => (
              <button
                key={theme.id}
                onClick={() => setActiveThemeIdx(i)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeThemeIdx === i
                    ? "bg-white text-black font-extrabold shadow-sm"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Smartphone Style Instagrid Carousel Box */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-white/30 font-mono tracking-wider">Slide Layout Preview</span>
            </div>
            
            <div 
              ref={slideRef}
              id="active-carousel-card" 
              className={`aspect-square w-full max-w-[340px] mx-auto rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 relative border ${currentTheme.bg} ${currentTheme.border} ${currentTheme.text}`}
            >
              {/* Header Banner */}
              <div className="flex items-center justify-between font-mono text-[9px] font-bold text-white/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] animate-pulse" />
                  <span>SLIDE {slideIndex + 1} OF 5</span>
                </div>
                <div className="uppercase tracking-widest text-[#2ECC71]">CLIMETRACK</div>
              </div>

              {/* Slides */}
              <div className="my-auto py-2">
                {slideIndex === 0 && (
                  <div className="space-y-4 text-center animate-fade-in">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${currentTheme.pill}`}>
                      Pathway to Net-Zero
                    </span>
                    <h4 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif uppercase text-white leading-tight">
                      My Carbon Roadmap
                    </h4>
                    <div className="py-2">
                      <div className="text-3xl font-mono font-extrabold text-[#2ECC71] leading-none">
                        {((selfAnnualEmissions) / 1000).toFixed(1)} <span className="text-base font-sans font-light text-white/70">Tons</span>
                      </div>
                      <p className="text-[9px] text-white/40 uppercase tracking-wider font-mono mt-0.5">Annual Greenhouse Footprint</p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed italic max-w-[240px] mx-auto font-serif">
                      "Optimizing micro-habits and utility grids to target zero personal emissions."
                    </p>
                  </div>
                )}

                {slideIndex === 1 && (
                  <div className="space-y-3.5 animate-fade-in">
                    <div className="text-center mb-1">
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${currentTheme.pill}`}>
                        Carbon Breakdown
                      </span>
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-white mt-1.5">My Emission Profile</h4>
                    </div>

                    <div className="space-y-2">
                      {/* Mobility */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                          <span className="text-white/60">Mobility (Commute / Flight)</span>
                          <span className="text-white">{Math.round(mobilityPct)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.max(5, mobilityPct)}%` }} />
                        </div>
                      </div>

                      {/* Utilities */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                          <span className="text-white/60">Utilities (Power / Heat)</span>
                          <span className="text-white">{Math.round(energyPct)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.max(5, energyPct)}%` }} />
                        </div>
                      </div>

                      {/* Lifestyle */}
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono">
                          <span className="text-white/60">Retail Habits & Diet</span>
                          <span className="text-white">{Math.round(habitsPct)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.max(5, habitsPct)}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {slideIndex === 2 && (
                  <div className="space-y-3.5 text-center animate-fade-in">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${currentTheme.pill}`}>
                      Action Challenges
                    </span>
                    
                    <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/10">
                      <Trophy className="w-4.5 h-4.5 text-amber-500" />
                    </div>

                    <h4 className="text-xs font-extrabold uppercase text-white tracking-wide">
                      Micro-Actions Logged
                    </h4>

                    <div className="inline-flex items-baseline gap-1 bg-black/20 px-3.5 py-1 rounded-2xl border border-white/5">
                      <span className="text-xl font-mono font-extrabold text-[#2ECC71]">{completedCount}</span>
                      <span className="text-[10px] text-white/50">Challenges Cleared</span>
                    </div>

                    <p className="text-[10px] text-white/60 max-w-[220px] mx-auto leading-relaxed">
                      Committing to residential electricity saving, smart dietary pathways, and optimized mobility.
                    </p>
                  </div>
                )}

                {slideIndex === 3 && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="text-center">
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${currentTheme.pill}`}>
                        Lifestyle Profile
                      </span>
                      <h4 className="text-xs font-extrabold uppercase text-white mt-1.5 tracking-wide">My Eco Efficiency</h4>
                    </div>

                    <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center pb-1 border-b border-white/5">
                        <span className="text-white/40 font-mono text-[9px] uppercase">Diet Choice</span>
                        <span className="font-extrabold text-white capitalize">{userFootprint.dietType}</span>
                      </div>
                      <div className="flex justify-between items-center pb-1 border-b border-white/5">
                        <span className="text-white/40 font-mono text-[9px] uppercase">Recycling Quotient</span>
                        <span className="font-extrabold text-white">{userFootprint.wasteRecyclingRate}% rate</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 font-mono text-[9px] uppercase">ClimeTrack Score</span>
                        <span className="font-extrabold text-[#2ECC71] uppercase">
                          {completedCount > 5 ? "🎖️ A+ Champion" : completedCount > 2 ? "🚴 B- Steady" : "🌱 C Pioneer"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {slideIndex === 4 && (
                  <div className="space-y-3.5 text-center animate-fade-in">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${currentTheme.pill}`}>
                      Green Commitment
                    </span>
                    
                    <h4 className="text-xs font-extrabold uppercase text-white tracking-widest">
                      Our Climate Pledge
                    </h4>

                    <p className="text-[10px] text-white/50 leading-relaxed max-w-[220px] mx-auto">
                      "I commit to lowering emissions, supporting green energy grids, and encouraging clean alternatives."
                    </p>

                    <div className="inline-flex items-center gap-1.5 bg-[#2ECC71]/15 border border-[#2ECC71]/30 text-[#2ECC71] font-mono text-[9px] px-3 py-1 rounded-xl mx-auto">
                      <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED ZERO PLEDGE
                    </div>
                  </div>
                )}
              </div>

              {/* Indicator dots */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        slideIndex === idx ? "bg-[#2ECC71] w-3" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] text-white/30 tracking-wider">
                  CLIMETRACK CAMPAIGN
                </span>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSlideIndex(idx => Math.max(0, idx - 1))}
                disabled={slideIndex === 0}
                className="bg-white/5 hover:bg-white/10 disabled:bg-white/0 disabled:opacity-25 border border-white/10 p-1.5 rounded-lg text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 block" />
              </button>
              <span className="text-xs font-bold font-mono text-white/60">{slideIndex + 1} / 5</span>
              <button
                type="button"
                onClick={() => setSlideIndex(idx => Math.min(4, idx + 1))}
                disabled={slideIndex === 4}
                className="bg-white/5 hover:bg-white/10 disabled:bg-white/0 disabled:opacity-25 border border-white/10 p-1.5 rounded-lg text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 block" />
              </button>
            </div>

            {/* Quick Export Slide Image button */}
            <div className="text-center pt-1">
              <button
                type="button"
                disabled={isDownloadingImage}
                onClick={handleDownloadSlideImage}
                className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-[#2ECC71] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {isDownloadingImage ? "Generating Image PNG..." : `Download Slide ${slideIndex + 1} as Image (PNG)`}
              </button>
            </div>
          </div>

          {/* Social Platform Formatter */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">1. Choose Target Platform Format</span>
              <div className="flex flex-wrap gap-2">
                
                <button
                  type="button"
                  onClick={() => {
                    setActivePlatform("instagram");
                    setCopiedCaption(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                    activePlatform === "instagram"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-pink-500/10 shadow-md font-extrabold"
                      : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePlatform("facebook");
                    setCopiedCaption(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                    activePlatform === "facebook"
                      ? "bg-[#1877F2] text-white border-transparent shadow-md font-extrabold"
                      : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePlatform("linkedin");
                    setCopiedCaption(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                    activePlatform === "linkedin"
                      ? "bg-[#0077B5] text-white border-transparent shadow-md font-extrabold"
                      : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePlatform("twitter");
                    setCopiedCaption(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                    activePlatform === "twitter"
                      ? "bg-white text-black border-transparent shadow-md font-extrabold"
                      : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter / X
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActivePlatform("whatsapp");
                    setCopiedCaption(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                    activePlatform === "whatsapp"
                      ? "bg-[#25D366] text-black border-transparent shadow-md font-extrabold"
                      : "bg-white/5 text-white/60 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> WhatsApp
                </button>

              </div>
            </div>

            {/* Custom caption text area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">2. Tailored Platform Caption</span>
                {copiedCaption && (
                  <span className="text-[10px] text-[#2ECC71] font-bold font-mono animate-fade-in flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </span>
                )}
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={6}
                  value={getCustomCaption(activePlatform)}
                  className="w-full bg-[#090909]/60 border border-white/10 rounded-xl p-3 text-xs text-white/80 font-sans focus:outline-none"
                />
                
                <div className="absolute bottom-2.5 right-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const text = getCustomCaption(activePlatform);
                      navigator.clipboard.writeText(text);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#2ECC71] hover:bg-[#25a259] text-black font-extrabold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Caption
                  </button>
                </div>
              </div>
            </div>

            {/* Slide Downloader & simulated tracker */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">3. Export Slide Deliverables</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <button
                  type="button"
                  disabled={isDownloadingImage}
                  onClick={handleDownloadSlideImage}
                  className="py-2.5 px-3 bg-[#2ECC71] hover:bg-[#25a259] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> {isDownloadingImage ? "Rendering..." : "Download Slide Image"}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSlideSummary}
                  className="py-2.5 px-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                >
                  <Download className="w-3.5 h-3.5" /> Slides TXT Outline
                </button>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

