import pandas as pd
import numpy as np
import random

# Day 1: Generating Synthetic Data for Q-Sure Dynamic Pricing
print("Generating Q-Sure Synthetic Dataset...")

# Parameters
NUM_SAMPLES = 5000

# Features
# 1. Zone Risk Score (1 to 10): 10 means highly prone to waterlogging (e.g., Koramangala/Silk Board)
zone_risk_scores = np.random.randint(1, 11, NUM_SAMPLES)

# 2. Forecasted Rainfall in mm (0 to 100)
forecasted_rainfall = np.random.exponential(scale=10, size=NUM_SAMPLES)

# 3. Forecasted Max Temperature in Celsius (25 to 46)
forecasted_temp = np.random.normal(loc=35, scale=5, size=NUM_SAMPLES)
forecasted_temp = np.clip(forecasted_temp, 25, 46)

# 4. Upcoming VIP Event or Bandh/Strike (0 = No, 1 = Yes)
# Events happen about 15% of the time
upcoming_events = np.random.choice([0, 1], p=[0.85, 0.15], size=NUM_SAMPLES)

# Calculate Target Variable: Weekly Premium (₹20 to ₹45)
# Base premium is ₹20. We add risk penalties based on the features.
premiums =[]
for risk, rain, temp, event in zip(zone_risk_scores, forecasted_rainfall, forecasted_temp, upcoming_events):
    premium = 20.0  # Base
    
    # Add Zone Penalty (Up to ₹5)
    premium += risk * 0.5
    
    # Add Rain Penalty (If rain > 15mm, add penalty)
    if rain > 15:
        premium += (rain - 15) * 0.3
        
    # Add Heatwave Penalty (If temp > 40C, add penalty)
    if temp > 40:
        premium += (temp - 40) * 1.5
        
    # Add Event Penalty
    if event == 1:
        premium += 5.0
        
    # Add some random noise so the ML model has to actually "learn"
    premium += random.uniform(-2, 2)
    
    # Clip to strictly obey business rules: Min ₹20, Max ₹45
    premium = np.clip(premium, 20, 45)
    premiums.append(round(premium))

# Create DataFrame
df = pd.DataFrame({
    'zone_risk_score': zone_risk_scores,
    'forecasted_rainfall_mm': np.round(forecasted_rainfall, 1),
    'forecasted_max_temp_c': np.round(forecasted_temp, 1),
    'upcoming_event_flag': upcoming_events,
    'weekly_premium_inr': premiums
})

# Save to CSV
df.to_csv('qsure_training_data.csv', index=False)
print(f" Successfully generated 'qsure_training_data.csv' with {NUM_SAMPLES} rows.")
print(df.head())