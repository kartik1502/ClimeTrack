import { describe, it, expect } from "vitest";
import { 
  calculateCarbon, 
  calculateWasteDeduction, 
  calculateUserLevel, 
  getRankBadgeTitle 
} from "./carbonMath";
import { FootprintData } from "../types";

describe("ClimeTrack Carbon Calculation Suite", () => {
  it("computes baseline vegan, zero-commute emissions cleanly", () => {
    const baselineData: FootprintData = {
      carDistance: 0,
      carEfficiency: 15,
      publicTransitDistance: 0,
      bikeDistance: 0,
      bikeCc: "none",
      flightHours: 0,
      electricityUsage: 0,
      gasUsage: 0,
      wasteRecyclingRate: 0,
      dietType: "vegan",
      shoppingHabits: "minimalist"
    };

    const emissions = calculateCarbon(baselineData);
    expect(emissions.electricityCo2).toBe(0);
    expect(emissions.carCo2).toBe(0);
    expect(emissions.dietCo2).toBe(125);
    expect(emissions.shoppingCo2).toBe(50);
  });

  it("calculates car emissions with exact fuel efficiency factors", () => {
    const data: FootprintData = {
      carDistance: 1000,
      carEfficiency: 10, // 1000/10 = 100 Liters. 100 * 2.31 = 231 kg CO2
      publicTransitDistance: 0,
      bikeDistance: 0,
      bikeCc: "none",
      flightHours: 0,
      electricityUsage: 0,
      gasUsage: 0,
      wasteRecyclingRate: 50,
      dietType: "balanced",
      shoppingHabits: "moderate"
    };

    const emissions = calculateCarbon(data);
    expect(emissions.carCo2).toBeCloseTo(231, 2);
  });

  it("calculates two-wheeler motorbike engine offsets based on cc classes", () => {
    const under125cc: FootprintData = {
      carDistance: 0,
      carEfficiency: 15,
      publicTransitDistance: 0,
      bikeDistance: 1000,
      bikeCc: "under-125", // 0.045 factor
      flightHours: 0,
      electricityUsage: 0,
      gasUsage: 0,
      wasteRecyclingRate: 0,
      dietType: "vegetarian",
      shoppingHabits: "moderate"
    };

    const heavyCc: FootprintData = {
      ...under125cc,
      bikeCc: "over-500" // 0.13 factor
    };

    const emissionsLow = calculateCarbon(under125cc);
    const emissionsHigh = calculateCarbon(heavyCc);

    expect(emissionsLow.bikeCo2).toBe(45);
    expect(emissionsHigh.bikeCo2).toBe(130);
  });

  it("calculates recycling offsets correctly", () => {
    expect(calculateWasteDeduction(0)).toBe(0);
    expect(calculateWasteDeduction(100)).toBe(45);
    expect(calculateWasteDeduction(35)).toBe(0.35 * 45);
  });

  it("tracks and increments gamified user level XP accurately", () => {
    const levelInfant = calculateUserLevel(0);
    expect(levelInfant.userLevel).toBe(1);
    expect(levelInfant.nextLevelProgress).toBe(0);
    expect(levelInfant.xpRemaining).toBe(100);

    const levelAspirant = calculateUserLevel(150);
    expect(levelAspirant.userLevel).toBe(2);
    expect(levelAspirant.nextLevelProgress).toBe(50);
    expect(levelAspirant.xpRemaining).toBe(50);

    const levelMaster = calculateUserLevel(450);
    expect(levelMaster.userLevel).toBe(5);
    expect(levelMaster.nextLevelProgress).toBe(50);
  });

  it("returns proper rank descriptions matching level milestones", () => {
    expect(getRankBadgeTitle(1)).toBe("Climate Intern");
    expect(getRankBadgeTitle(2)).toBe("Climate Guardian");
    expect(getRankBadgeTitle(3)).toBe("Power Saver Specialist");
    expect(getRankBadgeTitle(4)).toBe("Eco-Warrior Elite");
    expect(getRankBadgeTitle(5)).toBe("Net-Zero Champion");
  });
});
