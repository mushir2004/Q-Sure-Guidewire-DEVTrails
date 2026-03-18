# ⚡ Q-Sure: AI-Powered Income Assurance for India's Gig Economy

**Guidewire DEVTrails 2026 - Phase 1 Submission**  
**Theme:** Ideate & Know Your Delivery Worker  
**Team Name:** The Damned

---

## 🎯 1. The Problem & Persona Focus

**The Persona:** Q-Commerce / 10-Minute Grocery Delivery Partners (e.g., Zepto, Blinkit, Swiggy Instamart).  

**The Core Vulnerability:** 
India's platform-based Q-Commerce workers operate under extreme micro-radius constraints (2–3 km) and rely heavily on daily order streaks for a living wage. Unlike standard e-commerce delivery drivers (Amazon/Flipkart) who have 12-hour delivery windows and can reroute around a flooded street, a Q-Commerce rider is completely paralyzed by localized disruptions. 

A sudden 2-hour torrential downpour, an unplanned political Bandh (curfew), or a VVIP gridlock forces the local "Dark Store" to pause operations. When this happens, the rider's daily incentive streak is destroyed. They absorb 100% of this financial shock with zero safety net. 

**Our Solution:** **Q-Sure** is a zero-touch, AI-enabled parametric insurance platform that guarantees hourly wage payouts when hyper-local external disruptions halt deliveries. 

> ⚠️ **Golden Rule Compliance:** Q-Sure strictly provides a safety net for **LOSS OF INCOME ONLY**. It explicitly excludes features for vehicle repairs, health insurance, or accident medical bills.

---

## 🚴 2. Persona-Based Scenario: The Q-Sure Workflow

**Meet Ramesh (Q-Commerce Rider in Koramangala, Bengaluru):**
1. **Onboarding:** Ramesh links his platform ID. The AI profiles his specific 3km operating zone.
2. **Weekly Coverage:** Based on next week's forecast, his dynamic premium is set at **₹35/week**. This is seamlessly auto-deducted from his platform wallet on Monday.
3. **The Disruption:** On Wednesday at 4:00 PM, an unplanned local political strike (*Bandh*) forces shops to close. The Dark Store pauses operations. Ramesh is stranded.
4. **Parametric Automation (Zero-Touch Claim):** Q-Sure's backend monitors NLP News Scrapers and Traffic APIs, detects the localized Bandh, verifies the Dark Store is offline, and initiates an automatic claim.
5. **Instant Payout:** Ramesh receives a mobile push notification: *"Local Zone Lockdown Detected. ₹200 credited to your UPI for 2 lost hours."* He never filed a manual claim, submitted a photo, or talked to an agent.

---

## 💸 3. The Financial Architecture (Weekly Premium Model)

Gig workers live week-to-week; annual or monthly premiums are financially unviable. Q-Sure operates on a **Dynamic Weekly Micro-Premium Model** structured precisely around the standard gig payout cycle (typically Mondays/Tuesdays).

* **The AI Pricing Engine:** Base premium is ₹20/week. An AI model recalculates the risk every Sunday night. If the 7-day forecast predicts heavy monsoon showers or scheduled VVIP rallies in the rider's zone, the premium dynamically adjusts (e.g., up to ₹45/week).
* **Hourly Wage Replacement:** We do not pay arbitrary lump sums. Q-Sure pays a survival baseline of **₹100 for every hour** of verified disruption.
* **Liquidity Protection:** Payouts are capped at ₹300/day or ₹1,000/week to protect the insurer from catastrophic, city-wide, week-long shutdowns (which classify as government emergencies, not micro-insurance events).

### 🏗️ Q-Sure Financial & Workflow Architecture

