import Adafruit_DHT
import csv
import datetime
import time
from smbus2 import SMBus
import RPi.GPIO as GPIO

# Set up sensor type and GPIO pin
sensor = Adafruit_DHT.DHT11
pin = 17

# BH1750 address and mode configuration
BH1750_I2C_ADDR = 0x23
BH1750_MODE = 0x10

# MQ-2 sensor pin configuration
MQ2_PIN = 4  # Replace with the GPIO pin you connected the MQ-2 sensor to

# Setup GPIO for MQ-2 sensor
GPIO.setmode(GPIO.BCM)
GPIO.setup(MQ2_PIN, GPIO.IN)

# Function to read lux data from BH1750
def read_lux():
    with SMBus(1) as bus:
        data = bus.read_i2c_block_data(BH1750_I2C_ADDR, BH1750_MODE, 2)
        lux = (data[0] << 8) | data[1]
        return lux / 1.2  # Convert to lux

# Function to read CO2 data from MQ-2
def read_co2():
    # Placeholder for actual analog-to-digital conversion
    co2_level = GPIO.input(MQ2_PIN)  # Replace with actual calibrated data
    return co2_level

# Function to read sensor data
def read_sensor_data():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
    lux = read_lux()
    co2_level = read_co2()
    return humidity, temperature, lux, co2_level

# Function to log data into CSV file
def log_sensor_data():
    filename = "sensor_data_log.csv"

    while True:
        try:
            humidity, temperature, lux, co2_level = read_sensor_data()

            # Get the current timestamp in ISO 8601 format
            timestamp = datetime.datetime.utcnow().isoformat() + "Z"

            # Write data to CSV file
            with open(filename, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([timestamp, temperature, humidity, lux, co2_level])

            # Wait for 5 seconds before logging the next data
            time.sleep(3)

        except KeyboardInterrupt:
            print("Logging stopped by the user.")
            break

if __name__ == "__main__":
    try:
        log_sensor_data()
    except Exception as e:
        print(f"Error: {e}")
