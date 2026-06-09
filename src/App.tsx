import React, { useState, useEffect } from "react";
import { FootprintData, CarbonAction, Milestone, FriendImpactProfile, AIInsight, SavingRecord, QuickActionLog, QUICK_ACTION_OPTIONS } from "./types";
import Navigation from "./components/Navigation";
import CarbonCalculator from "./components/CarbonCalculator";
import ActionList from "./components/ActionList";
import CarbonDashboard from "./components/CarbonDashboard";
import SocialCircle from "./components/SocialCircle";
import LandingPage from "./components/LandingPage";
import { Leaf, Info, HelpCircle, X, ChevronRight } from "lucide-react";

const INITIAL_FOOTPRINT: FootprintData = {
  carDistance: 1000,
  carEfficiency: 15,
  publicTransitDistance: 200,
  bikeDistance: 300,
  bikeCc: "under-125",
  flightHours: 8,
  electricityUsage: 450,
  gasUsage: 20,
  wasteRecyclingRate: 35,
  dietType: "balanced",
  shoppingHabits: "moderate"
};

const DEFAULT_ACTIONS: CarbonAction[] = [
  { id: "bike", title: "Cycle or walk short trips", description: "Biking instead of driving saves major fuel and keeps urban corridors cleaner.", category: "transport", carbonSavingKg: 35, difficulty: "easy", completed: false, frequency: "daily" },
  { id: "led", title: "Retrofit with 100% LED Bulbs", description: "Replacing old incandescent bulbs cuts home lighting energy demand by 80%.", category: "energy", carbonSavingKg: 20, difficulty: "easy", completed: false, frequency: "one-time" },
  { id: "thermostat", title: "Fine-tune thermostat setting by 2°F", description: "Slight adjustments to heating/cooling loops save massive monthly grid power.", category: "energy", carbonSavingKg: 40, difficulty: "easy", completed: false, frequency: "monthly" },
  { id: "cold_wash", title: "Wash laundry in cold water", description: "Nearly 90% of a washing machine's consumption goes strictly toward heating water.", category: "energy", carbonSavingKg: 15, difficulty: "easy", completed: false, frequency: "daily" },
  { id: "plant_meals", title: "Eat plant-only lunches for a week", description: "Replacing animal products with legumes halves agricultural gas production.", category: "food", carbonSavingKg: 25, difficulty: "easy", completed: false, frequency: "daily" },
  { id: "meat_free_days", title: "Incorporate Meat-Free Mondays", description: "Skipping meat and cheese once a week cuts annual diet footprints by 14%.", category: "food", carbonSavingKg: 45, difficulty: "medium", completed: false, frequency: "monthly" },
  { id: "compost", title: "Separate and compost raw organic wastes", description: "Organics diverted from landfills avoid methane-heavy decomposition.", category: "waste", carbonSavingKg: 30, difficulty: "medium", completed: false, frequency: "daily" },
  { id: "green_power", title: "Switch utility plan to Green Supply option", description: "Elect 100% wind or solar sources from local power corporations.", category: "energy", carbonSavingKg: 210, difficulty: "hard", completed: false, frequency: "one-time" },
  { id: "second_hand", title: "Adopt second-hand textile apparel sourcing", description: "Reusing quality clothes mitigates direct fast-fashion industrial output.", category: "lifestyle", carbonSavingKg: 60, difficulty: "hard", completed: false, frequency: "monthly" },
  { id: "flight_offset", title: "Purchase offsets for yearly air flights", description: "Direct carbon offset credits support credible forestry projects worldwide.", category: "transport", carbonSavingKg: 150, difficulty: "hard", completed: false, frequency: "monthly" },
];