```mermaid
graph TD
    %% Define Styles
    classDef user fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef ai fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff;
    classDef system fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef external fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    %% Nodes
    A[Sunday Night: AI Scans 7-Day Weather & Event Forecast]:::ai
    B[AI Calculates Dynamic Weekly Premium: ₹20 - ₹45]:::ai
    C[Monday: Premium Auto-Deducted from Platform Wallet]:::system
    D[Policy Active for the Week]:::user
    
    E{External Disruption Occurs}:::external
    
    F[Parametric Trigger APIs Breach Threshold]:::system
    G[Mock Platform API Confirms 'Rider Online 30 mins prior']:::system
    H[AI Fraud Check: GPS Trajectory & Sensor Fusion]:::ai
    
    I{Are all conditions met?}:::system
    J[Claim Denied / Flagged for Escrow]:::external
    K[Zero-Touch Claim Initiated]:::system
    L[Instant UPI Payout: ₹100/hr of Disruption]:::user

    %% Connections
    A --> B --> C --> D --> E
    E --> F
    F --> G --> H --> I
    I -- No --> J
    I -- Yes --> K --> L

## ⚡ 4. The 4 Parametric Triggers (Real-Time Monitoring)

Unlike standard insurance, Q-Sure eliminates manual claim adjusters. We use **Multi-API Consensus** to trigger zero-touch automated payouts. We have identified 4 India-specific micro-disruptions that paralyze Q-Commerce:

1. **Environmental: Flash Floods & Waterlogging**
   * *The Reality:* Indian cities flood fast. Bikes stall; underpasses become unnavigable.
   * *Trigger Logic:* `IF` OpenWeather API (`Rainfall > 15mm/hr`) `AND` Mock Traffic API (`Avg Speed < 8 km/h` in a 3km radius).

2. **Environmental: Extreme Heatwaves (IMD Red Alerts)**
   * *The Reality:* Riding in 43°C heat causes heatstroke. Platforms often algorithmically limit delivery radii or mandate breaks during peak afternoon hours, causing riders to lose prime earning incentives.
   * *Trigger Logic:* `IF` Weather API (`Temp > 42°C` sustained between 1 PM and 4 PM) `AND` Platform API (`Rider Status == Forced Break`).

3. **Social: Unplanned Curfews & Strikes (Bandhs)**
   * *The Reality:* Sudden political strikes or Section 144 orders force local markets to shut down instantly, leaving gig workers stranded with no warning.
   * *Trigger Logic:* `IF` NLP News Scraper detects high volume of "Bandh/Strike" alerts in the local PIN code `AND` Platform API confirms the local Dark Store is offline.

4. **Infrastructure: VVIP Movements & Micro-Gridlocks (Our Innovation)**
   * *The Reality:* A political rally or VVIP convoy can barricade a 2km radius. A Q-Commerce rider is trapped and cannot complete their 10-minute SLAs.
   * *Trigger Logic:* `IF` Traffic API shows a "Black Route" (`Speed < 2 km/h` or complete standstill for > 45 continuous minutes) `AND` Rider GPS confirms they are inside the gridlocked polygon.

---

## 📱 5. Platform Choice & Justification (Hybrid Architecture)

*Requirement: Justify your choice between a Web or Mobile platform.*

Q-Sure requires a **Hybrid Architecture** because it serves two distinct personas with vastly different needs:

1. **For the Rider: Native Mobile App (React Native/Flutter)**
   * *Why?* Gig workers do not own laptops; their entire livelihood is managed via their smartphones mounted on their bike handlebars. A mobile app is mandatory to push real-time trigger notifications (*"₹100 credited to UPI"*), and most importantly, to run background **hardware sensor telemetry** (accelerometer, gyroscope, battery temp) required for our anti-spoofing engine.
2. **For the Insurer/Admin: Web Dashboard (Next.js)**
   * *Why?* Underwriters and risk managers require complex, large-screen interfaces. A Web Dashboard is the optimal choice to monitor real-time geospatial city maps, track active risk zones (Red/Green/Yellow), analyze financial loss ratios, and review AI anomaly flags.

---

## 🚨 6. Adversarial Defense & Anti-Spoofing Strategy
*(Response to the Phase 1 Syndicate Crisis Injection)*

**The Threat:** A sophisticated syndicate of 500 delivery workers organizing via Telegram to use advanced GPS-spoofing applications to fake their locations into "Red Alert" zones while resting safely at home, instantly draining the liquidity pool. Simple GPS distance checks (Time-Travel anomalies) are officially obsolete against this attack.

**Our Defense:** To protect Q-Sure, we shift from basic location tracking to **Multimodal Sensor Fusion and Graph-Based Anomaly Detection**.

### 1. The Differentiation (Sensor Fusion - Device Physics)
A genuinely stranded Q-Commerce delivery partner interacts with their physical environment (rain, traffic, heat). A bad actor spoofing from their couch produces a synthetic, sterile data signature. 
Our AI (Isolation Forest) analyzes native OS telemetry:
* **Accelerometer & Gyroscope:** A rider on a bike produces micro-vibrations. A spoofed phone sitting flat on a table has a dead-zero Z-axis reading.
* **Barometric Pressure (Altitude):** Spoofers rarely fake altitude. If a rider claims to be in a flooded underpass, but their barometer reads an altitude of 45 meters (e.g., a 12th-floor apartment), the claim is flagged.
* **Thermal Data:** A device outdoors in an Indian heatwave will show high CPU temps and steep battery drain. A plugged-in device at 25°C is highly anomalous.

### 2. The Data (Graph ML for Syndicate Detection)
To detect coordinated fraud rings, Q-Sure maps real-time claims as a network graph. If 50 riders suddenly trigger payouts from the *exact same 6-decimal latitude/longitude coordinate* (botnet behavior), or if multiple claims share the exact same **Wi-Fi BSSID (router MAC address)**, the AI detects a coordinated cluster and freezes the zone.

### 3. The UX Balance (Escrow & Graceful Degradation)
Network drops and GPS bounce are common in severe weather. We cannot unfairly penalize an honest worker whose signal scrambles in a storm. 
* **The "Escrow" Workflow:** If flagged, the app does *not* ban the user. The payout enters a **24-Hour Quarantine State**. 
* **Dynamic Escape Hatch:** The UI friendly notifies the rider: *"Network instability detected. Your payout is secured in Escrow."* If they want instant release, the app triggers a "Liveness Check"—asking them to take a live photo of the flooded street or barricade. The image metadata (EXIF) instantly overrides the AI flag and releases the funds.

### 🧠 Anti-Spoofing AI Architecture Diagram

```mermaid
graph TD
    classDef anomaly fill:#ef4444,stroke:#991b1b,stroke-width:2px,color:#fff;
    classDef process fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;
    classDef pass fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff;
    classDef user fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff;

    A[Parametric Claim Triggered]:::process --> B{Graph ML: Syndicate Check}:::process
    B -- Identical BSSID / Lat-Long Match --> C[Flag: Botnet/Syndicate]:::anomaly
    B -- Normal Distribution --> D{Sensor Fusion Isolation Forest}:::process
    
    D -- Dead Accelerometer / Abnormal Temp --> E[Flag: Synthetic Device Physics]:::anomaly
    D -- Valid Telemetry --> F[Approve Claim: Genuine User]:::pass
    
    C --> G[Funds Placed in 24-Hour Escrow]:::process
    E --> G
    
    G --> H{User Action: Liveness Check}:::user
    H -- Uploads Valid Live Photo + EXIF --> F
    H -- Ignores / Fails --> I[Claim Rejected & Account Audited]:::anomaly
    
    F --> J[Instant UPI Disbursement]:::pass
