import React, { useState } from "react";
import { SavingRecord, FootprintData, QuickActionLog, QUICK_ACTION_OPTIONS } from "../types";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell, ReferenceLine } from "recharts";
import { Sparkles, Calendar, TrendingDown, ArrowDownRight, RefreshCw, BarChart2, CheckCircle2, Landmark, Check, Trash2, X } from "lucide-react";

interface CarbonDashboardProps {
  savingsData: SavingRecord[];
  detailedEmissions: {
    electricityCo2: number;
    gasCo2: number;
    carCo2: number;
    bikeCo2: number;
    publicTransitCo2: number;
    flightCo2: number;
    dietCo2: number;
    shoppingCo2: number;
  };
  monthlyTotal: number;
  totalSaved: number;
  quickActionsLog: QuickActionLog[];
  onLogQuickAction: (actionId: string, title: string, carbonSaved: number) => void;
  onDeleteQuickAction: (id: string) => void;
}

export default function CarbonDashboard({
  savingsData,
  detailedEmissions,
  monthlyTotal,
  totalSaved,
  quickActionsLog,
  onDeleteQuickAction,
  onLogQuickAction
}: CarbonDashboardProps) {

  const [projectionMonths, setProjectionMonths] = useState<number>(12);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedInterval, setSelectedInterval] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<number>(5); // Default to June (index 5)
  const [targetGoal, setTargetGoal] = useState<number>(30); // Default 30% Eco-Warrior reduction target track!

  const selectedMonthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedMonthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlyGoalLimit = targetGoal > 0 ? Math.round(monthlyTotal * (1 - targetGoal / 100)) : null;

  const activeIntervalGoalY = (() => {
    if (!monthlyGoalLimit) return null;
    if (selectedInterval === "monthly") return monthlyGoalLimit;
    if (selectedInterval === "weekly") return Math.round(monthlyGoalLimit / 4 + 12);
    return Math.round(monthlyGoalLimit / 30 + 1);
  })();

  // Generate active trend data for AreaChart based on controls:
  const getTrendDataForChart = () => {
    const totalQuickSaved = quickActionsLog ? quickActionsLog.reduce((sum, log) => sum + log.carbonSaved, 0) : 0;
    const standardSaved = Math.max(0, totalSaved - totalQuickSaved);

    if (selectedInterval === "monthly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.map((monthName, idx) => {
        const quickSavedForMonth = quickActionsLog
          ? quickActionsLog
              .filter((log) => {
                const date = new Date(log.timestamp);
                return date.getFullYear() === selectedYear && date.getMonth() === idx;
              })
              .reduce((sum, log) => sum + log.carbonSaved, 0)
          : 0;

        const monthProgressRatio = Math.min(1, (idx + 1) / 6);
        const regularSavedForMonth = Math.round((standardSaved / 12) * monthProgressRatio * 2);
        
        const savedEmissions = Math.round(regularSavedForMonth + quickSavedForMonth);
        const actualEmissions = Math.round(monthlyTotal + (standardSaved / 12) * (1.5 - monthProgressRatio) + quickSavedForMonth * 1.2 + 200);

        return {
          label: monthName,
          actualEmissions,
          savedEmissions,
        };
      });
    } else if (selectedInterval === "weekly") {
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      
      const getWeekOfMonth = (date: Date) => {
        const day = date.getDate();
        return Math.min(4, Math.floor((day - 1) / 7));
      };

      return weeks.map((weekName, idx) => {
        const quickSavedForWeek = quickActionsLog
          ? quickActionsLog
              .filter((log) => {
                const date = new Date(log.timestamp);
                return (
                  date.getFullYear() === selectedYear &&
                  date.getMonth() === selectedMonth &&
                  getWeekOfMonth(date) === idx
                );
              })
              .reduce((sum, log) => sum + log.carbonSaved, 0)
          : 0;

        const regularSavedForWeek = Math.round(standardSaved / 48);
        
        const savedEmissions = Math.round(regularSavedForWeek + quickSavedForWeek);
        const actualEmissions = Math.round((monthlyTotal / 4) + (standardSaved / 48) + quickSavedForWeek * 1.1 + 50);

        return {
          label: weekName,
          actualEmissions,
          savedEmissions,
        };
      });
    } else {
      // Daily Interval
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const data = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const quickSavedForDay = quickActionsLog
          ? quickActionsLog
              .filter((log) => {
                const date = new Date(log.timestamp);
                return (
                  date.getFullYear() === selectedYear &&
                  date.getMonth() === selectedMonth &&
                  date.getDate() === d
                );
              })
              .reduce((sum, log) => sum + log.carbonSaved, 0)
          : 0;

        const regularSavedForDay = standardSaved / 330;
        const savedEmissions = Math.round(regularSavedForDay + quickSavedForDay);
        const actualEmissions = Math.round((monthlyTotal / 30) + (standardSaved / 330) + quickSavedForDay * 1.1 + 12);

        data.push({
          label: `${selectedMonthNamesShort[selectedMonth]} ${d}`,
          actualEmissions,
          savedEmissions,
        });
      }
      return data;
    }
  };

  const chartTrendData = getTrendDataForChart();

  // Compute month-by-month running cumulative saved carbon and cost savings
  let runningCo2Saving = 0;
  const cumulativeList = savingsData.map((row) => {
    runningCo2Saving += row.savedEmissions;
    return {
      month: row.month,
      actualEmissions: row.actualEmissions,
      savedEmissions: row.savedEmissions,
      cumulativeSaved: runningCo2Saving,
      cumulativeCostSaved: runningCo2Saving * 0.16 // $0.16 per kg saved on average
    };
  });

  // Prepare categories breakdown list with descriptive colors matching the dark theme
  const sourceBreakdownData = [
    { name: "Personal Vehicle (Car)", value: Math.round(detailedEmissions.carCo2), color: "#2ECC71" },
    { name: "Two-Wheeler (Bike)", value: Math.round(detailedEmissions.bikeCo2), color: "#F1C40F" },
    { name: "Public Transit", value: Math.round(detailedEmissions.publicTransitCo2), color: "#27AE60" },
    { name: "Air Aviation", value: Math.round(detailedEmissions.flightCo2), color: "#1abc9c" },
    { name: "Electricity", value: Math.round(detailedEmissions.electricityCo2), color: "#e67e22" },
    { name: "Natural Gas", value: Math.round(detailedEmissions.gasCo2), color: "#d35400" },
    { name: "Food & Diet", value: Math.round(detailedEmissions.dietCo2), color: "#2ecc71" },
    { name: "Shopping & Goods", value: Math.round(detailedEmissions.shoppingCo2), color: "#9b59b6" }
  ].filter(item => item.value > 0);

  const totalEmissionsBreakdown = sourceBreakdownData.reduce((acc, curr) => acc + curr.value, 0);

  // Customize recharts tooltip style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const actualObj = payload.find((p: any) => p.dataKey === "actualEmissions");
      const savedObj = payload.find((p: any) => p.dataKey === "savedEmissions");

      const actualVal = actualObj ? Math.round(actualObj.value) : 0;
      const savedVal = savedObj ? Math.round(savedObj.value) : 0;
      const netVal = Math.max(0, actualVal - savedVal);

      return (
        <div id="chart-tooltip-panel" className="bg-[#0f0f0f]/95 backdrop-blur-md text-[#e0e0e0] p-4 border border-white/10 rounded-2xl space-y-3.5 shadow-2xl text-xs font-sans min-w-[200px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <p id="tooltip-label" className="font-serif italic text-white/95 font-bold text-sm">{label}</p>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">
              {selectedInterval === "daily" ? "Daily Log" : selectedInterval === "weekly" ? "Weekly Log" : "Monthly Log"}
            </span>
          </div>
          
          <div className="space-y-2">
            {/* Actual emissions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-white/75 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e74c3c]" />
                <span>Actual CO₂</span>
              </div>
              <span className="font-mono font-bold text-white text-right">
                {actualVal.toLocaleString()} kg
              </span>
            </div>

            {/* Saved emissions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-white/75 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2ecc71]" />
                <span>Saved CO₂</span>
              </div>
              <span className="font-mono font-bold text-[#2ecc71] text-right">
                -{savedVal.toLocaleString()} kg
              </span>
            </div>

            {/* divider */}
            <div className="border-t border-white/5 pt-2 flex items-center justify-between gap-4">
              <span className="text-white/40 font-semibold text-xxs uppercase tracking-wider">Net Footprint</span>
              <span className="font-mono font-black text-[#e67e22] text-right transition-colors leading-none">
                {netVal.toLocaleString()} kg
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="dashboard-analytics-section" className="space-y-8 animate-fade-in text-[#e0e0e0]">
      
      {/* Dynamic Key Performance Cards */}
      <div id="metrics-overview-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div id="kpi-current-emissions" className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div id="kpi-head-1" className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Monthly Footprint</span>
            <div className="w-8 h-8 rounded-lg bg-orange-950/40 text-orange-400 flex items-center justify-center shrink-0 border border-orange-900/30">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span id="kpi-val-1" className="text-2.5xl font-serif italic text-white block">
              {monthlyTotal} <span className="text-xs font-sans not-italic font-medium text-white/50">kg CO₂</span>
            </span>
            <p id="kpi-sub-1" className="text-[10px] sm:text-xxs text-white/40 mt-1 font-medium leading-normal font-sans">
              Continuous live output generated based on current configurations.
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div id="kpi-net-savings" className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div id="kpi-head-2" className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#2ECC71]">Total Net Reduction</span>
            <div className="w-8 h-8 rounded-lg bg-[#2ECC71]/10 text-[#2ECC71] flex items-center justify-center shrink-0 border border-[#2ECC71]/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span id="kpi-val-2" className="text-2.5xl font-serif italic font-bold text-[#2ECC71] block">
              {totalSaved} <span className="text-xs font-sans not-italic font-medium text-[#2ECC71]/70">kg CO₂</span>
            </span>
            <p id="kpi-sub-2" className="text-[10px] sm:text-xxs text-[#2ECC71]/80 font-medium leading-normal mt-1 font-sans">
              🎉 Saving offsets credited from your completed actions!
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div id="kpi-equivalent-trees" className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div id="kpi-head-3" className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Tree Equivalence</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/40 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-900/30">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span id="kpi-val-3" className="text-2.5xl font-serif italic text-white block">
              {Math.max(1, Math.round(totalSaved / 22))} <span className="text-xs font-sans not-italic font-medium text-white/50">mature trees</span>
            </span>
            <p id="kpi-sub-3" className="text-[10px] sm:text-xxs text-white/40 mt-1 font-medium leading-normal font-sans">
              An average mature tree absorbs roughly 22 kg CO₂ annually.
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div id="kpi-coaching-tier" className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div id="kpi-head-4" className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">Carbon Level</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 text-amber-400 flex items-center justify-center shrink-0 border border-amber-900/30">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span id="kpi-val-4" className="text-2.5xl font-serif italic text-white block">
              Level {Math.floor(totalSaved / 100) + 1}
            </span>
            <p id="kpi-sub-4" className="text-[10px] sm:text-xxs text-white/40 mt-1 font-medium leading-normal font-sans">
              Earn {100 - (totalSaved % 100)} carbon points to unlock the next title tier!
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div id="analytics-charts-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Area Chart (Actual vs Savings over the Year) */}
        <div id="chart-card-trends" className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div id="trends-header" className="mb-6 space-y-4 border-b border-white/5 pb-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h4 id="trends-title" className="text-base font-bold text-white font-serif">Carbon Trend Analysis</h4>
                <p id="trends-desc" className="text-xs text-white/40 font-sans">Analyze footprint actual emissions vs dynamic reductions</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {/* Year Select Selector Tab */}
                <div id="year-filter-tabs" className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1">
                  {[2024, 2025, 2026].map((year) => (
                    <button
                      key={year}
                      id={`btn-year-${year}`}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        selectedYear === year
                          ? "bg-[#2ECC71] text-black shadow-md font-extrabold"
                          : "text-white/65 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                {/* Interval Select Selector Tab */}
                <div id="interval-filter-tabs" className="bg-white/5 border border-white/10 p-1 rounded-xl flex gap-1">
                  {(["daily", "weekly", "monthly"] as const).map((interval) => (
                    <button
                      key={interval}
                      id={`btn-interval-${interval}`}
                      onClick={() => setSelectedInterval(interval)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                        selectedInterval === interval
                          ? "bg-[#2ECC71] text-black shadow-md font-extrabold"
                          : "text-white/65 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Conditional Month Selector row when view is daily or weekly */}
            {selectedInterval !== "monthly" && (
              <div id="focus-month-picker" className="flex flex-wrap items-center gap-1.5 bg-white/[0.02] border border-white/5 p-2 rounded-xl animate-fade-in">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 pl-1 pr-2">Focus Month:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedMonthNamesShort.map((mShort, idx) => (
                    <button
                      key={mShort}
                      id={`btn-month-${mShort}`}
                      onClick={() => setSelectedMonth(idx)}
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                        selectedMonth === idx
                          ? "bg-white/20 text-white border border-white/20"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {mShort}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Area Chart Container */}
          <div id="trends-chart-container" className="h-80 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart
                data={chartTrendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e74c3c" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#e74c3c" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2ecc71" stopOpacity={0.21}/>
                    <stop offset="95%" stopColor="#2ecc71" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval={selectedInterval === "daily" ? 4 : 0}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  unit=" kg"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.5)", paddingTop: 10 }} />
                
                {activeIntervalGoalY && (
                  <ReferenceLine
                    y={activeIntervalGoalY}
                    stroke="#f1c40f"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: `Target Budget`,
                      fill: "#f1c40f",
                      fontSize: 10,
                      position: "insideBottomRight",
                      offset: 8
                    }}
                  />
                )}

                <Area
                  type="monotone"
                  name="Footprint CO₂"
                  dataKey="actualEmissions"
                  stroke="#e74c3c"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActual)"
                />
                <Area
                  type="monotone"
                  name="Offset Savings"
                  dataKey="savedEmissions"
                  stroke="#2ecc71"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSaved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Goal-Setting Budget Widget */}
          <div id="dashboard-target-goal-widget" className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-white/50 block font-sans">Decarbonization Target Goal Limit</h5>
                <span className="text-xs font-semibold text-white/80">Goal Level: {targetGoal > 0 ? `${targetGoal}% reduction below baseline` : "No limit set"}</span>
              </div>
              {targetGoal > 0 && monthlyGoalLimit && (
                <div className="bg-amber-400/10 text-amber-400 border border-amber-405/20 rounded-xl px-3 py-1 text-xs font-bold font-mono text-center">
                  Target ceiling: {monthlyGoalLimit} kg CO₂ / month
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-4 gap-2">
              {[
                { val: 0, label: "Off", desc: "No tracker" },
                { val: 15, label: "Conscious (-15%)", desc: "Eco Beginner" },
                { val: 30, label: "Active Warrior (-30%)", desc: "Eco Committer" },
                { val: 50, label: "Pathfinder (-50%)", desc: "Net-Zero Leader" }
              ].map((g) => (
                <button
                  key={g.val}
                  type="button"
                  onClick={() => setTargetGoal(g.val)}
                  className={`py-2.5 px-2 rounded-xl text-xxs font-bold border transition-all cursor-pointer flex flex-col justify-center items-center gap-0.5 ${
                    targetGoal === g.val
                      ? "bg-amber-400 text-black border-transparent font-extrabold shadow-lg shadow-amber-400/10"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="font-bold">{g.label}</span>
                  <span className={`text-[9px] font-normal opacity-85 ${targetGoal === g.val ? "text-black/80" : "text-white/40"}`}>{g.desc}</span>
                </button>
              ))}
            </div>

            {targetGoal > 0 && monthlyGoalLimit && (
              <div className="text-xs font-sans text-white/80 leading-relaxed bg-[#111111]/80 p-3 rounded-xl border border-white/5 flex items-start gap-2.5">
                <span className="text-base">🎯</span>
                <div className="space-y-0.5">
                  {monthlyTotal <= monthlyGoalLimit ? (
                    <p className="text-[#2ECC71] font-semibold">
                      Outstanding! Your net footprint ({monthlyTotal} kg) is safely below your target budget of {monthlyGoalLimit} kg. You are perfectly on track!
                    </p>
                  ) : (
                    <p className="text-amber-450 font-semibold" style={{ color: "#fbbf24" }}>
                      Your current net emissions ({monthlyTotal} kg) exceed your target budget of {monthlyGoalLimit} kg by {monthlyTotal - monthlyGoalLimit} kg CO₂. Log more green habits or trim utility usage to cross below the budget ceiling.
                    </p>
                  )}
                  <p className="text-[10px] text-white/40 font-medium">Your goal directly adjusts the yellow budget reference ceiling on the chart above.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Source Breakdown Vector Chart */}
        <div id="chart-card-breakdown" className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
          <div id="breakdown-header" className="mb-6">
            <h4 id="breakdown-title" className="text-base font-bold text-white font-serif">Emissions Allocation</h4>
            <p id="breakdown-desc" className="text-xs text-white/40 font-sans">Detailed breakdown of active consumption blocks</p>
          </div>

          <div id="breakdown-chart-container" className="h-52 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart
                data={sourceBreakdownData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                  width={1}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {sourceBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* List Legends containing percentages */}
          <div id="breakdown-legends" className="space-y-2.5 mt-4 overflow-y-auto max-h-36 scrollbar-thin">
            {sourceBreakdownData.map((item, index) => {
              const percValue = totalEmissionsBreakdown ? Math.round((item.value / totalEmissionsBreakdown) * 100) : 0;
              return (
                <div key={index} id={`legend-item-${index}`} className="flex items-center justify-between text-xxs sm:text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                    <span className="text-white/75 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono font-bold pl-2 shrink-0">
                    <span className="text-white">{item.value} kg</span>
                    <span className="text-white/40 font-normal font-sans text-xxs">({percValue}%)</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Cumulative Impact & Estimated Financial Savings over Time */}
      <div id="cumulative-savings-panel" className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6 animate-fade-in">
        <div id="cumulative-header" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h4 id="cumulative-title" className="text-lg font-serif italic text-white font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2ECC71] animate-pulse" />
              Cumulative Impact & Estimated Financial Savings
            </h4>
            <p id="cumulative-desc" className="text-xs text-white/40 font-sans">
              Track how everyday positive ecological substitutions convert directly to household cash savings and massive carbon reductions.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start md:self-auto">
            <span className="text-xxs font-mono text-white/40 uppercase tracking-widest">Rate:</span>
            <span className="text-xs font-mono font-bold text-[#2ECC71]">$0.16 saved / kg CO₂ avoided</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Projection Calculator Widget */}
          <div id="projection-calculator" className="lg:col-span-4 bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 block font-sans">Horizon Projection</span>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/70">Timeline range:</span>
                <span className="font-bold text-[#2ECC71] bg-[#2ECC71]/10 px-2 py-0.5 rounded border border-[#2ECC71]/20">{projectionMonths} Months</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="36" 
                value={projectionMonths} 
                onChange={(e) => setProjectionMonths(Number(e.target.value))}
                className="w-full accent-[#2ECC71] cursor-pointer bg-white/10 rounded-lg appearance-none h-1.5"
              />
              <div className="flex justify-between text-[10px] text-white/30 font-mono">
                <span>1 mo</span>
                <span>12 mo (1yr)</span>
                <span>24 mo (2yr)</span>
                <span>36 mo (3yr)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xxs uppercase font-semibold text-white/40 tracking-wider font-sans">Cumulative CO₂ Reduction</span>
                <span className="text-sm font-serif italic font-bold text-white">{(totalSaved * projectionMonths).toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xxs uppercase font-semibold text-[#2ECC71] tracking-wider font-sans">Accumulated Cash Saved</span>
                <span className="text-sm font-mono font-extrabold text-[#2ECC71]">${(totalSaved * projectionMonths * 0.16).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xxs uppercase font-semibold text-white/40 tracking-wider font-sans">Absorbent Trees Equivalent</span>
                <span className="text-sm font-serif italic text-white">{Math.round((totalSaved * projectionMonths) / 22)} mature trees</span>
              </div>
            </div>
            
            <p className="text-[10px] text-white/30 italic leading-normal pt-1 block font-sans">
              *Savings represent averages for utility grid currents, public transit tariffs, fossil fuel pump fees, and plant consumption efficiencies.
            </p>
          </div>

          {/* Month-by-month Cumulative Progress Record List */}
          <div id="cumulative-timeline-table" className="lg:col-span-8 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/50 block font-sans">Calendar Cumulative Roll-Up</span>
            
            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/60">
                    <th className="p-3 font-semibold">Month</th>
                    <th className="p-3 font-semibold text-right">Emissions Score</th>
                    <th className="p-3 font-semibold text-right text-emerald-400">Monthly Restraint</th>
                    <th className="p-3 font-semibold text-right text-[#2ECC71]">Cumulative CO₂ Saved</th>
                    <th className="p-3 font-semibold text-right text-[#2ECC71]">Money Pocketed (Net)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cumulativeList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-medium text-white">{row.month} {selectedYear}</td>
                      <td className="p-3 text-right font-mono text-white/60">{row.actualEmissions} kg</td>
                      <td className="p-3 text-right font-mono text-emerald-400">-{row.savedEmissions} kg</td>
                      <td className="p-3 text-right font-mono font-bold text-white">{row.cumulativeSaved.toLocaleString()} kg</td>
                      <td className="p-3 text-right font-mono font-semibold text-[#2ECC71]">${row.cumulativeCostSaved.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between text-[11px] text-white/40 font-mono italic font-sans">
              <span>*Continuous positive offsets recorded as you mark checklist items.</span>
              <span>Capacity: {totalSaved} kg offset intensity / month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Ledger */}
      {quickActionsLog && quickActionsLog.length > 0 && (
        <div id="quick-actions-ledger" className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-fade-in mt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="text-base font-serif italic text-white font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2ECC71]" />
                Your Daily Actions Ledger
              </h4>
              <p className="text-[10px] text-white/40 font-sans">These quick actions accumulate toward your net zero and financial milestones instantly.</p>
            </div>
            <span className="font-mono text-xs text-[#2ECC71] bg-[#2ECC71]/10 px-2.5 py-1 rounded-lg font-bold">
              +{quickActionsLog.reduce((sum, log) => sum + log.carbonSaved, 0).toFixed(1)} kg CO₂ Saved
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans">
            {quickActionsLog.map((log) => {
              const opt = QUICK_ACTION_OPTIONS.find(o => o.id === log.actionId);
              return (
                <div key={log.id} id={`quick-action-log-${log.id}`} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-4 transition-all group">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg shrink-0">{opt?.icon || "⚡"}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{log.actionTitle}</p>
                      <p className="text-[9px] text-white/30 font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono font-bold text-[#2ECC71]">
                      +{log.carbonSaved} kg
                    </span>
                    <button
                      onClick={() => onDeleteQuickAction(log.id)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg text-white/30 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete action log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
