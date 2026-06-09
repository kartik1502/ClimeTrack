import React from "react";
import { Home, Leaf, BarChart3, Award, Users, ChevronLeft, ChevronRight, Menu, X, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  monthlyTotal: number;
  totalSaved: number;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export default function Navigation({
  activeTab,
  setActiveTab,
  monthlyTotal,
  totalSaved,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  theme,
  setTheme
}: NavigationProps) {
  const tabs = [
    { id: "home", label: "Home Base", icon: Home, desc: "Pathways to Net-Zero" },
    { id: "calculator", label: "Calculator", icon: Leaf, desc: "Measure emissions" },
    { id: "analytics", label: "Trends & Savings", icon: BarChart3, desc: "Analyze impact patterns" },
    { id: "milestones", label: "Actions & Badges", icon: Award, desc: "Milestones & actions" },
    { id: "social", label: "Social Circle", icon: Users, desc: "Peer comparisons" },
  ];

  const renderSidebar = (forceFull: boolean = false) => {
    const collapsed = forceFull ? false : isCollapsed;
    return (
      <div className={`flex flex-col h-full bg-[#090909] text-white select-none ${forceFull ? "" : "border-r border-white/10"}`}>
        {/* Sidebar Header Block */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 h-16 shrink-0">
          {!collapsed ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40 font-sans px-1">
              Menu Navigation
            </span>
          ) : (
            <div className="w-full flex justify-center text-white/40">
              <span className="text-xs font-bold font-serif italic text-[#2ECC71]">CT</span>
            </div>
          )}
          
          {/* Mobile close button only */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Stats Display when not collapsed */}
        <div className="p-4 border-b border-white/10 space-y-3 shrink-0">
          {collapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div className="group relative">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white font-mono cursor-default">
                  {Math.round(monthlyTotal)}
                </div>
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#111111] border border-white/10 text-[10px] text-white/70 px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Monthly Score: {monthlyTotal} kg CO₂/mo
                </span>
              </div>
              <div className="group relative">
                <div className="w-8 h-8 rounded-lg bg-[#2ECC71]/10 border border-[#2ECC71]/20 flex items-center justify-center text-[10px] font-bold text-[#2ECC71] font-mono cursor-default">
                  {Math.round(totalSaved)}
                </div>
                <span className="absolute left-12 top-1/2 -translate-y-1/2 bg-[#111111] border border-white/10 text-[10px] text-[#2ECC71] px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                  Total Saved: {totalSaved} kg CO₂
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold font-sans">Monthly Footprint</span>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-serif text-white">{monthlyTotal}</span>
                  <span className="text-[10px] text-white/50 font-sans">kg CO₂/mo</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#2ECC71]/80 font-semibold font-sans">Estimated Total Savings</span>
                <div className="bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-xl px-3 py-2 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold font-serif text-[#2ECC71]">{totalSaved}</span>
                  <span className="text-[10px] text-[#2ECC71]/70 font-sans">kg CO₂</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileOpen(false); // Auto close mobile drawer on click
                }}
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap group relative ${
                  collapsed ? "justify-center p-3" : "gap-3 px-3 py-3"
                } ${
                  isActive
                    ? "bg-[#2ECC71] text-[#090909] font-bold shadow-md animate-none"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <TabIcon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <div className="flex flex-col items-start text-left min-w-0">
                    <span className="leading-tight block truncate text-xs font-bold">{tab.label}</span>
                    <span className={`text-[10px] font-normal leading-normal truncate block ${
                      isActive ? "text-[#090909]/60" : "text-white/30 group-hover:text-white/40"
                    }`}>
                      {tab.desc}
                    </span>
                  </div>
                )}
                {collapsed && (
                  <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-[#111111] border border-white/10 text-xs font-semibold text-white px-2 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle trigger at bottom on Desktop */}
        <div className="p-4 border-t border-white/10 hidden md:block shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:text-white text-white/60 transition-colors text-xs font-semibold cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Menu</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Unified Sticky Header Bar across Desktop & Mobile */}
      <header className="sticky top-0 z-40 bg-[#090909] border-b border-white/10 px-4 sm:px-6 md:px-8 h-16 md:h-20 flex items-center justify-between shrink-0 select-none">
        {/* Brand Block */}
        <div 
          onClick={() => {
            setActiveTab("home");
            setIsMobileOpen(false);
          }}
          className="flex items-center gap-3 cursor-pointer hover:opacity-85 select-none active:scale-[0.98] transition-all"
          title="Go to Home Base"
        >
          <div className="p-2 bg-[#2ECC71]/10 rounded-xl text-[#2ECC71] border border-[#2ECC71]/20 flex items-center justify-center shrink-0">
            <Leaf className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-bold tracking-tight text-[#2ECC71] font-serif italic leading-none">
              ClimeTrack
            </h1>
            <span className="text-[10px] text-white/40 font-medium font-sans mt-0.5">
              Pathways to Net-Zero
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle Button (shared, highly visible) */}
          <button
            id="header-theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all cursor-pointer flex items-center justify-center relative group"
            title={theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {theme === "dark" ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-400" />
            )}
            <span className="absolute right-0 top-12 bg-[#111111]/90 border border-white/10 text-[9px] font-semibold text-white px-2 py-0.5 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          {/* Hamburger Menu trigger for mobile only */}
          <button
            id="header-mobile-menu-trigger"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2.5 hover:bg-white/5 rounded-xl text-white/70 hover:text-white border border-white/10 transition-colors flex items-center justify-center cursor-pointer"
            title="Open navigation menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* Bottom sheet drawer overlay for MOBILE navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop overlay - NO BLUR as requested */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 transition-opacity"
            />
            
            {/* Bottom Sheet Drawer container body - Appearing from below */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="relative flex flex-col w-full bg-[#090909] border-t border-white/15 rounded-t-[2rem] shadow-2xl z-50 max-h-[85vh] overflow-hidden"
            >
              {/* iOS-Style slide-up drag handle bar indicator */}
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3.5 shrink-0" />
              
              <div className="flex-1 overflow-y-auto min-h-0 pt-1 pb-6">
                {renderSidebar(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Desktop Sidebar Navigation */}
      <aside className={`fixed top-0 bottom-0 left-0 z-30 hidden md:block transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}>
        {renderSidebar(false)}
      </aside>
    </>
  );
}
