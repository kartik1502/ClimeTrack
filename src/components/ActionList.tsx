import React, { useState } from "react";
import { CarbonAction, Milestone } from "../types";
import { Check, Flame, Trophy, Award, Bike, Zap, Apple, Trash, BadgeCheck, HelpCircle } from "lucide-react";

interface ActionListProps {
  actions: CarbonAction[];
  toggleAction: (id: string) => void;
  milestones: Milestone[];
  totalSaved: number;
}

export default function ActionList({ actions, toggleAction, milestones, totalSaved }: ActionListProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const categories = [
    { label: "All Actions", id: "all" },
    { label: "Transportation 🚗", id: "transport" },
    { label: "Energy & Power ⚡", id: "energy" },
    { label: "Diet & Food 🍏", id: "food" },
    { label: "Waste Reduction ♻️", id: "waste" },
    { label: "Lifestyle 👕", id: "lifestyle" },
  ];

  const filteredActions = actions.filter(
    (action) => filterCategory === "all" || action.category === filterCategory
  );

  // Carbon points calculation
  const completedCount = actions.filter((a) => a.completed).length;
  const carbonSavesTotal = totalSaved;
  const userLevel = Math.floor(carbonSavesTotal / 100) + 1;
  const nextLevelProgress = carbonSavesTotal % 100;

  return (
    <div id="action-list-module" className="space-y-8 animate-fade-in text-[#e0e0e0]">
      
      {/* Gamified Level Header */}
      <div id="action-gamification-hero" className="bg-white/5 border border-white/10 text-white rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div id="gamify-bg" className="absolute top-0 right-0 w-64 h-64 bg-[#2ECC71]/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div id="gamify-grid" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div id="gamify-badge" className="md:col-span-5 flex items-center gap-4">
            <div id="level-shield" className="w-16 h-16 bg-gradient-to-tr from-[#2ECC71] to-[#27AE60] rounded-2xl rotate-3 flex flex-col items-center justify-center p-3 font-sans shrink-0 border border-white/10 shadow-lg">
              <Trophy className="w-6 h-6 text-[#090909] block" />
              <span className="text-[10px] font-bold text-[#090909] uppercase block mt-1 tracking-wider">Lvl {userLevel}</span>
            </div>
            <div>
              <h3 id="gamify-rank-title" className="text-lg font-serif italic text-white font-bold">Climate Guardian</h3>
              <p id="gamify-rank-desc" className="text-xs text-white/50">Log routine reductions to elevate your carbon status & title ranks.</p>
            </div>
          </div>

          <div id="gamify-bar-col" className="md:col-span-7 space-y-2">
            <div id="gamify-bar-header" className="flex justify-between text-xs font-semibold">
              <span className="text-[#2ECC71] font-mono">Level {userLevel} XP: {carbonSavesTotal} / {userLevel * 100} kg CO₂ saved</span>
              <span className="text-white/40">Level {userLevel + 1}</span>
            </div>
            {/* ProgressBar */}
            <div id="gamify-progress-track" className="w-full h-3.5 bg-white/5 border border-white/10 rounded-full overflow-hidden">
              <div
                id="gamify-progress-fill"
                style={{ width: `${Math.min(100, Math.max(5, nextLevelProgress))}%` }}
                className="h-full bg-linear-to-r from-[#2ECC71] to-[#1abc9c] shadow-[0_0_12px_rgba(46,204,113,0.3)] transition-all duration-500"
              ></div>
            </div>
            <div id="gamify-bar-footer" className="flex justify-between text-[11px] text-white/40 font-medium font-mono">
              <span>{completedCount} tasks marked complete</span>
              <span>{100 - nextLevelProgress} kg until level up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Checklist & Badges Wall */}
      <div id="gamification-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Actions Checklist list */}
        <div id="checklist-column" className="lg:col-span-7 space-y-6">
          <div id="checklist-card" className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
            
            <div id="checklist-header" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h4 id="checklist-title" className="text-base font-bold text-white font-serif">Carbon Saving Checklist</h4>
                <p id="checklist-desc" className="text-xs text-white/40">Pick everyday solutions to systematically lower monthly totals</p>
              </div>
              <span id="tracker-counter" className="text-xs font-mono font-bold bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-white/80 shrink-0 self-start sm:self-auto">
                {completedCount} Completed
              </span>
            </div>

            {/* Category selection bar */}
            <div id="checklist-categories" className="flex gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`btn-cat-filter-${cat.id}`}
                  onClick={() => setFilterCategory(cat.id)}
                  type="button"
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 whitespace-nowrap cursor-pointer transition-colors ${
                    filterCategory === cat.id
                      ? "bg-[#2ECC71] text-[#090909]"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Actions Grid List */}
            <div id="checklist-grid-list" className="space-y-3.5">
              {filteredActions.length > 0 ? (
                filteredActions.map((action) => (
                  <div
                    key={action.id}
                    id={`action-item-${action.id}`}
                    onClick={() => toggleAction(action.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      action.completed
                        ? "bg-[#2ECC71]/5 border-[#2ECC71]/30 select-none opacity-85"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20 text-[#e0e0e0]"
                    }`}
                  >
                    
                    {/* Visual custom checkbox */}
                    <div
                      id={`chkbox-box-${action.id}`}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        action.completed
                          ? "bg-[#2ECC71] border-[#2ECC71] text-[#090909]"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {action.completed && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>

                    <div id={`action-body-${action.id}`} className="space-y-1 grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-bold leading-tight ${action.completed ? "line-through text-white/40" : "text-white"}`}>
                          {action.title}
                        </span>
                        
                        {/* Saving Tag */}
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          action.completed
                            ? "bg-[#2ECC71]/15 text-[#2ECC71]"
                            : "bg-white/5 text-white/50"
                        }`}>
                          Save: {action.carbonSavingKg} kg
                        </span>
                      </div>
                      <p className="text-xxs sm:text-xs text-white/50 leading-normal">
                        {action.description}
                      </p>
                    </div>

                    {/* Difficulty Tag */}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-sans tracking-wide shrink-0 ${
                      action.difficulty === "easy"
                        ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30"
                        : action.difficulty === "medium"
                        ? "bg-amber-950/30 text-amber-400 border border-amber-900/30"
                        : "bg-red-950/30 text-red-400 border border-red-900/30"
                    }`}>
                      {action.difficulty}
                    </span>

                  </div>
                ))
              ) : (
                <div id="empty-actions" className="py-12 border border-dashed border-white/10 rounded-xl text-center">
                  <span id="lbl-empty-act" className="text-xs text-white/40 font-medium font-sans">No ecological actions found for this category.</span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Milestone Badge Wall */}
        <div id="badges-column" className="lg:col-span-5 space-y-6">
          <div id="milestones-card" className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-md">
            
            <div id="milestones-header" className="mb-6 flex items-center justify-between">
              <div>
                <h4 id="milestones-title" className="text-base font-bold text-white font-serif flex items-center gap-1.5">
                  <Award className="w-5 h-5 text-amber-500 block" /> Gamified Milestones
                </h4>
                <p id="milestones-desc" className="text-xs text-white/40">Milestone rewards earned throughout the year</p>
              </div>
              <span id="completed-badges-count" className="text-xxs font-mono font-bold uppercase bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20 px-2 py-1 rounded">
                {milestones.filter(m => m.unlocked).length} UNLOCKED
              </span>
            </div>

            {/* Badges Grid */}
            <div id="badges-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  id={`milestone-item-${milestone.id}`}
                  className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 relative overflow-hidden ${
                    milestone.unlocked
                      ? "bg-white/[0.03] border-amber-500/30 shadow-md"
                      : "bg-white/[0.01] border-white/5 select-none opacity-40"
                  }`}
                >
                  {/* Status Indicator check */}
                  {milestone.unlocked && (
                    <BadgeCheck id={`milestone-unlocked-icon-${milestone.id}`} className="w-5 h-5 text-amber-500 absolute top-3 right-3 block" />
                  )}

                  <div id={`badge-sphere-${milestone.id}`} className={`w-11 h-11 rounded-xl shrink-0 border flex items-center justify-center text-lg ${
                    milestone.unlocked
                      ? "bg-[#090909]/45 border-amber-500/20 text-amber-400 drop-shadow-md"
                      : "bg-white/5 border-white/5 text-white/20"
                  }`}>
                    {milestone.icon}
                  </div>

                  <div id={`milestone-body-${milestone.id}`} className="space-y-1">
                    <span className={`text-xs font-bold block leading-none ${milestone.unlocked ? "text-white" : "text-white/40"}`}>
                      {milestone.title}
                    </span>
                    <p className={`text-xxs leading-normal max-w-[210px] block ${milestone.unlocked ? "text-white/60" : "text-white/30"}`}>
                      {milestone.description}
                    </p>
                    <span className="text-[10px] font-semibold text-white/40 font-mono block">
                      Goal: {milestone.requirement}
                    </span>
                    {milestone.unlocked && milestone.unlockedAt && (
                      <span className="text-[9px] font-bold text-[#2ECC71] block mt-1 font-mono">
                        Unlocked on {new Date(milestone.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
