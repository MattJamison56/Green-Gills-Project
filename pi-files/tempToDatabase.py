import firebase_admin
from firebase_admin import credentials, db
import time
import random
from datetime import datetime
import os
import glob

# Path to the Firebase credentials JSON file
cred = credentials.Certificate('firebase-cert.json')

# Initialize the app with a service account
firebase_admin.initialize_app(cred, {
  'databaseURL': 'https://green-gills-default-rtdb.firebaseio.com/'
})

os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

base_dir = '/sys/bus/w1/devices/'
device_folder = glob.glob(base_dir + '28*')[0]
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
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return temp_c, temp_f

def send_temp_data(temp_c, temp_f):
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ref = db.reference('temperatureData')
    ref.push({
        'timestamp': timestamp,
        'temp_celsius': temp_c,
        'temp_fahrenheit': temp_f
    })

while True:
    temp_c, temp_f = read_temp()
    send_temp_data(temp_c, temp_f)
    print(f'Celsius: {temp_c:.3f}, Fahrenheit: {temp_f:.3f}')
    time.sleep(5)
