# ClimeTrack — Pathways to Net-Zero Carbon Tracker

ClimeTrack is a comprehensive, client-centric, and exceptionally polished carbon tracking application constructed in React, TypeScript, and Tailwind CSS. It is engineered to guide users along dynamic pathways to net-zero emissions by consolidating data audits, localized action trackers, gamified milestone rewards, and peer comparisons into one cohesive, beautifully orchestrated ecosystem.

---

## 🌌 The Interlocking System Ecosystem

ClimeTrack does not offer isolated utilities; every tool is functionally linked to create a responsive, feedback-driven carbon-offset loop:

```
+--------------------------------------------------------------+
|                    1. Carbon Calculator                      |
| (Input Utility Bills, Commute Travel, and Dietary Behaviors) |
+------------------------------+-------------------------------+
                               |
                               | Updates Baseline Score
                               v
+------------------------------+-------------------------------+
|             2. Trends & Savings Dashboard                    |
| (Interactive Forecast Curves & Active Micro-Action Logger)   |
+------------------------------+-------------------------------+
                               |
                               | Live Savings Subtract
                               v
+------------------------------+-------------------------------+
|                  3. Actions & Badges Hub                     |
| (Committed Strategic Changes + Automated Badges Unlocking)   |
+------------------------------+-------------------------------+
                               |
                               | Index Verification
                               v
+--------------------------------------------------------------+
|                  4. Social Slide Creator                     |
|  (Interactive Multi-Theme Slides & PNG Carousel Image Export) |
+--------------------------------------------------------------+
```

1. **Calculate the Baseline**: The baseline footprint is compiled within the *Carbon Calculator*. This establishes your real-world monthly CO₂ emission index.
2. **Projections & Instant Action**: The *Trends & Savings Dashboard* uses this index to plot twelve-month forecast models. Everyday micro-choices logged inside the *Interactive Logger* award carbon credits which instantly lower current forecasts.
3. **Strategic Milestones**: The *Actions & Badges Hub* presents curated high-impact target changes. Satisfying these checklist targets feeds the badge-unlocking engine.
4. **Campaign Creation**: Create personalized social media slide decks summarizing your sustainable milestone metrics. Choose custom themes and export high-fidelity PNG images or structural outlines to post directly on social networks.

---

## 🛠️ Feature Deep-Dive

### 1. Carbon Calculator (Multi-Factor Audit Engine)
The Calculator acts as the structural baseline analyzer. It translates human activities into carbon equivalents using authentic research coefficients:

*   **Automotive Transportation**: Captures car distance combined with specific fuel economy ranges structured in kilometers/liter, calculating precise exhaust coefficients.
*   **Motorcycle Travel**: Distinguishes engine categories using calibrated displacement indexes:
    *   *Under 125cc*: Highly efficient city commute scooters.
    *   *125cc to 500cc*: Typical mid-size standard commuter motorcycles.
    *   *Over 500cc*: High-displacement hobby/touring bikes with heavier footprints.
*   **Public Transit**: Captures shared rails/buses to weigh transit benefits versus personal automobile use.
*   **Utility & Core Energy Load**: Feeds electricity consumption (kWh/month) and natural gas consumption (Therms/month) directly against localized grid emissions data.
*   **Behavioral Diet Indexing**: Tracks meat density (heavy consumption, regular, vegetarian, vegan) as diet choices exert a monumental impact on overall land-use emissions.
*   **Waste & Core Recycling**: Factors paper, plastic, and compost activities to deliver customized carbon offset deductions.

### 2. Trends & Savings Dashboard (Visual Forecasting)
A dashboard designed to provide visually compelling feedback for daily sustainable choices:

*   **Forecast Charting Matrix**: Projects visual trends indicating how your carbon footprint declines over twelve months as actions are accomplished.
*   **Emissions Breakdown Donut**: Divides your current emissions by categories (Mobility, Energy, Consumption) to highlight high-impact sectors.
*   **Daily Quick-Action Logger**: Fast, micro-habit logger to record immediate green actions:
    *   🌿 *Plant-based meal selection*: Subtracts 1.5 kg CO₂.
    *   🚲 *Cycle and skip short car trip*: Subtracts 2.0 kg CO₂.
    *   🔌 *De-activate phantom power loops*: Subtracts 0.5 kg CO₂.
    *   🧺 *Hang and air-dry washing*: Subtracts 1.0 kg CO₂.
*   **Recalculation Loop**: Every logged action recalculates your statistics on-the-fly, showing immediate visual improvements.

### 3. Actions & Badges Hub (Gamified Tasks Checklist)
Combines structured environmental challenges with progression indices:

*   **Tiered Difficulties**: Tasks are organized into Easy, Medium, and Hard milestones to provide realistic progression pathways.
*   **Action Categories**: Encompasses home upgrades, heating system calibrations, organic composting, and solar/wind green utility choices.
*   **Automated Badge Unlocking**: Track and achieve milestone requirements to unlock unique badges:
    *   🌱 *Seed Badge*: Issued for compiling your initial baseline footprint.
    *   🚴 *Green Commuter*: Awarded for switching active transport routes.
    *   ⚡ *Power Saver*: Unlocked by implementing phantom-voltage control.
    *   👑 *Net-Zero Champion*: The highest accolade for logging substantial cumulative carbon offsets.

### 4. Social Slide & Campaign Creator (Social Impact Shareable Generator)
Empowers users to share their sustainable journey and raise corporate/peer awareness:

*   **Interactive 5-Slide Carousel Layout**: Visually drafts your real-time carbon roadmap, category breakdowns, commitment levels, and carbon achievements.
*   **Multi-Platform Caption Selector**: Instantly shapes tailored social-optimized post descriptions with proper hashtags for LinkedIn, Instagram, Facebook, Twitter, and WhatsApp.
*   **High-Fidelity PNG Export**: Generates crispy, high-resolution PNG image cards of your slides for quick uploads to social timelines.
*   **Slide Summary Text Outline**: Allows exporting a structured carbon outline file as a solid fallback manifest.

---

## 🔒 Security, Privacy & Design Implementation

*   **Desktop & Mobile Symmetry**: Designed with an elegant responsive layout. Smaller devices employ a smooth, custom bottom-sheet action drawer to avoid intrusive screen-blurring.
*   **Dual Typography Hierarchy**: Uses **Inter** for legible UI controls, and elegant **Playfair Serif** for brand statements, establishing a strong and distinctive visual identity.
*   **Privacy-First & Secure**: Operates entirely client-side using `localStorage`, requiring no cloud database authentication, preserving user privacy. All inputs and projections are run locally in the sandboxed preview environment.
