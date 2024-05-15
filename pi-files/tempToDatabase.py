import vonage
import firebase_admin
from firebase_admin import credentials, db
import time
import random
from datetime import datetime
import os
import glob

# Initialize Vonage client
client = vonage.Client(key="2edee5d5", secret="5DEoUpVkMbt12cyx")
sms = vonage.Sms(client)
sent = False

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

def send_sms(temp_f):
    responseData = sms.send_message(
        {
            "from": "16105782839",
            "to": "15202257945",
            "text": f"Warning: High temperature detected! Current temperature is {temp_f:.2f}°F.",
        }
    )

    if responseData["messages"][0]["status"] == "0":
        print("Message sent successfully.")
        sent = True
    else:
        print(f"Message failed with error: {responseData['messages'][0]['error-text']}")

while True:
    temp_c, temp_f = read_temp()
    send_temp_data(temp_c, temp_f)
    print(f'Celsius: {temp_c:.3f}, Fahrenheit: {temp_f:.3f}')
    if temp_f > 82 and sent == false:
        send_sms(temp_f)
    time.sleep(5)
