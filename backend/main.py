from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import requests
from datetime import datetime

# 1. Initialize FastAPI App
app = FastAPI(
    title="Q-Sure AI API", 
    description="Backend for Guidewire DEVTrails 2026 - Dynamic Pricing & Triggers"
)

# 2. Enable CORS (CRITICAL: This allows your teammate's React/Flutter app to talk to your API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Load the LightGBM Model
print("Loading LightGBM Pricing Model...")
try:
    pricing_model = joblib.load('qsure_pricing_model.pkl')
    print(" Model Loaded Successfully!")
except Exception as e:
    print(" Error loading model. Make sure qsure_pricing_model.pkl is in this folder!")

# 4. Define the Data Structure (What the UI will send us)
class PremiumRequest(BaseModel):
    zone_risk_score: int
    forecasted_rainfall_mm: float
    forecasted_max_temp_c: float
    upcoming_event_flag: int

# --- API ENDPOINTS ---

@app.get("/")
def health_check():
    """Simple check to make sure the server is running."""
    return {"status": "Active", "system": "Q-Sure AI Backend is Online 🟢"}

@app.post("/calculate_premium")
def calculate_premium(request: PremiumRequest):
    """
    RECEIVES: 7-day weather/risk forecast from the UI.
    RETURNS: AI-calculated Weekly Premium + Dynamic Coverage Hours.
    """
    # Format the incoming JSON into a Pandas DataFrame for LightGBM
    input_df = pd.DataFrame([[
        request.zone_risk_score,
        request.forecasted_rainfall_mm,
        request.forecasted_max_temp_c,
        request.upcoming_event_flag
    ]], columns=['zone_risk_score', 'forecasted_rainfall_mm', 'forecasted_max_temp_c', 'upcoming_event_flag'])
    
    # Let the AI predict the price!
    predicted_price = pricing_model.predict(input_df)[0]
    final_premium = int(round(predicted_price)) # Convert to standard integer
    
    # THE GUIDEWIRE FLEX: Dynamic Coverage Hours!
    # Base coverage is 10 hours/day. If extreme risk is detected, we dynamically increase it.
    coverage_hours = 10
    ai_reasoning = "Standard risk assessment applied. Safe zone discount active."
    
    if request.forecasted_rainfall_mm > 20:
        coverage_hours = 14
        ai_reasoning = "High rainfall predicted. We dynamically increased your daily coverage to 14 hours."
    elif request.upcoming_event_flag == 1:
        coverage_hours = 12
        ai_reasoning = "Upcoming Bandh/VIP event detected. Coverage hours extended to 12 hours."
    elif request.forecasted_max_temp_c > 41:
        coverage_hours = 12
        ai_reasoning = "Severe heatwave forecast. Coverage extended to protect afternoon earnings."
        
    # Return the response to the Frontend UI
    return {
        "weekly_premium_inr": final_premium,
        "currency": "INR",
        "dynamic_coverage_hours_per_day": coverage_hours,
        "ai_reasoning": ai_reasoning
    }

OPENWEATHER_API_KEY = "YOUR_API_KEY_HERE" # Leave blank to use Mock data
USER_WALLET = {"balance_inr": 0, "last_payout_time": None}

# --- PARAMETRIC RULES ENGINE ---

def evaluate_parametric_triggers(weather_data, traffic_data, platform_data):
    """
    The core logic that decides if a worker gets paid.
    """
    payout_triggered = False
    reason = "All systems normal."

    # 1. TRIGGER: Flash Flood (Rain + Traffic)
    if weather_data['rain_mm'] > 15 and traffic_data['speed_kmh'] < 8:
        payout_triggered = True
        reason = "FLASH FLOOD DETECTED: Heavy rain and gridlock confirmed in your zone."

    # 2. TRIGGER: Extreme Heatwave
    elif weather_data['temp_c'] > 42:
        payout_triggered = True
        reason = "HEATWAVE ALERT: Temperature exceeds 42°C. Safety payout initiated."

    # 3. TRIGGER: VVIP Gridlock / Social Unrest
    elif traffic_data['speed_kmh'] < 3 and platform_data['store_status'] == "PAUSED":
        payout_triggered = True
        reason = "ZONE LOCKDOWN: VVIP Movement or Social Unrest detected. Dark Store offline."

    return payout_triggered, reason

# --- NEW ENDPOINTS ---

@app.get("/check_triggers/{zone}")
def check_triggers(zone: str, use_simulator: bool = False):
    """
    This is the heart of the Parametric System. 
    It fetches live data and decides if Ramesh gets paid.
    """
    # 1. Fetch Data (Real Weather or Mock)
    if not use_simulator and OPENWEATHER_API_KEY != "YOUR_API_KEY_HERE":
        # REAL API CALL (Optional)
        # weather = requests.get(f"https://api.openweathermap.org/data/2.5/weather?q={zone}&appid={OPENWEATHER_API_KEY}").json()
        # rain_mm = weather.get('rain', {}).get('1h', 0)
        # temp_c = weather['main']['temp'] - 273.15
        pass 
    else:
        # MOCK DATA (Safe defaults)
        rain_mm = 0.0
        temp_c = 32.0
        avg_speed = 22.0
        store_status = "ACTIVE"

    # 2. THE "GOD MODE" OVERRIDE (For the Demo Video)
    if use_simulator:
        rain_mm = 25.0
        avg_speed = 4.2
        temp_c = 28.0
        store_status = "PAUSED"

    # 3. Evaluate Triggers
    weather_data = {'rain_mm': rain_mm, 'temp_c': temp_c}
    traffic_data = {'speed_kmh': avg_speed}
    platform_data = {'store_status': store_status}
    
    is_triggered, alert_msg = evaluate_parametric_triggers(weather_data, traffic_data, platform_data)

    # 4. If triggered, update the Wallet instantly!
    payout_amount = 0
    if is_triggered:
        payout_amount = 100 # ₹100 per hour of disruption
        USER_WALLET["balance_inr"] += payout_amount
        USER_WALLET["last_payout_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "zone": zone,
        "disruption_active": is_triggered,
        "alert_message": alert_msg,
        "data_snapshot": {
            "rainfall": f"{rain_mm}mm",
            "traffic_speed": f"{avg_speed}km/h",
            "store": store_status
        },
        "payout_status": {
            "credited_amount": payout_amount,
            "current_wallet_balance": USER_WALLET["balance_inr"],
            "timestamp": USER_WALLET["last_payout_time"]
        }
    }

@app.get("/user_wallet")
def get_wallet():
    return USER_WALLET


