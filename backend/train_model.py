import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import lightgbm as lgb

print(" Training AI Pricing Model using LightGBM...")

# 1. Load the data
df = pd.read_csv('qsure_training_data.csv')

# 2. Define Features (X) and Target (y)
X = df[['zone_risk_score', 'forecasted_rainfall_mm', 'forecasted_max_temp_c', 'upcoming_event_flag']]
y = df['weekly_premium_inr']

# 3. Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Initialize and Train the LightGBM Model
# LightGBM is highly optimized for tabular data and handles edge cases beautifully
model = lgb.LGBMRegressor(
    n_estimators=100, 
    learning_rate=0.1, 
    max_depth=4, 
    random_state=42,
    importance_type='gain'
)
model.fit(X_train, y_train)

# 5. Evaluate the Model
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f" LightGBM Model Performance:")
print(f"   - Mean Absolute Error: ₹{mae:.2f} (Avg error in premium calculation)")
print(f"   - R2 Score (Accuracy): {r2:.3f}")

# Optional: Print Feature Importance so you can explain it in your video!
print("\n Feature Importance (What drives the premium up?):")
importances = model.feature_importances_
for feature, imp in zip(X.columns, importances):
    print(f"   - {feature}: {imp:.1f}")

# 6. Save the model to disk for the FastAPI backend
joblib.dump(model, 'qsure_pricing_model.pkl')
print("\n LightGBM Model successfully saved as 'qsure_pricing_model.pkl'")

# --- Testing a Live Prediction ---
print("\n Testing a Live Prediction:")
# Scenario: High Risk Zone (8), Heavy Rain Forecast (25mm), Normal Temp (30C), No VIP Event (0)
test_scenario = pd.DataFrame([[8, 25.0, 30.0, 0]], columns=X.columns)
predicted_price = model.predict(test_scenario)[0]
print(f"   Scenario -> Zone Risk: 8, Rain: 25mm, Temp: 30°C, Event: No")
print(f"   Calculated Premium: ₹{round(predicted_price)}")