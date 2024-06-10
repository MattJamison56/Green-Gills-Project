import firebase_admin
from firebase_admin import credentials, db
import time
from datetime import datetime
import os
import glob
import spidev

# Path to the Firebase credentials JSON file
cred = credentials.Certificate('firebase-cert.json')

# Initialize the app with a service account
firebase_admin.initialize_app(cred, {
  'databaseURL': 'https://green-gills-default-rtdb.firebaseio.com/'
})

# SPI setup for TDS and pH sensors
spi = spidev.SpiDev()
spi.open(0, 0)
spi.max_speed_hz = 1350000

# Function to read SPI data from MCP3008 chip
def read_channel(channel):
    adc = spi.xfer2([1, (8 + channel) << 4, 0])
    data = ((adc[1] & 3) << 8) + adc[2]
    return data

# Define sensor channels
TDS_channel = 0
pH_channel = 2

# Conversion functions
def convert_tds(raw_value):
    voltage = (raw_value * 3.3) / 1023
    tds_value = voltage * 500  # Example conversion factor, adjust as necessary
    return tds_value

def convert_ph(raw_value):
    voltage = (raw_value * 3.3) / 1023
    # Example conversion formula: Adjust based on your sensor's datasheet
    ph_value = (voltage - 2.5) * -3.5 + 7  # For a sensor with 0-14 pH range centered at 2.5V
    return ph_value

# Temperature sensor setup
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folders = glob.glob(base_dir + '28*')
if device_folders:
    device_folder = device_folders[0]
    device_file = device_folder + '/w1_slave'

    def read_temp_raw():
        with open(device_file, 'r') as f:
            lines = f.readlines()
        return lines

    def read_temp():
        lines = read_temp_raw()
        while lines[0].strip()[-3:] != 'YES':
            time.sleep(0.2)
            lines = read_temp_raw()
        equals_pos = lines[1].find('t=')
        if equals_pos != -1:
            temp_string = lines[1][equals_pos + 2:]
            temp_c = float(temp_string) / 1000.0
            temp_f = temp_c * 9.0 / 5.0 + 32.0
            return temp_c, temp_f
else:
    print("Temperature sensor not found.")
    exit(1)

# Function to send data to Firebase
def send_data(temp_c, temp_f, tds_value, ph_value):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ref = db.reference('pond1')
    ref.child('temperatureData').push({
        'timestamp': timestamp,
        'temp_celsius': temp_c,
        'temp_fahrenheit': temp_f
    })
    ref.child('tdsData').push({
        'timestamp': timestamp,
        'tds_value': tds_value
    })
    ref.child('phData').push({
        'timestamp': timestamp,
        'ph_value': ph_value
    })

try:
    while True:
        # Read sensor data
        tds_raw = read_channel(TDS_channel)
        ph_raw = read_channel(pH_channel)
        
        # Convert raw values
        tds_value = convert_tds(tds_raw)
        ph_value = convert_ph(ph_raw)
        
        # Read temperature
        temp_c, temp_f = read_temp()
        
        # Send data to Firebase
        send_data(temp_c, temp_f, tds_value, ph_value)
        
        # Print all sensor data
        print(f'TDS Value: {tds_value:.2f}')
        print(f'pH Value: {ph_value:.2f}')
        print(f'Temperature: {temp_c:.2f}°C / {temp_f:.2f}°F')
        
        time.sleep(10)
except KeyboardInterrupt:
    spi.close()