const DEFAULT_MILESTONES: Milestone[] = [
  { id: "calc", title: "Climate Awareness Seed", requirement: "Complete first carbon footprint audit", description: "Taking the critical first step in tracking emissions is essential for behavioral modification.", icon: "🌱", unlocked: false },
  { id: "commute", title: "Green Commute Badge", requirement: "Accumulate 35 kg CO₂ transport savings", description: "You are reducing tailpipe emission blocks and congestion in urban hubs.", icon: "🚴", unlocked: false },
  { id: "thermo", title: "Power Saver Award", requirement: "Complete 3 residential energy actions", description: "Trimming utility power waste is an incredible direct pathway to lower grids.", icon: "⚡", unlocked: false },
  { id: "warrior", title: "Eco-Warrior Elite", requirement: "Reach a total savings of 150 kg CO₂", description: "Awarded to warriors who consistently complete high-difficulty tasks.", icon: "🛡️", unlocked: false },
  { id: "champion", title: "Net-Zero Champion", requirement: "Surpass 350+ kg in absolute cumulative CO₂ savings", description: "You represent the top decimal tier of active global carbon reduction practitioners.", icon: "👑", unlocked: false }
];

const DEFAULT_FRIENDS: FriendImpactProfile[] = [
  { id: "greta", name: "Greta (Net-Zero Leader)", dietType: "vegan", totalEmissions: 1320, completedActionsCount: 9, avatarColor: "from-green-400 to-emerald-500" },
  { id: "warrior_sim", name: "Eco Warrior (Committed)", dietType: "vegetarian", totalEmissions: 4300, completedActionsCount: 6, avatarColor: "from-emerald-300 to-teal-600" },
  { id: "friend_1", name: "Carbon Companion (Friend)", dietType: "balanced", totalEmissions: 5800, completedActionsCount: 4, avatarColor: "from-sky-300 to-blue-500" },
  { id: "citizen", name: "World Citizen (Typical Average)", dietType: "balanced", totalEmissions: 12500, completedActionsCount: 2, avatarColor: "from-slate-300 to-slate-500" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("climetrack_theme");
    return (saved === "light" || saved === "dark") ? saved : "dark";
  });

  useEffect(() => {
    localStorage.setItem("climetrack_theme", theme);
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, [theme]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("climetrack_sidebar_collapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("climetrack_sidebar_collapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // States with Lazy Initializers from localStorage
  const [footprint, setFootprint] = useState<FootprintData>(() => {
    const saved = localStorage.getItem("climetrack_footprint");
    return saved ? JSON.parse(saved) : INITIAL_FOOTPRINT;
  });

  const [actions, setActions] = useState<CarbonAction[]>(() => {
    const saved = localStorage.getItem("climetrack_actions");
    return saved ? JSON.parse(saved) : DEFAULT_ACTIONS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem("climetrack_milestones");
    return saved ? JSON.parse(saved) : DEFAULT_MILESTONES;
  });

  const [friendProfiles, setFriendProfiles] = useState<FriendImpactProfile[]>(() => {
    const saved = localStorage.getItem("climetrack_friends");
    return saved ? JSON.parse(saved) : DEFAULT_FRIENDS;
  });

  const [aiInsight, setAiInsight] = useState<AIInsight | null>(() => {
    const saved = localStorage.getItem("climetrack_ai_insight");
    return saved ? JSON.parse(saved) : null;
  });

  const [quickActionsLog, setQuickActionsLog] = useState<QuickActionLog[]>(() => {
    const saved = localStorage.getItem("climetrack_quick_actions_log");
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);

  // Auto dismiss notification after a few seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  // Auto save state variations
  useEffect(() => {
    localStorage.setItem("climetrack_footprint", JSON.stringify(footprint));
  }, [footprint]);

  useEffect(() => {
    localStorage.setItem("climetrack_quick_actions_log", JSON.stringify(quickActionsLog));
  }, [quickActionsLog]);

  useEffect(() => {
    localStorage.setItem("climetrack_actions", JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem("climetrack_milestones", JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem("climetrack_friends", JSON.stringify(friendProfiles));
  }, [friendProfiles]);

  useEffect(() => {
    if (aiInsight) {
      localStorage.setItem("climetrack_ai_insight", JSON.stringify(aiInsight));
    }
  }, [aiInsight]);

  // Carbon Math Formula Engine
  const calculateCarbon = (data: FootprintData) => {
    const electricityCo2 = data.electricityUsage * 0.38; // 0.38 kg CO2 per kWh
    const gasCo2 = data.gasUsage * 5.3; // 5.3 kg CO2 per therm
    
    // Indian metrics - Car: distance (km/mo), efficiency (km/Ltr). Liter petrol = ~2.31 kg CO2
    const carCo2 = data.carEfficiency > 0 ? (data.carDistance / data.carEfficiency) * 2.31 : 0;
    
    // Bike: distance (km/mo), engine size in CC. 
    let bikeCo2 = 0;
    if (data.bikeCc && data.bikeCc !== "none" && data.bikeDistance > 0) {
      const bikeFactors = {
        "under-125": 0.045, // kg CO2 per km (~50 km/Ltr)
        "125-250": 0.065,   // kg CO2 per km (~35 km/Ltr)
        "250-500": 0.09,    // kg CO2 per km (~25 km/Ltr)
        "over-500": 0.13,   // kg CO2 per km (~18 km/Ltr)
        "none": 0
      };
      const factor = bikeFactors[data.bikeCc] || 0;
      bikeCo2 = data.bikeDistance * factor;
    }

    const publicTransitCo2 = data.publicTransitDistance * 0.08; // 0.08 kg CO2 per km (approx 0.14 per mile)
    const flightCo2 = (data.flightHours * 150) / 12; // 150 kg per hour, annualized

    // Diets
    const dietMultipliers = { vegan: 125, vegetarian: 141, balanced: 183, "meat-heavy": 275 };
    const dietCo2 = dietMultipliers[data.dietType] || 183;

    // Lifestyle spending
    const shoppingMultipliers = { minimalist: 50, moderate: 120, shopaholic: 250 };
    const shoppingCo2 = shoppingMultipliers[data.shoppingHabits] || 120;

    return {
      electricityCo2,
      gasCo2,
      carCo2,
      bikeCo2,
      publicTransitCo2,
      flightCo2,
      dietCo2,
      shoppingCo2
    };
  };

  const detailedEmissions = calculateCarbon(footprint);
  
  // Base raw monthly sum
  const baseEmissions = 
    detailedEmissions.electricityCo2 +
    detailedEmissions.gasCo2 +
    detailedEmissions.carCo2 +
    detailedEmissions.bikeCo2 +
    detailedEmissions.publicTransitCo2 +
    detailedEmissions.flightCo2 +
    detailedEmissions.dietCo2 +
    detailedEmissions.shoppingCo2;

  // Offset adjustment
  const wasteDeduction = (footprint.wasteRecyclingRate / 100) * 45;
  const netMonthlyScore = Math.max(50, Math.round(baseEmissions - wasteDeduction));

  const quickSavedTotal = quickActionsLog.reduce((sum, log) => sum + log.carbonSaved, 0);
  const totalActionsSaved = actions
    .filter((a) => a.completed)
    .reduce((sum, action) => sum + action.carbonSavingKg, 0) + quickSavedTotal;

  // Trigger gamification milestones audit checks on state update
  const auditMilestones = (updatedActions: CarbonAction[], updatedQuickLogs: QuickActionLog[]) => {
    const totalQuickSaved = updatedQuickLogs.reduce((sum, log) => sum + log.carbonSaved, 0);
    const totalAccumSaved = updatedActions
      .filter((a) => a.completed)
      .reduce((sum, action) => sum + action.carbonSavingKg, 0) + totalQuickSaved;

    const transportSaved = updatedActions
      .filter((a) => a.completed && a.category === "transport")
      .reduce((sum, a) => sum + a.carbonSavingKg, 0) + 
      updatedQuickLogs
        .filter(l => l.actionId === "no_car_trip" || l.actionId === "shared_commute" || l.actionId === "bike_commute")
        .reduce((sum, l) => sum + l.carbonSaved, 0);

    const energyCompletedCount = updatedActions.filter(
      (a) => a.completed && a.category === "energy"
    ).length + (updatedQuickLogs.filter(l => l.actionId === "unplug_vampire" || l.actionId === "reduce_ac" || l.actionId === "dry_clothes").length > 0 ? 1 : 0);

    let unlockedAnyNew = false;
    const nextMilestones = milestones.map((milestone) => {
      if (milestone.unlocked) return milestone;

      let passes = false;
      if (milestone.id === "calc") passes = true; // Calcs unlocked initially
      if (milestone.id === "commute" && transportSaved >= 35) passes = true;
      if (milestone.id === "thermo" && energyCompletedCount >= 3) passes = true;
      if (milestone.id === "warrior" && totalAccumSaved >= 150) passes = true;
      if (milestone.id === "champion" && totalAccumSaved >= 350) passes = true;

      if (passes) {
        unlockedAnyNew = true;
        setShowNotification(`🏆 Unlocked Achievement: ${milestone.title}!`);
        return {
          ...milestone,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      return milestone;
    });

    if (unlockedAnyNew) {
      setMilestones(nextMilestones);
    }
  };

  // Checkbox complete toggle handler
  const toggleAction = (id: string) => {
    const nextActions = actions.map((action) => {
      if (action.id === id) {
        return { ...action, completed: !action.completed };
      }
      return action;
    });
    setActions(nextActions);
    auditMilestones(nextActions, quickActionsLog);
  };

  const logQuickAction = (actionId: string, title: string, carbonSaved: number) => {
    const newLog: QuickActionLog = {
      id: Math.random().toString(36).substr(2, 9),
      actionId,
      actionTitle: title,
      carbonSaved,
      timestamp: new Date().toISOString()
    };
    const nextLogs = [newLog, ...quickActionsLog];
    setQuickActionsLog(nextLogs);
    setShowNotification(`⚡ Logged: "${title}" avoided ${carbonSaved} kg of CO₂!`);
    auditMilestones(actions, nextLogs);
  };

  const deleteQuickActionLog = (id: string) => {
    const nextLogs = quickActionsLog.filter((log) => log.id !== id);
    setQuickActionsLog(nextLogs);
    setShowNotification(`🗑️ Removed logged quick action.`);
    auditMilestones(actions, nextLogs);
  };

  // Custom Friends List importer addition
  const addFriendProfile = (newFriend: FriendImpactProfile) => {
    setFriendProfiles([newFriend, ...friendProfiles]);
    setShowNotification(`🌱 Successfully imported ${newFriend.name}'s Climate Passport!`);
  };

  // Recharts Monthly trend generation: simulate reductions month-by-month as actions complete
  const generateMonthlySavingsTrend = (): SavingRecord[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const baseTargetAverage = 1250; // Reference Average Citizen monthly scale
    
    return months.map((month, idx) => {
      // Simulate historical savings building up toward current total actions saved
      const monthProgressRatio = Math.min(1, (idx + 1) / 6); // Ramps up and stabilizes
      const savedEmissionsForMonth = Math.round(totalActionsSaved * monthProgressRatio);
      const actualEmissionsForMonth = Math.round(Math.max(100, netMonthlyScore - (totalActionsSaved - savedEmissionsForMonth)));

      return {
        month,
        actualEmissions: actualEmissionsForMonth,
        savedEmissions: savedEmissionsForMonth
      };
    });
  };

  const trendSavingsData = generateMonthlySavingsTrend();

  return (
    <div id="application-root" className={`min-h-screen bg-[#090909] text-[#e0e0e0] flex flex-col antialiased transition-all duration-300 ${isCollapsed ? "md:pl-20" : "md:pl-64"}`}>
      
      {/* Upper Navigation Center */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        monthlyTotal={netMonthlyScore}
        totalSaved={totalActionsSaved}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Global Toast Success Alerts */}
      {showNotification && (
        <div id="toast-success-banner" className="fixed top-6 right-6 md:right-8 z-[100] animate-fade-in flex items-center justify-between gap-4 bg-[#111111]/90 border border-[#2ECC71]/35 text-[#2ECC71] font-semibold rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-sm">
          <div className="flex items-center gap-2">
            <span role="img" aria-label="trophy" className="text-xl">🏆</span>
            <span className="text-xs sm:text-sm">{showNotification}</span>
          </div>
          <button
            id="btn-close-toast"
            onClick={() => setShowNotification(null)}
            className="p-1 hover:bg-[#2ECC71]/20 rounded-md cursor-pointer text-[#2ECC71]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Workviews */}
      <main id="main-content-wrapper" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === "home" && (
          <LandingPage
            onStartAudit={() => setActiveTab("calculator")}
            onGoToAnalytics={() => setActiveTab("analytics")}
            onGoToActions={() => setActiveTab("milestones")}
            onGoToSocial={() => setActiveTab("social")}
            monthlyTotal={netMonthlyScore}
            totalSaved={totalActionsSaved}
          />
        )}

        {activeTab === "calculator" && (
          <CarbonCalculator
            footprint={footprint}
            setFootprint={setFootprint}
            monthlyTotal={netMonthlyScore}
            aiInsight={aiInsight}
            setAiInsight={setAiInsight}
            isLoadingAi={isLoadingAi}
            setIsLoadingAi={setIsLoadingAi}
            calculateCarbon={calculateCarbon}
          />
        )}

        {activeTab === "analytics" && (
          <CarbonDashboard
            savingsData={trendSavingsData}
            detailedEmissions={detailedEmissions}
            monthlyTotal={netMonthlyScore}
            totalSaved={totalActionsSaved}
            quickActionsLog={quickActionsLog}
            onLogQuickAction={logQuickAction}
            onDeleteQuickAction={deleteQuickActionLog}
          />
        )}

        {activeTab === "milestones" && (
          <ActionList
            actions={actions}
            toggleAction={toggleAction}
            milestones={milestones}
            totalSaved={totalActionsSaved}
          />
        )}

        {activeTab === "social" && (
          <SocialCircle
            friendProfiles={friendProfiles}
            addFriendProfile={addFriendProfile}
            userFootprint={footprint}
            monthlyTotal={netMonthlyScore}
            completedActionsCount={actions.filter(a => a.completed).length}
          />
        )}



      </main>

      {/* Footer Branding */}
      <footer id="global-page-footer" className="mt-auto border-t border-white/5 bg-[#090909] py-6 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-serif font-light">
          <p id="copyright-text">
            ClimeTrack Sustainability Engine • Created for zero-emission global awareness
          </p>
          <p id="footer-build-signature" className="font-mono text-xxs bg-white/5 border border-white/10 px-2 py-1 rounded text-white/50">
            Node: {new Date().getFullYear()} • Powered securely by Gemini-3.5-Flash
          </p>
        </div>
      </footer>

      {/* Global Floating Action Button for Daily Quick Log */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3 font-sans">
        {isFabOpen && (
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 shadow-2xl w-72 space-y-3 animate-fade-in text-white backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/60">Log Daily Quick Action</span>
              <span className="text-[10px] font-mono text-[#2ECC71]">Instant credit</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
              {QUICK_ACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    logQuickAction(opt.id, opt.title, opt.co2);
                    setIsFabOpen(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-[#2ECC71]/10 border border-white/5 hover:border-[#2ECC71]/20 transition-all text-left text-xs text-white group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${opt.color}`}>
                      {opt.icon}
                    </span>
                    <span className="truncate group-hover:text-[#2ECC71] transition-colors">{opt.title}</span>
                  </div>
                  <span className="font-mono font-bold text-xxs text-[#2ECC71] bg-[#2ECC71]/10 px-1.5 py-0.5 rounded shrink-0">
                    +{opt.co2} kg
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl text-white transition-all transform duration-300 cursor-pointer ${
            isFabOpen 
              ? "bg-red-500 hover:bg-red-600 rotate-45"
              : "bg-[#2ECC71] hover:bg-[#25a259] text-black font-bold scale-100 hover:scale-105 active:scale-95 animate-bounce"
          }`}
          title="Log a Quick Action"
        >
          {isFabOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <span className="text-2xl font-sans font-light flex items-center justify-center">+</span>
          )}
        </button>
      </div>

    </div>
  );
}
