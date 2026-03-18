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
