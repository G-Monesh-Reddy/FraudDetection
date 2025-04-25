import requests
import json

url = "http://127.0.0.1:5000/predict"
payload = {
    "amt": 100.0,  # Ensure amt is a float
    "category": 1,  # Encode category as numeric
    "gender": 0,  # Encode gender as numeric
    "time": "2023-10-01 12:00:00",
    "Unnamed: 0": 1.0,  # Ensure Unnamed: 0 is a float
    "city_pop": 5000.0  # Ensure city_pop is a float
}
response = requests.post(url, json=payload)

print(response.status_code)
print(response.json())
