export interface FootprintData {
  // Transport (monthly values in Indian metrics)
  carDistance: number; // in km/month
  carEfficiency: number; // km/Ltr
  publicTransitDistance: number; // in km/month
  bikeDistance: number; // in km/month
  bikeCc: 'under-125' | '125-250' | '250-500' | 'over-500' | 'none'; // cc class
  flightHours: number; // hours/year
  
  // Home Energy (monthly values)
  electricityUsage: number; // kWh/month
  gasUsage: number; // therms/month
  wasteRecyclingRate: number; // percentage recycled (0 - 100)
  
  // Food & Lifestyle (daily / qualitative)
  dietType: 'vegan' | 'vegetarian' | 'balanced' | 'meat-heavy';
  shoppingHabits: 'minimalist' | 'moderate' | 'shopaholic';
}

export interface CarbonAction {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'waste' | 'lifestyle';
  carbonSavingKg: number; // CO2 saved in kg/month or per action
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  frequency: 'daily' | 'monthly' | 'one-time';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  requirement: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SavingRecord {
  month: string; // e.g., "Jan", "Feb"
  actualEmissions: number; // kg CO2
  savedEmissions: number; // kg CO2
}

export interface FriendImpactProfile {
  id: string;
  name: string;
  dietType: string;
  totalEmissions: number; // kg CO2/year
  completedActionsCount: number;
  avatarColor: string;
  isSelf?: boolean;
}

export interface AIInsight {
  summary: string;
  personalizedTips: Array<{
    title: string;
    description: string;
    impact: string; // e.g., "High Impact", "Medium Impact"
    actionCategory: string;
  }>;
  encouragingMessage: string;
}

export interface QuickActionLog {
  id: string;
  actionId: string;
  actionTitle: string;
  carbonSaved: number;
  timestamp: string;
}

export const QUICK_ACTION_OPTIONS = [
  { id: "no_car_trip", title: "No-car trip (Walk/Bike)", co2: 5.0, icon: "🚲", color: "text-emerald-400 bg-emerald-950/30" },
  { id: "plant_meal", title: "Had plant-based meal", co2: 3.5, icon: "🥗", color: "text-green-400 bg-[#2b5a1c]/30" },
  { id: "unplug_vampire", title: "Unplugged unused devices", co2: 1.5, icon: "🔌", color: "text-amber-400 bg-amber-950/30" },
  { id: "reduce_ac", title: "AC reduced runtime by 1h", co2: 2.0, icon: "🌡️", color: "text-blue-400 bg-blue-950/30" },
  { id: "dry_clothes", title: "Air-dried washing load", co2: 2.5, icon: "☀️", color: "text-sky-400 bg-sky-950/30" },
  { id: "waste_divert", title: "Eco composting / Recycling", co2: 1.0, icon: "♻️", color: "text-teal-400 bg-teal-950/30" }
];

