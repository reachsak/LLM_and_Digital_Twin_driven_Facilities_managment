import csv
import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    data = []
    start_time = datetime(2024, 6, 4)
    
    for i in range(24 * 60):  # 24 hours * 60 minutes
        timestamp = start_time + timedelta(minutes=i)
        
        # Temperature (15-30°C)
        temperature = round(random.uniform(15, 30), 2)
        
        # Humidity (30-70%)
        humidity = round(random.uniform(30, 70), 2)
        
        # Lux intensity (0-1000 lux)
        lux_intensity = round(random.uniform(0, 1000), 2)
        
        # CO2 level (400-2000 ppm)
        co2_level = round(random.uniform(400, 2000), 2)
        
        # Room occupancy (0-40)
        occupancy = random.randint(0, 40)
        
        # Smart devices levels (0-100)
        fan_speed = random.randint(0, 100)
        lighting_level = random.randint(0, 100)
        humidifier_level = random.randint(0, 100)
        air_purifier_level = random.randint(0, 100)
        
        # Adjust values based on time of day and special scenarios
        hour = timestamp.hour
        if 9 <= hour < 17:  # Classroom hours
            if random.random() < 0.7:  # 70% chance of normal classroom scenario
                occupancy = random.randint(20, 40)
                lux_intensity = round(random.uniform(300, 1000), 2)
            elif random.random() < 0.5:  # 15% chance of high occupancy, low performance
                occupancy = random.randint(30, 40)
                fan_speed = random.randint(0, 30)
                lighting_level = random.randint(0, 30)
                humidifier_level = random.randint(0, 30)
                air_purifier_level = random.randint(0, 30)
            else:  # 15% chance of low occupancy, high performance
                occupancy = random.randint(0, 10)
                fan_speed = random.randint(70, 100)
                lighting_level = random.randint(70, 100)
                humidifier_level = random.randint(70, 100)
                air_purifier_level = random.randint(70, 100)
        elif 22 <= hour or hour < 6:  # Night hours
            occupancy = random.randint(0, 5)
            lux_intensity = round(random.uniform(0, 50), 2)
        
        # Calculate energy usage based on device levels
        energy_usage = round(
            (fan_speed * 0.5 + 
             lighting_level * 0.3 + 
             humidifier_level * 0.2 + 
             air_purifier_level * 0.4) * 0.01 * random.uniform(0.9, 1.1), 
            2
        )
        
        # Adjust humidity based on humidifier level
        humidity += humidifier_level * 0.1
        humidity = min(max(humidity, 30), 70)
        
        # Adjust CO2 level based on air purifier level and occupancy
        co2_level -= air_purifier_level * 2
        co2_level += occupancy * 5
        co2_level = min(max(co2_level, 400), 2000)
        
        data.append([
            timestamp.strftime("%d/%m/%y %H:%M"),
            temperature,
            humidity,
            lux_intensity,
            co2_level,
            occupancy,
            fan_speed,
            lighting_level,
            humidifier_level,
            air_purifier_level,
            energy_usage
        ])
    
    return data

def save_to_csv(data, filename):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow([
            'Timestamp', 'Temperature (C)', 'Humidity (%)', 'Lux Intensity', 
            'CO2 Level (ppm)', 'Occupancy', 'Fan Speed', 'Lighting Level', 
            'Humidifier Level', 'Air Purifier Level', 'Energy Usage (kWh)'
        ])
        writer.writerows(data)

# Generate and save the data
synthetic_data = generate_synthetic_data()
save_to_csv(synthetic_data, 'enhanced_synthetic_sensor_data.csv')

print("Enhanced synthetic dataset has been generated and saved to 'enhanced_synthetic_sensor_data.csv'")