import { FootprintData } from "../types";

/**
 * Calculates monthly CO2 emissions by category.
 */
export function calculateCarbon(data: FootprintData) {
  const electricityUsage = Number(data.electricityUsage) || 0;
  const gasUsage = Number(data.gasUsage) || 0;
  const carEfficiency = Number(data.carEfficiency) || 0;
  const carDistance = Number(data.carDistance) || 0;
  const bikeDistance = Number(data.bikeDistance) || 0;
  const publicTransitDistance = Number(data.publicTransitDistance) || 0;
  const flightHours = Number(data.flightHours) || 0;

  const electricityCo2 = electricityUsage * 0.38; // 0.38 kg CO2 per kWh
  const gasCo2 = gasUsage * 5.3; // 5.3 kg CO2 per therm
  
  // Car: distance (km/mo), efficiency (km/Ltr). Petrol Liter = ~2.31 kg CO2
  const carCo2 = carEfficiency > 0 ? (carDistance / carEfficiency) * 2.31 : 0;
  
  // Bike: distance (km/mo), engine size in CC. 
  let bikeCo2 = 0;
  if (data.bikeCc && data.bikeCc !== "none" && bikeDistance > 0) {
    const bikeFactors = {
      "under-125": 0.045, // kg CO2 per km (~50 km/Ltr)
      "125-250": 0.065,   // kg CO2 per km (~35 km/Ltr)
      "250-500": 0.09,    // kg CO2 per km (~25 km/Ltr)
      "over-500": 0.13,   // kg CO2 per km (~18 km/Ltr)
      "none": 0
    };
    const factor = bikeFactors[data.bikeCc] || 0;
    bikeCo2 = bikeDistance * factor;
  }

  const publicTransitCo2 = publicTransitDistance * 0.08; // 0.08 kg CO2 per km
  const flightCo2 = (flightHours * 150) / 12; // 150 kg per hour, annualized

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
}

/**
 * Calculates the waste deduction offset.
 */
export function calculateWasteDeduction(wasteRecyclingRate: number): number {
  const rate = Number(wasteRecyclingRate) || 0;
  return (rate / 100) * 45;
}

/**
 * Calculates user levels based on carbon saved.
 */
export function calculateUserLevel(carbonSavesTotal: number) {
  const score = Math.max(0, Number(carbonSavesTotal) || 0);
  const userLevel = Math.floor(score / 100) + 1;
  const nextLevelProgress = score % 100;
  return {
    userLevel,
    nextLevelProgress,
    xpRemaining: 100 - nextLevelProgress
  };
}

/**
 * Renders the climate title rank based on level or total saved.
 */
export function getRankBadgeTitle(level: number): string {
  if (level >= 5) return "Net-Zero Champion";
  if (level >= 4) return "Eco-Warrior Elite";
  if (level >= 3) return "Power Saver Specialist";
  if (level >= 2) return "Climate Guardian";
  return "Climate Intern";
}
