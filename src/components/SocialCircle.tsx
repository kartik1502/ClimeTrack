import React, { useState } from "react";
import { FriendImpactProfile, FootprintData } from "../types";
import { Copy, ArrowRight, UserPlus2, ShieldCheck, Trophy, Sparkles, AlertCircle, Share2, ClipboardCheck } from "lucide-react";

interface SocialCircleProps {
  friendProfiles: FriendImpactProfile[];
  addFriendProfile: (profile: FriendImpactProfile) => void;
  userFootprint: FootprintData;
  monthlyTotal: number;
  completedActionsCount: number;
}

export default function SocialCircle({
  friendProfiles,
  addFriendProfile,
  userFootprint,
  monthlyTotal,
  completedActionsCount
}: SocialCircleProps) {
  const [passportInput, setPassportInput] = useState<string>("");
  const [friendNameInput, setFriendNameInput] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Generate a shareable code (Base64 representation of custom profile object)
  const generatePassportCode = (): string => {
    const profileObj = {
      name: friendNameInput.trim() || "My Eco Passport",
      dietType: userFootprint.dietType,
      totalEmissions: Math.round(monthlyTotal * 12),
      completedActionsCount: completedCount
    };
    try {
      return btoa(JSON.stringify(profileObj));
    } catch (e) {
      return "";
    }
  };

  const completedCount = completedActionsCount;
  const selfAnnualEmissions = Math.round(monthlyTotal * 12);

  // Parse and import a friend's passport code
  const handleImportPassport = (e: React.FormEvent) => {
    e.preventDefault();
    setInputError("");
    if (!passportInput.trim()) return;

    try {
      const decodedStr = atob(passportInput.trim());
      const parsed = JSON.parse(decodedStr);

      if (!parsed.name || typeof parsed.totalEmissions !== "number") {
        throw new Error("Invalid structure");
      }

      // Add verified tag to imported friend
      const newFriend: FriendImpactProfile = {
        id: "imported_" + Date.now(),
        name: parsed.name,
        dietType: parsed.dietType || "balanced",
        totalEmissions: parsed.totalEmissions,
        completedActionsCount: parsed.completedActionsCount || 0,
        avatarColor: "from-blue-500 to-indigo-500"
      };

      addFriendProfile(newFriend);
      setPassportInput("");
    } catch (err) {
      setInputError("Failed to parse Carbon Passport. Ensure you pasted a valid encoded Passport code.");
    }
  };

  // Sort leaderboards (lower is better!)
  const sortedProfiles = [...friendProfiles, {
    id: "self_profile",
    name: "You (Current Config)",
    dietType: userFootprint.dietType,
    totalEmissions: selfAnnualEmissions,
    completedActionsCount: completedCount,
    avatarColor: "from-emerald-500 to-teal-500",
    isSelf: true
  }].sort((a, b) => a.totalEmissions - b.totalEmissions);

  // Copy code utility
  const handleCopyCode = () => {
    const code = generatePassportCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Copy share card overview text
  const handleCopyOverview = () => {
    const text = `🌱 ClimeTrack Climate Passport: Let's race to Net-Zero!
    My Annual footprint: ${selfAnnualEmissions} kg CO₂/yr
    Completed Actions: ${completedCount} eco-challenges
    Can you beat my score? Import my passport code: ${generatePassportCode()}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="social-circle-module" className="space-y-8 animate-fade-in text-[#e0e0e0]">
      
      {/* Intro Social Banner */}
      <div id="social-grid-wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Carbon Leaderboard Column */}
        <div id="leaderboard-column" className="lg:col-span-7 space-y-6">
          <div id="leaderboard-card" className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            
            <div id="leaderboard-header" className="mb-6">
              <h4 id="leaderboard-title" className="text-base font-bold text-white font-serif flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 block animate-bounce" /> Regional Eco-Leaderboard
              </h4>
              <p id="leaderboard-desc" className="text-xs text-white/40">Compare annual emissions directly against friends and sustainability benchmarks. Lower is better!</p>
            </div>

            {/* Profiles Leaderboard List */}
            <div id="leaderboard-list" className="space-y-3">
              {sortedProfiles.map((profile, index) => {
                const metricTons = (profile.totalEmissions / 1000).toFixed(1);
                const isUnderBenchmark = profile.totalEmissions < 8000; // < 8 tons
                
                return (
                  <div
                    key={profile.id}
                    id={`leaderboard-row-${profile.id}`}
                    className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      profile.isSelf
                        ? "bg-white/10 text-white border-white/20 shadow-xl scale-[1.01]"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    
                    {/* Rank number & avatar */}
                    <div id={`avatar-combo-${profile.id}`} className="flex items-center gap-3.5 min-w-0">
                      <div id={`rank-badge-${profile.id}`} className="w-6 text-center font-mono font-bold text-xs text-white/70">
                        {index === 0 && "🥇"}
                        {index === 1 && "🥈"}
                        {index === 2 && "🥉"}
                        {index > 2 && `${index + 1}.`}
                      </div>

                      <div id={`avatar-pictogram-${profile.id}`} className={`w-9 h-9 rounded-full bg-linear-to-tr ${profile.avatarColor} text-[#090909] flex items-center justify-center font-extrabold uppercase text-xs shrink-0 shadow-md`}>
                        {profile.name.substring(0, 2)}
                      </div>

                      <div id={`profile-summary-${profile.id}`} className="min-w-0">
                        <span className={`text-xs font-bold truncate block ${profile.isSelf ? "text-[#2ECC71]" : "text-white"}`}>
                          {profile.name} {profile.isSelf && " (You)"}
                        </span>
                        <p id={`profile-sub-${profile.id}`} className={`text-[10px] leading-none mt-1 ${profile.isSelf ? "text-white/40" : "text-white/40"}`}>
                          Diet: <span className="capitalize">{profile.dietType}</span> • {profile.completedActionsCount} completed
                        </p>
                      </div>
                    </div>

                    {/* Annual Output kilograms */}
                    <div id={`carbon-annual-stat-${profile.id}`} className="text-right shrink-0">
                      <span id={`val-ann-stat-${profile.id}`} className={`text-xs sm:text-sm font-mono font-bold block ${profile.isSelf ? "text-[#2ECC71]" : "text-white"}`}>
                        {profile.totalEmissions.toLocaleString()} <span className="text-[10px] font-normal text-white/40">kg</span>
                      </span>
                      <span id={`sub-ann-stat-${profile.id}`} className={`text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.2 rounded mt-1 inline-block ${
                        isUnderBenchmark
                          ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30"
                          : "bg-red-950/30 text-red-400 border border-red-900/30"
                      }`}>
                        {metricTons} Tons/Y
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Share Passport & Code Importer Column */}
        <div id="sharing-column" className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Share Passport Center */}
          <div id="passport-generator-card" className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h4 id="share-card-title" className="text-base font-bold text-white font-serif flex items-center gap-1.5 mb-2">
              <Share2 className="w-5 h-5 text-[#2ECC71] block" /> Share Your Eco Passport
            </h4>
            <p id="share-card-desc" className="text-xs text-white/40 mb-6">Create a travel passport code below so companions can import your numbers directly into their boards!</p>

            <div id="passport-input-group" className="space-y-4">
              <div id="group-friend-name">
                <label className="text-xxs font-bold text-white/40 uppercase tracking-wider block mb-1">Set Your Share Name</label>
                <input
                  id="inp-share-name"
                  type="text"
                  placeholder="e.g. Eco Friendly Alice"
                  value={friendNameInput}
                  onChange={(e) => setFriendNameInput(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] font-medium"
                />
              </div>

              {/* Action grid button pairs */}
              <div id="passport-buttons-row" className="grid grid-cols-2 gap-3">
                <button
                  id="btn-copy-passport-code"
                  type="button"
                  onClick={handleCopyCode}
                  className="py-2.5 px-2 bg-[#2ECC71] text-[#090909] font-bold rounded-xl text-xs hover:bg-[#27AE60] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copiedCode ? (
                    <>
                      <ClipboardCheck className="w-3.5 h-3.5 block" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 block" />
                      Copy Code
                    </>
                  )}
                </button>

                <button
                  id="btn-copy-card-text"
                  type="button"
                  onClick={handleCopyOverview}
                  className="py-2.5 px-2 bg-white/5 text-white/80 border border-white/15 hover:bg-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedLink ? (
                    <>
                      <ClipboardCheck className="w-3.5 h-3.5 block" />
                      Copied Summary
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 block" />
                      Copy Passport Card
                    </>
                  )}
                </button>
              </div>

              {/* Preview Box */}
              <div id="passport-interactive-preview" className="p-4 bg-[#090909]/20 border border-white/10 border-dashed rounded-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#090909] border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono leading-none font-bold text-[#2ECC71] uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-[#2ECC71]" /> LIVE PREVIEW
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/30 font-mono block">Sustainability ID Card</span>
                  <span className="text-xs font-extrabold text-white block font-serif">
                    {friendNameInput.trim() || "Your Climate Identity"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pb-1 border-t border-white/10 pt-3">
                  <div>
                    <span className="text-[9px] text-white/30 font-medium uppercase tracking-wide block">Annual Total</span>
                    <span className="text-xs font-bold font-mono text-[#2ECC71]">{selfAnnualEmissions.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/30 font-medium uppercase tracking-wide block">Diet / Meal style</span>
                    <span className="text-xs font-bold text-white capitalize">{userFootprint.dietType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Passport Importer */}
          <div id="passport-importer-card" className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            <h4 id="importer-card-title" className="text-base font-bold text-white font-serif flex items-center gap-1.5 mb-2">
              <UserPlus2 className="w-5 h-5 text-white block" /> Import a Friend's Passport
            </h4>
            <p id="importer-card-desc" className="text-xs text-white/40 mb-4">Paste the encoded Passport string provided by your classmate or companion here to compare ratings instantly.</p>

            <form id="importer-form" onSubmit={handleImportPassport} className="space-y-3">
              <textarea
                id="inp-passport-string"
                rows={3}
                placeholder="Paste friends copied passport code string..."
                value={passportInput}
                onChange={(e) => setPassportInput(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71]"
              />
              
              {inputError && (
                <div id="importer-error-box" className="p-2.5 bg-red-950/30 border border-red-900/30 text-red-400 text-xxs rounded-lg flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 block shrink-0" />
                  <span>{inputError}</span>
                </div>
              )}

              <button
                id="btn-submit-import"
                type="submit"
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer border border-white/15 shadow-sm"
              >
                Add Friend to Comparison List <ArrowRight className="w-3.5 h-3.5 block" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
