from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

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