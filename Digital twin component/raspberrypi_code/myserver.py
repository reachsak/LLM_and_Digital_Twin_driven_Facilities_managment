try:
    from flask import Flask
    from flask_restful import Resource, Api
    from flask_restful import reqparse
    from flask import request
    import time
    import datetime
    import json
    import Adafruit_DHT
    from smbus2 import SMBus
    import RPi.GPIO as GPIO
    print("All modules loaded")
except Exception as e:
    print("Error: {}".format(e))

# Initialize Flask app and API
app = Flask(__name__)
api = Api(app)

# Pin configuration for DHT11 sensor
pin = 17
sensor = Adafruit_DHT.DHT11

# BH1750 address and mode configuration
BH1750_I2C_ADDR = 0x23
BH1750_MODE = 0x10

# MQ-2 sensor pin configuration
MQ2_PIN = 4  # Replace with the GPIO pin you connected the MQ-2 sensor to

# Setup GPIO for MQ-2 sensor
GPIO.setmode(GPIO.BCM)
GPIO.setup(MQ2_PIN, GPIO.IN)

def read_lux(bus, addr):
    """Reads the lux value from the BH1750 sensor"""
    data = bus.read_i2c_block_data(addr, BH1750_MODE, 2)
    lux = (data[0] << 8) | data[1]
    return lux / 1.2  # Convert to lux

def read_co2():
    """Reads the CO2 level from the MQ-2 sensor"""
    # In a real implementation, you'd calibrate the MQ-2 sensor and interpret its analog output.
    # This is a placeholder for GPIO input handling.
    co2_level = GPIO.input(MQ2_PIN)  # Replace with actual analog-to-digital conversion if necessary
    return co2_level  # This will need calibration to return actual ppm values

class Sensors(object):

    def __init__(self):
        self.bus = SMBus(1)  # I2C bus initialization

    def get(self):
        # Read humidity and temperature
        humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
        
        # Read lux level
        lux = read_lux(self.bus, BH1750_I2C_ADDR)
        
        # Read CO2 level
        co2_level = read_co2()

        if humidity is not None and temperature is not None and lux is not None:
            temperature = int(temperature)
            humidity = int(humidity)
            lux = round(lux, 2)
            return {
                'Temperature': temperature,
                "Humidity": humidity,
                "CO2_Level": co2_level,
                "Lux_Level": lux
            }
        else:
            return {"error": "Sensor data could not be read"}

class Controller(Resource):
    def __init__(self):
        pass

    def get(self):
        helper = Sensors()
        return helper.get()

# Add resource to the API
api.add_resource(Controller, "/")

if __name__ == "__main__":
    app.run(host='0.0.0.0')
