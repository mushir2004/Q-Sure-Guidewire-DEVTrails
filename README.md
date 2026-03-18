# ⚡ Q-Sure: AI-Powered Income Assurance for India's Q-Commerce

**Guidewire DEVTrails 2026 - Phase 1 Submission**  
**Theme:** Ideate & Know Your Delivery Worker  
**Team Name:** [The Damned]

---

## 👥 1. The Problem & Persona Focus
**The Persona:** Q-Commerce / 10-Minute Grocery Delivery Partners (e.g., Zepto, Blinkit, Swiggy Instamart).  

**The Vulnerability:** Q-Commerce gig workers operate under extreme micro-radius constraints (2-3 km) and rely heavily on daily order streaks for a living wage. Unlike standard e-commerce delivery drivers who can reroute around a flooded street, a highly localized 2-hour disruption completely halts Q-Commerce operations. Currently, when the Dark Store pauses, the rider absorbs 100% of the financial shock. 

**Our Solution:** **Q-Sure** is a zero-touch, AI-enabled parametric insurance platform that guarantees hourly wage payouts when hyper-local external disruptions halt deliveries. 
*(Note: Per DEVTrails rules, Q-Sure strictly covers LOSS OF INCOME ONLY, explicitly excluding health, life, accidents, or vehicle repairs).*

---

## 🚴 2. Persona-Based Scenario & Workflow
**Meet Ramesh (Zepto Rider in Koramangala, Bengaluru):**
1. **Onboarding:** Ramesh links his platform ID. The AI profiles his 3km operating zone and sets a dynamic premium of **₹38/week**.
2. **The Disruption:** On Wednesday at 4:00 PM, a sudden VVIP Movement barricades the main arterial roads in his zone. The Dark Store pauses operations. Ramesh is stranded.
3. **Parametric Automation (Zero-Touch):** Q-Sure's backend monitors Map APIs, detects the exact parameter breach (Traffic Speed < 2km/h for > 45 mins), and initiates an automatic claim.
4. **Instant Payout:** Ramesh receives a notification: *"Zone Gridlock Detected. ₹200 credited to your UPI for 2 lost hours."* He never filed a manual claim.

---

## 💸 3. The Weekly Premium Model & Financials
Gig workers live week-to-week; annual premiums are unaffordable. Q-Sure operates on a **Weekly Micro-Premium Model** structured around their standard Tuesday payout cycle. 

* **The Pricing Engine:** Base premium is ~₹20-₹45/week, automatically deducted from their platform wallet. The exact amount is dynamically adjusted by AI every Sunday based on the 7-day weather forecast and the rider's primary zone risk score.
* **The Payout (Hourly Wage Replacement):** We pay a baseline survival wage of **₹100 for every hour** of verified disruption, capped at ₹300/day or ₹1,000/week to protect insurer liquidity.
* **The "Active Duty" Rule:** To qualify for a payout, the mock Platform API must confirm the rider was "Online" and in the zone *at least 30 minutes prior* to the disruption, preventing opportunistic logins.

---

## ⚡ 4. The Parametric Triggers (Real-Time Monitoring)
We do not rely on manual claims. Our system uses multi-API consensus to trigger payouts:

1. **VVIP Movement & Micro-Gridlocks (Our Innovation):** 
   * *Logic:* `IF` Traffic API shows speed < 2 km/h for > 45 continuous minutes in a 2km radius `AND` Platform API confirms Dark Store is paused.
2. **Severe Waterlogging / Flash Floods:** 
   * *Logic:* `IF` Rainfall > 15mm/hr (OpenWeather API) `AND` Avg Zone Speed < 8 km/h.
3. **Extreme Heatwaves:** 
   * *Logic:* `IF` sustained Temp > 42°C between 1 PM - 4 PM (compensates for lost peak afternoon incentives when platforms mandate rest).

---

