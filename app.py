from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import time
from flask_cors import CORS

app = Flask(__name__)  # ✅ Fixed name issue
CORS(app)  # Enable CORS (if frontend like React is used)

# Load the trained model and scaler
model = joblib.load("fraud_detection_model.pkl")
try:
    # scaler = joblib.load("scaler.pkl")  # Commenting out scaler loading
    pass  # Add pass statement to fix indentation error
except FileNotFoundError as e:

    raise Exception("Scaler file not found. Please check the file path.") from e


# Define feature order
top_features = ['amt', 'category', 'gender', 'unix_time', 'Unnamed: 0', 'city_pop']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json  # Get JSON data from request

        # Convert normal time to Unix time if provided
        if 'time' in data:
            try:
                data['unix_time'] = int(time.mktime(time.strptime(data['time'], "%Y-%m-%d %H:%M:%S")))
            except ValueError:
                return jsonify({"error": "Invalid time format. Use YYYY-MM-DD HH:MM:SS"})

        # Check if all required features are in data
        missing_features = [feature for feature in top_features if feature not in data]
        if missing_features:
            return jsonify({"error": f"Missing features: {', '.join(missing_features)}"})


        # Extract feature values in the correct order
        input_data = np.array([[data[feature] for feature in top_features]])

        # Skip scaling the features
        # input_data_scaled = scaler.transform(input_data)  # Commenting out scaling

        input_data_scaled = input_data  # Use raw input data for prediction
        print(input_data_scaled)


        # Make prediction
        prediction = model.predict(input_data_scaled)[0]
        result = "Fraudulent Transaction 🚨" if prediction ==1 else "Legitimate Transaction ✅"

        return jsonify({"prediction": result})
    
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)  # Set to False in production
