import React, { useState } from "react";
import { FootprintData, AIInsight } from "../types";
import { Sparkles, Car, Bike, Zap, Flame, Plane, ShoppingBag, Trash2, Salad, Award, MessageSquare, AlertCircle, Loader2, Bot, Info } from "lucide-react";

interface CarbonCalculatorProps {
  footprint: FootprintData;
  setFootprint: (data: FootprintData) => void;
  monthlyTotal: number;
  aiInsight: AIInsight | null;
  setAiInsight: (insight: AIInsight) => void;
  isLoadingAi: boolean;
  setIsLoadingAi: (loading: boolean) => void;
  calculateCarbon: (data: FootprintData) => {
    electricityCo2: number;
    gasCo2: number;
    carCo2: number;
    bikeCo2: number;
    publicTransitCo2: number;
    flightCo2: number;
    dietCo2: number;
    shoppingCo2: number;
  };
}

export default function CarbonCalculator({
  footprint,
  setFootprint,
  monthlyTotal,
  aiInsight,
  setAiInsight,
  isLoadingAi,
  setIsLoadingAi,
  calculateCarbon
}: CarbonCalculatorProps) {
  const [hasElectricVehicle, setHasElectricVehicle] = useState<boolean>(false);
  const [hasNoCar, setHasNoCar] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showScienceGuide, setShowScienceGuide] = useState<boolean>(false);

  const handleSliderChange = (key: keyof FootprintData, value: number | string) => {
    setFootprint({
      ...footprint,
      [key]: value
    });
  };

  const detailedEmissions = calculateCarbon(footprint);
  const totalTonsYearly = ((monthlyTotal * 12) / 1000).toFixed(1);

  // Dynamic, offline-capable localized audit mapping
  const localSmartInsights = (() => {
    const energy = detailedEmissions.electricityCo2 + detailedEmissions.gasCo2;
    const mobility = detailedEmissions.carCo2 + detailedEmissions.bikeCo2 + detailedEmissions.publicTransitCo2 + detailedEmissions.flightCo2;
    const foodAndShopping = detailedEmissions.dietCo2 + detailedEmissions.shoppingCo2;

    const maxVal = Math.max(energy, mobility, foodAndShopping);
    
    let summary = "";
    let personalizedTips: Array<{ title: string; description: string; impact: string }> = [];
    let encouragingMessage = "";

    if (maxVal === 0) {
      summary = `Your calculated footprint is 0 kg CO₂/month. Perfect! Adjust the baseline sliders to see how your everyday choices impact emissions.`;
      personalizedTips = [
        { title: "Define Your Commute Sliders", description: "Adjust your public transport rails or motorcycle kilometers to view live exhaust factors.", impact: "Medium Impact" },
        { title: "Input Core Utilities", description: "Slide household electricity consumption to view the localized grid power output impact.", impact: "High Impact" }
      ];
      encouragingMessage = "Move sliders on the left to activate your smart carbon offsets checklist.";
    } else if (maxVal === mobility) {
      summary = `Your footprint is ${monthlyTotal} kg CO₂/month (${totalTonsYearly} tons/year). Mobility (car, bike, or flight commutes) is currently your largest emission source.`;
      personalizedTips = [
        { title: "Switch to Shared or Public Transit", description: "Opting for shared grids like buses, trains, or carpools directly minimizes transport CO₂ factors.", impact: "High Impact" },
        { title: "Adopt Economical Commutes", description: "Riding fuel-efficient under-125cc commuter vehicles, bicycles, or walking saves large fuel equivalents.", impact: "High Impact" },
        { title: "Consolidate Flight Travel", description: "Aviation features high CO₂ per kilometer. Minimizing unessential routes yields immediate footprint savings.", impact: "Medium Impact" }
      ];
      encouragingMessage = "Adjusting mobility is one of the most immediate ways to drop your net-zero timeline curves!";
    } else if (maxVal === energy) {
      summary = `Your footprint is ${monthlyTotal} kg CO₂/month (${totalTonsYearly} tons/year). Household energy and utility consumption represents your largest carbon contributor.`;
      personalizedTips = [
        { title: "De-activate Phantom Power Loops", description: "Always unplug standby home charger blocks and entertainment consoles to block phantom standby loads.", impact: "Medium Impact" },
        { title: "Washing Laundry on Cold Cycles", description: "Heating water is responsible for 90% of laundry energy. Switching to cold saves power and shields garments.", impact: "Medium Impact" },
        { title: "Optimize Home Insulation & Blinds", description: "Utilize solar heating in winters and closing heavy thermal window drapes or blinds in summers to conserve climate load.", impact: "High Impact" }
      ];
      encouragingMessage = "Even minor calibrations in domestic power patterns accumulate into huge yearly grid emission cuts!";
    } else {
      summary = `Your footprint is ${monthlyTotal} kg CO₂/month (${totalTonsYearly} tons/year). Personal dietary choices and retail buying habits reside as your highest environmental impact sector.`;
      personalizedTips = [
        { title: "Integrate Plant-Based Days", description: "Methane and land use for standard meats carry up to 10–20x higher greenhouse factors than vegetable proteins.", impact: "High Impact" },
        { title: "Engage Circular Buying Habits", description: "Minimize retail shopping of single-use items. Focus on lasting, quality-made repairs and recycling components.", impact: "Medium Impact" },
        { title: "Implement Leftovers Composting", description: "Decomposing yard and meal matters in landfills generates anaerobic warming gases. Diverting it to natural compost creates rich topsoil.", impact: "Medium Impact" }
      ];
      encouragingMessage = "Fostering active plant-dense eating habits exerts a massive, highly beneficial feedback wave on global land preservation!";
    }

    return { summary, personalizedTips, encouragingMessage };
  })();

  return (
    <div id="calculator-section" className="space-y-8 animate-fade-in text-[#e0e0e0]">
      
      {/* Intro Hero Banner */}
      <div id="calculator-hero" className="bg-[#111111] text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/15 shadow-2xl">
        <div id="hero-pattern" className="absolute top-0 right-0 w-80 h-80 bg-[#2ECC71]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div id="hero-pattern-2" className="absolute bottom-0 left-10 w-64 h-64 bg-[#2ECC71]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div id="hero-content" className="max-w-3xl relative z-10 space-y-4">
          <span id="hero-tag" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30">
            <Sparkles className="w-3.5 h-3.5" /> Live Impact Metric
          </span>
          <h2 id="hero-title" className="text-2xl sm:text-3.5xl font-serif italic font-light tracking-tight text-white">
            How clean is your lifestyle?
          </h2>
          <p id="hero-description" className="text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            Emissions are calculated continuously as you adjust sliders. Complete the categories to request a personalized, deep-learning sustainability audit from our <span className="text-[#2ECC71] font-semibold">Gemini AI Coach</span>.
          </p>
          
          <div id="hero-metrics-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            <div id="metric-monthly" className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
              <span id="metric-label-mo" className="text-white/40 text-xs font-medium block uppercase tracking-wider">Monthly Footprint</span>
              <span id="metric-value-mo" className="text-xl sm:text-2.5xl font-mono font-bold text-[#2ECC71]">
                {monthlyTotal} <span className="text-xs font-normal text-white/50 font-sans lowercase">kg CO₂</span>
              </span>
            </div>
            <div id="metric-annual" className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
              <span id="metric-label-yr" className="text-white/40 text-xs font-medium block uppercase tracking-wider">Annual Footprint</span>
              <span id="metric-value-yr" className="text-xl sm:text-2.5xl font-mono font-bold text-[#2ECC71]">
                {totalTonsYearly} <span className="text-xs font-normal text-white/50 font-sans lowercase">tons</span>
              </span>
            </div>
            <div id="metric-benchmark" className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col justify-center">
              <span id="metric-label-bm" className="text-white/40 text-xs font-medium block uppercase tracking-wider">Vs National Average</span>
              <span id="metric-value-bm" className="text-sm font-semibold mt-1">
                {monthlyTotal < 1300 ? (
                  <span className="text-[#2ECC71] font-bold">✨ 35% Below Average</span>
                ) : (
                  <span className="text-amber-550 font-bold">⚠️ Above Average</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form and Live Summary */}
      <div id="calculator-body-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category Inputs Form */}
        <div id="calculator-inputs-column" className="lg:col-span-7 space-y-6">
          
          {/* Card: Transport emissions */}
          <div id="card-transport-input" className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div id="card-header-transport" className="flex items-center gap-3 mb-6">
              <div id="icon-bg-transport" className="p-2.5 bg-[#2ECC71]/10 text-[#2ECC71] rounded-lg">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 id="transport-title" className="text-base font-bold text-white font-serif">Transportation Footprint</h3>
                <p id="transport-desc" className="text-xs text-white/40">Commuting mileage, aviation, and fuel efficiency</p>
              </div>
            </div>

            <div id="transport-inputs-container" className="space-y-6">
              
              {/* Car Toggle Controls */}
              <div id="transport-toggles" className="flex flex-wrap gap-4 p-3 bg-white/5 rounded-xl border border-white/5 text-xs">
                <label id="lbl-no-car" className="flex items-center gap-2 cursor-pointer font-medium text-white/80">
                  <input
                    id="chk-no-car"
                    type="checkbox"
                    checked={hasNoCar}
                    onChange={(e) => {
                      setHasNoCar(e.target.checked);
                      if (e.target.checked) {
                        handleSliderChange("carDistance", 0);
                      } else {
                        handleSliderChange("carDistance", 1000);
                      }
                    }}
                    className="rounded border-white/20 bg-[#090909] text-[#2ECC71] focus:ring-[#2ECC71]"
                  />
                  I do not drive a car
                </label>
                {!hasNoCar && (
                  <label id="lbl-ev-car" className="flex items-center gap-2 cursor-pointer font-medium text-white/80">
                    <input
                      id="chk-ev-car"
                      type="checkbox"
                      checked={hasElectricVehicle}
                      onChange={(e) => {
                        setHasElectricVehicle(e.target.checked);
                        if (e.target.checked) {
                          handleSliderChange("carEfficiency", 80); // Treat EV as top index efficiency ratio
                        } else {
                          handleSliderChange("carEfficiency", 15);
                        }
                      }}
                      className="rounded border-white/20 bg-[#090909] text-[#2ECC71] focus:ring-[#2ECC71]"
                    />
                    I drive an Electric Vehicle (EV)
                  </label>
                )}
              </div>

              {/* Slider 1: Kilometers driven */}
              {!hasNoCar && (
                <div id="group-slider-car-distance">
                  <div id="header-car-distance" className="flex justify-between items-center mb-2">
                    <span id="lbl-car-distance" className="text-xs sm:text-sm font-semibold text-white/80">Monthly Driving Distance</span>
                    <span id="val-car-distance" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                      {footprint.carDistance} km
                    </span>
                  </div>
                  <input
                    id="slider-car-distance"
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={footprint.carDistance}
                    onChange={(e) => handleSliderChange("carDistance", Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                  />
                  <span id="sub-car-distance" className="text-xxs text-white/40 mt-1 block">Generates about {Math.round(detailedEmissions.carCo2)} kg CO₂ per month</span>
                </div>
              )}

              {/* Slider 2: Car km/Ltr */}
              {!hasNoCar && !hasElectricVehicle && (
                <div id="group-slider-car-efficiency">
                  <div id="header-car-efficiency" className="flex justify-between items-center mb-2">
                    <span id="lbl-car-efficiency" className="text-xs sm:text-sm font-semibold text-white/80">Average Vehicle Mileage (Efficiency)</span>
                    <span id="val-car-efficiency" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                      {footprint.carEfficiency} km/Ltr
                    </span>
                  </div>
                  <input
                    id="slider-car-efficiency"
                    type="range"
                    min="5"
                    max="40"
                    step="0.5"
                    value={footprint.carEfficiency}
                    onChange={(e) => handleSliderChange("carEfficiency", Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                  />
                  <span id="sub-car-efficiency" className="text-xxs text-white/40 mt-1 block">Lower efficiency (heavy petrol SUVs) dramatically raises your score</span>
                </div>
              )}

              {/* Two-Wheeler / Bike Section (Very common in India) */}
              <div id="group-bike-inputs" className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-[#2ECC71]" />
                  <span className="text-xs sm:text-sm font-semibold text-white/80">Two-Wheeler / Motorbike & Scooter</span>
                </div>

                {/* Bike CC select dropdown or pills */}
                <div className="space-y-2">
                  <label className="text-xxs text-white/40 uppercase tracking-wider block font-medium">Engine Size / Type (CC)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: "under-125", label: "< 125 cc" },
                      { id: "125-250", label: "125-250 cc" },
                      { id: "250-500", label: "250-500 cc" },
                      { id: "over-500", label: "> 500 cc" },
                      { id: "none", label: "No Bike" }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          handleSliderChange("bikeCc", opt.id);
                          if (opt.id === "none") {
                            handleSliderChange("bikeDistance", 0);
                          } else if (footprint.bikeDistance === 0) {
                            handleSliderChange("bikeDistance", 300);
                          }
                        }}
                        className={`py-1.5 px-2 rounded-lg text-xxs font-semibold border transition-all cursor-pointer text-center truncate ${
                          footprint.bikeCc === opt.id
                            ? "bg-[#2ECC71] text-[#090909] border-transparent font-bold"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bike Distance slider */}
                {footprint.bikeCc !== "none" && (
                  <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-white/60">Monthly Two-Wheeler Commute</span>
                      <span className="text-xs font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded">
                        {footprint.bikeDistance} km
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="50"
                      value={footprint.bikeDistance}
                      onChange={(e) => handleSliderChange("bikeDistance", Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                    />
                    <span className="text-xxs text-white/30 block mt-1">Generates about {Math.round(detailedEmissions.bikeCo2 || 0)} kg CO₂ per month</span>
                  </div>
                )}
              </div>

              {/* Slider 3: Public Transit */}
              <div id="group-slider-transit" className="pt-2 border-t border-white/5">
                <div id="header-transit" className="flex justify-between items-center mb-2">
                  <span id="lbl-transit" className="text-xs sm:text-sm font-semibold text-white/80">Public Transit (Metro, Bus, Suburban Rail)</span>
                  <span id="val-transit" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                    {footprint.publicTransitDistance} km/mo
                  </span>
                </div>
                <input
                  id="slider-transit"
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={footprint.publicTransitDistance}
                  onChange={(e) => handleSliderChange("publicTransitDistance", Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                />
              </div>

              {/* Slider 4: Annual Flight Hours */}
              <div id="group-slider-flights">
                <div id="header-flights" className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <Plane id="icon-slider-plane" className="w-4 h-4 text-[#2ECC71]" />
                    <span id="lbl-flights" className="text-xs sm:text-sm font-semibold text-white/80">Annual Flight Duration</span>
                  </div>
                  <span id="val-flights" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                    {footprint.flightHours} hours/yr
                  </span>
                </div>
                <input
                  id="slider-flights"
                  type="range"
                  min="0"
                  max="120"
                  step="2"
                  value={footprint.flightHours}
                  onChange={(e) => handleSliderChange("flightHours", Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                />
                <span id="sub-flights" className="text-xxs text-white/40 mt-1 block">Commercial flight generates approx. 150 kg CO₂ per flight hour</span>
              </div>

            </div>
          </div>

          {/* Card: Household Energy usage */}
          <div id="card-energy-input" className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div id="card-header-energy" className="flex items-center gap-3 mb-6">
              <div id="icon-bg-energy" className="p-2.5 bg-[#2ECC71]/10 text-[#2ECC71] rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 id="energy-title" className="text-base font-bold text-white font-serif">Household Energy Usage</h3>
                <p id="energy-desc" className="text-xs text-white/40">Power utility billing, heating, and general recycling rates</p>
              </div>
            </div>

            <div id="energy-inputs-container" className="space-y-6">
              
              {/* Slider 1: Electricity usage */}
              <div id="group-slider-electricity">
                <div id="header-electricity" className="flex justify-between items-center mb-2">
                  <span id="lbl-electricity" className="text-xs sm:text-sm font-semibold text-white/80">Electricity Usage (Monthly)</span>
                  <span id="val-electricity" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                    {footprint.electricityUsage} kWh
                  </span>
                </div>
                <input
                  id="slider-electricity"
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={footprint.electricityUsage}
                  onChange={(e) => handleSliderChange("electricityUsage", Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                />
              </div>

              {/* Slider 2: Gas usage */}
              <div id="group-slider-gas">
                <div id="header-gas" className="flex justify-between items-center mb-2">
                  <span id="lbl-gas" className="text-xs sm:text-sm font-semibold text-white/80">Natural Gas Consumption</span>
                  <span id="val-gas" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                    {footprint.gasUsage} therms/mo
                  </span>
                </div>
                <input
                  id="slider-gas"
                  type="range"
                  min="0"
                  max="150"
                  step="5"
                  value={footprint.gasUsage}
                  onChange={(e) => handleSliderChange("gasUsage", Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                />
              </div>

              {/* Slider 3: Recycling index */}
              <div id="group-slider-recycling">
                <div id="header-recycling" className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-1">
                    <Trash2 id="icon-slider-waste" className="w-4 h-4 text-[#2ECC71]" />
                    <span id="lbl-recycling" className="text-xs sm:text-sm font-semibold text-white/80">Waste Recycling Rate</span>
                  </div>
                  <span id="val-recycling" className="text-xs sm:text-sm font-bold text-[#2ECC71] font-mono bg-[#2ECC71]/10 border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                    {footprint.wasteRecyclingRate}% Recycled
                  </span>
                </div>
                <input
                  id="slider-recycling"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={footprint.wasteRecyclingRate}
                  onChange={(e) => handleSliderChange("wasteRecyclingRate", Number(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2ECC71]"
                />
              </div>

            </div>
          </div>

          {/* Card: Lifestyle & Diet Choices */}
          <div id="card-lifestyle-input" className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div id="card-header-lifestyle" className="flex items-center gap-3 mb-6">
              <div id="icon-bg-lifestyle" className="p-2.5 bg-[#2ECC71]/10 text-[#2ECC71] rounded-lg">
                <Salad className="w-5 h-5" />
              </div>
              <div>
                <h3 id="lifestyle-title" className="text-base font-bold text-white font-serif">Nutrition & Consumer Habits</h3>
                <p id="lifestyle-desc" className="text-xs text-white/40">Diet choices and monthly purchasing profile values</p>
              </div>
            </div>

            <div id="lifestyle-inputs-container" className="space-y-6">
              
              {/* Diet selection pills */}
              <div id="group-diet-select">
                <h4 id="lbl-diet-headline" className="text-xs sm:text-sm font-semibold text-white/80 mb-3 block">Primary Nutritional Diet</h4>
                <div id="diet-grid" className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(["vegan", "vegetarian", "balanced", "meat-heavy"] as const).map((type) => (
                    <button
                      key={type}
                      id={`diet-option-${type}`}
                      type="button"
                      onClick={() => handleSliderChange("dietType", type)}
                      className={`py-3.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-center ${
                        footprint.dietType === type
                          ? "bg-[#2ECC71] text-[#090909] border-transparent font-extrabold shadow-sm"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <span className="capitalize">{type.replace("-", " ")}</span>
                      <span className={`text-[10px] font-normal ${footprint.dietType === type ? "text-[#090909]/70" : "text-white/40"}`}>
                        {type === "vegan" && "~125 kg/mo"}
                        {type === "vegetarian" && "~141 kg/mo"}
                        {type === "balanced" && "~183 kg/mo"}
                        {type === "meat-heavy" && "~275 kg/mo"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shopping Habits selection pills */}
              <div id="group-shopping-select">
                <h4 id="lbl-shopping-headline" className="text-xs sm:text-sm font-semibold text-white/80 mb-3 block">Consumables & Shopping Profile</h4>
                <div id="shopping-grid" className="grid grid-cols-3 gap-2.5">
                  {(["minimalist", "moderate", "shopaholic"] as const).map((style) => (
                    <button
                      key={style}
                      id={`shopping-option-${style}`}
                      type="button"
                      onClick={() => handleSliderChange("shoppingHabits", style)}
                      className={`py-3 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        footprint.shoppingHabits === style
                          ? "bg-[#2ECC71] text-[#090909] border-transparent font-extrabold shadow-sm"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      }`}
                    >
                      <ShoppingBag className={`w-4 h-4 mx-auto mb-1.5 block ${footprint.shoppingHabits === style ? "text-[#090909]/80" : "text-white/40"}`} />
                      <span className="capitalize block">{style}</span>
                      <span className={`text-[10px] font-normal block ${footprint.shoppingHabits === style ? "text-[#090909]/70" : "text-white/40"}`}>
                        {style === "minimalist" && "~50 kg/mo"}
                        {style === "moderate" && "~120 kg/mo"}
                        {style === "shopaholic" && "~250 kg/mo"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Carbon Science & Conversion Formulas Accordion */}
          <div id="card-science-guide" className="bg-[#111111] border border-white/10 rounded-2xl p-6 transition-all duration-300">
            <button
              type="button"
              onClick={() => setShowScienceGuide(!showScienceGuide)}
              className="w-full flex items-center justify-between text-left cursor-pointer text-white focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-500/10 text-[#2ECC71] rounded-lg">
                  <Info className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h4 className="text-sm font-bold font-serif italic text-white flex items-center gap-1.5 leading-tight">
                    How is my carbon calculated?
                  </h4>
                  <p className="text-[10px] text-white/40 font-sans">View scientific emission equations & coefficients</p>
                </div>
              </div>
              <span className="text-xxs font-bold text-[#2ECC71] bg-[#2ECC71]/10 px-2.5 py-1 rounded-lg hover:bg-[#2ECC71]/20 transition-all font-mono shrink-0">
                {showScienceGuide ? "HIDE DETAILS" : "SHOW SCIENCE"}
              </span>
            </button>

            {showScienceGuide && (
              <div className="mt-6 pt-5 border-t border-white/5 space-y-5 animate-fade-in text-xs leading-relaxed font-sans text-white/70">
                <p>
                  Our mathematical reduction algorithms employ standard grid and transportation factors recommended by global environmental agencies (EPA, DEFRA, and IPCC). Adjusting parameters recalculates emissions dynamically:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-[#2ECC71] block">⚡ Home Electricity</span>
                    <p className="text-[10px] text-[#b0b0b0]">
                      Calculated at <span className="text-white font-mono font-semibold">0.38 kg</span> of CO₂ emissions per kilowatt-hour (kWh). This matches regional coal-to-renewable power grid averages.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-[#2ECC71] block">🔥 Natural Gas</span>
                    <p className="text-[10px] text-[#b0b0b0]">
                      Calculated at <span className="text-white font-mono font-semibold">5.3 kg</span> of CO₂ emissions per therm. Utility pipelines burn directly, releasing direct greenhouse agents.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-[#2ECC71] block">🚗 Petrol Commute</span>
                    <p className="text-[10px] text-[#b0b0b0]">
                      One liter of petrol produces <span className="text-white font-mono font-semibold">2.31 kg</span> of pure gaseous carbon exhaust. Distance is divided by your vehicle efficiency (mileage rating) to find exhaust weight.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-[#2ECC71] block">🚇 Public Transit</span>
                    <p className="text-[10px] text-[#b0b0b0]">
                      Calculated at an efficient rate of <span className="text-white font-mono font-semibold">0.08 kg</span> CO₂ per passenger kilometer, as high-capacity subways disperse energy demands among massive passenger grids.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-[#2ECC71] block">✈️ High-Altitude Flights</span>
                    <p className="text-[10px] text-[#b0b0b0]">
                      Commercial jetliner fuel emits average factors of <span className="text-white font-mono font-semibold">150 kg</span> CO₂ per airborne passenger hour. Upper radiative forcing scales high atmospheric effects.
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="font-bold text-[#2ECC71] block">🥗 Lifestyle & Food</span>
                    <p className="text-[10px] text-[#b0b0b0]">
                      Meat-heavy diets represent high soil land clearances & methane outputs (<span className="text-white font-mono font-semibold">275 kg/mo</span>), whereas vegan or plant-only eating cuts demands to just (<span className="text-white font-mono font-semibold">125 kg/mo</span>).
                    </p>
                  </div>
                </div>

                <div className="bg-[#2ECC71]/5 border border-[#2ECC71]/20 p-3.5 rounded-xl text-xxs text-[#2ECC71]/90 flex items-start gap-2">
                  <span className="text-sm">🌱</span>
                  <div className="space-y-1">
                    <span className="font-bold block text-white/95 uppercase tracking-wider">How to leverage this knowledge:</span>
                    <p>
                      Identify your largest emission category and focus reduction commitments there. Swapping even one grocery run weekly to plants, or taking the metro instead of driving, avoids massive volumes of CO₂!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Live Metrics Circular Gauge & AI Insights Panel */}
        <div id="calculator-sidebar-column" className="lg:col-span-5 space-y-6">
          
          {/* Card: Live Dynamic Summary Gauge */}
          <div id="card-gauge-summary" className="bg-white/5 text-white rounded-2xl p-6 border border-white/10">
            <h3 id="sidebar-totals-title" className="text-xs font-bold text-white/50 tracking-wider uppercase mb-6 flex items-center justify-between">
              Live Footprint Detail
              <span className="text-[10px] font-mono bg-[#2ECC71]/10 px-2 py-0.5 rounded text-[#2ECC71] border border-[#2ECC71]/25">MATH AUTO-UPDATES</span>
            </h3>

            {/* List Breakdown */}
            <div id="gauge-breakdown-list" className="space-y-4">
              <div id="row-breakdown-car" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Personal Vehicle (Car)</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.carCo2)} kg</span>
              </div>
              {detailedEmissions.bikeCo2 > 0 && (
                <div id="row-breakdown-bike" className="flex items-center justify-between">
                  <span className="text-xs text-white/60 capitalize">Two-Wheeler (Motorbike/Scooter)</span>
                  <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.bikeCo2)} kg</span>
                </div>
              )}
              <div id="row-breakdown-transit" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Public Rail & Transit</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.publicTransitCo2)} kg</span>
              </div>
              <div id="row-breakdown-flights" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Air Travel Flights</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.flightCo2)} kg</span>
              </div>
              <div id="row-breakdown-electricity" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Electricity Emissions</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.electricityCo2)} kg</span>
              </div>
              <div id="row-breakdown-gas" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Natural Gas Usage</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.gasCo2)} kg</span>
              </div>
              <div id="row-breakdown-nutrition" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Dietary Nutrition Profile</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.dietCo2)} kg</span>
              </div>
              <div id="row-breakdown-shopping" className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">Buying & Goods Consumption</span>
                <span className="text-sm font-bold font-mono text-white">{Math.round(detailedEmissions.shoppingCo2)} kg</span>
              </div>

              {/* Carbon reduction math credit */}
              {footprint.wasteRecyclingRate > 0 && (
                <div id="row-breakdown-recycling" className="flex items-center justify-between text-[#2ECC71] bg-[#2ECC71]/10 px-2.5 py-1.5 rounded-lg border border-[#2ECC71]/20">
                  <span className="text-xs font-semibold">Recycling Impact Offset</span>
                  <span className="text-sm font-bold font-mono">-{Math.round((footprint.wasteRecyclingRate / 100) * 45)} kg</span>
                </div>
              )}

              <hr className="border-white/10 my-4" />

              <div id="row-total-breakdown" className="flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-white capitalize">Monthly Net Emissions</span>
                <span className="text-xl font-mono font-extrabold text-[#2ECC71]">{monthlyTotal} kg CO₂</span>
              </div>
            </div>
          </div>

          {/* Real-time Smart Coach Portal */}
          <div id="card-ai-insights" className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div id="ai-insights-header" className="flex items-start justify-between gap-4 mb-4">
              <div id="ai-tag-wrapper">
                <h3 id="ai-tag-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 font-serif italic">
                  <Bot className="w-5 h-5 text-[#2ECC71] inline" /> Smart Sustainability Coach
                </h3>
                <p id="ai-tag-subtitle" className="text-xs text-white/40">Instant energy audits and behavioral action items based on your metrics</p>
              </div>
              <div className="bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20 rounded-full px-2.5 py-1 text-[10px] font-bold font-mono tracking-wider uppercase shrink-0">
                Live Audit
              </div>
            </div>

            <div id="ai-response-inner" className="space-y-4 pt-2">
              
              {/* Coach Summary Card */}
              <div id="ai-card-summary" className="p-4 bg-[#2ECC71]/10 border border-[#2ECC71]/20 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2ECC71] block">Climate Assessment</span>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-serif italic">
                  "{localSmartInsights.summary}"
                </p>
              </div>

              {/* Priority Action Tips */}
              <div id="ai-card-tips" className="space-y-2.5">
                <h4 className="text-xs font-bold text-white/50 tracking-wider uppercase block">Your Priority Recommendations</h4>
                {localSmartInsights.personalizedTips.map((tip, idx) => (
                  <div
                    key={idx}
                    id={`ai-tip-item-${idx}`}
                    className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3"
                  >
                    <div className="bg-white/10 px-2 py-0.5 rounded border border-white/10 text-[10px] font-bold font-mono text-white/80 uppercase mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white leading-tight block">{tip.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full leading-none shrink-0 ${
                          tip.impact === "High Impact" ? "bg-red-950/50 text-red-400 border border-red-800/30" : "bg-blue-950/50 text-blue-400 border border-blue-800/30"
                        }`}>
                          {tip.impact}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Encouraging closing */}
              {localSmartInsights.encouragingMessage && (
                <div id="ai-coach-encouragement" className="text-xs bg-[#111111] text-white/80 p-3.5 rounded-xl flex items-start gap-2 border border-white/10 font-sans">
                  <MessageSquare className="w-4 h-4 text-[#2ECC71] shrink-0 block mt-0.5" />
                  <p className="leading-relaxed">
                    {localSmartInsights.encouragingMessage}
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