## 🚨 5. Adversarial Defense & Anti-Spoofing Strategy
*(Response to the Phase 1 Syndicate Crisis Injection)*

Simple GPS verification is officially obsolete against organized Telegram syndicates. To protect Q-Sure's liquidity pool, our platform utilizes **Multimodal Sensor Fusion and Graph-Based Anomaly Detection**.

* **The Differentiation (Sensor Fusion):** A genuinely stranded delivery partner interacts with their physical environment. Our AI (Isolation Forest) analyzes native device telemetry—Accelerometer, Gyroscope, Barometric Altitude, and Battery/Thermal drain. A device claiming to be in a 42°C heatwave or a flooded street but showing a dead-zero Z-axis accelerometer (sitting on a table) and 25°C battery temp (AC room) is instantly flagged as synthetic.
* **The Data (Graph ML for Syndicates):** We map real-time claims as a network graph. If 50 riders suddenly trigger payouts from the *exact same 6-decimal lat/long coordinate* or share identical Wi-Fi BSSIDs, the AI detects a coordinated botnet cluster and freezes the zone's automated payouts.
* **The UX Balance (Escrow & Graceful Degradation):** We do not blindly ban users for GPS bounce in bad weather. Flagged claims enter a **24-Hour Escrow State**. The rider receives a notification: *"Network instability detected. Payout is in Escrow."* If they need instant funds, they can trigger a "Liveness Check" (e.g., uploading a live photo of the barricade) where EXIF metadata instantly overrides the AI flag and releases the money.

---

## 📱 6. Platform Choice: Hybrid Architecture Justification
* **Mobile App for Riders:** Gig workers manage their entire livelihood via smartphones mounted on their bikes. For optimized onboarding, real-time push notifications of automated triggers, and background sensor-fusion telemetry, a lightweight Mobile App (React Native/Flutter) is mandatory.
* **Web Dashboard for Insurers:** Underwriters and Admins require complex, large-screen interfaces to monitor geospatial map analytics, active risk zones across the city, live AI anomalies, and financial loss ratios. A Web Dashboard (Next.js) is the optimal choice for this persona.

---

## 🧠 7. AI/ML Integration Plan
1. **Dynamic Weekly Pricing (LightGBM):** Predicts expected disruption risk for a pin code. Uses feature engineering on historical rainfall lags, 7-day weather forecasts, and historical zone vulnerability.
2. **Intelligent Fraud Detection (Isolation Forest):** Detects time-travel anomalies (e.g., pinging in two zones 15km apart within 2 minutes = speed > 400km/h) and executes the Sensor Fusion logic detailed above.

---

## 🛠 8. Tech Stack & Development Plan
* **Frontend:** React Native / Expo (Rider App) | Next.js & TailwindCSS (Admin Web).
* **Backend:** Python (FastAPI) - Chosen for seamless ML model integration and train-serve parity.
* **AI/ML:** Scikit-learn, LightGBM, Pandas, NetworkX (Graph ML).
* **Integrations:** OpenWeather API, TomTom/Google Maps API (Mocked), Razorpay Sandbox (Simulated Instant Payouts).
* **Database:** PostgreSQL with PostGIS (for geospatial tracking).

### The 6-Week Development Roadmap
* **Phase 1 (Weeks 1-2):** Ideation, persona locking, UI/UX prototyping, and workflow architecture setup. *(Current)*
* **Phase 2 (Weeks 3-4):** Build executable source code. Link mock APIs (Weather/Traffic), build the dynamic pricing ML script, and simulate the core zero-touch claim automation.
* **Phase 3 (Weeks 5-6):** Integrate Razorpay Sandbox for payouts, finalize the Advanced Fraud Detection (Sensor Fusion) model, deploy Analytics Dashboard, and record the 5-minute final demo.

---

## 🔗 9. Deliverables
* **Phase 1 Prototype Video (2-mins):** [Insert YouTube/Drive Link Here]
* **Figma UI Mockups:** [Insert Figma Link Here]
