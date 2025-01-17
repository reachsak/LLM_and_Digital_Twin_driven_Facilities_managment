import csv
import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    data = []
    start_time = datetime(2024, 6, 4)
    
    for i in range(24 * 60):  # 24 hours * 60 minutes
        timestamp = start_time + timedelta(minutes=i)
        
        # Generate temperature (15-30°C)
        temperature = round(random.uniform(15, 30), 2)
        
        # Generate fan speed (0-100)
        fan_speed = random.randint(0, 100)
        
        # Generate room occupancy (0-20)
        occupancy = random.randint(0, 20)
        
        # Generate energy usage (kWh) based on fan speed
        energy_usage = round(fan_speed * 0.01 * random.uniform(0.8, 1.2), 2)
        
        # Adjust values based on time of day
        hour = timestamp.hour
        if 9 <= hour < 17:  # Classroom hours
            occupancy = random.randint(10, 20)
        elif 22 <= hour or hour < 6:  # Night hours
            occupancy = random.randint(0, 3)
        
        # Sometimes high fan speed with low occupancy and high energy usage
        if random.random() < 0.1:
            fan_speed = random.randint(80, 100)
            occupancy = random.randint(0, 5)
            energy_usage = round(fan_speed * 0.015 * random.uniform(1.0, 1.3), 2)
        
        data.append([
            timestamp.strftime("%d/%m/%y %H:%M"),
            temperature,
            fan_speed,
            occupancy,
            energy_usage
        ])
    
    return data

def save_to_csv(data, filename):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Timestamp', 'Temperature (C)', 'Fan Speed', 'Occupancy', 'Energy Usage (kWh)'])
        writer.writerows(data)

# Generate and save the data
synthetic_data = generate_synthetic_data()
save_to_csv(synthetic_data, 'synthetic_sensor_data.csv')

print("Synthetic dataset has been generated and saved to 'synthetic_sensor_data.csv'")