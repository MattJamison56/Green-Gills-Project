// Used in MainApp.jsx to constantly check if thresholds are being passed.
// Uses the data that the MainApp.jsx is constantly receiving to do so along with
// the ThresholdContext which can be changed on the Settings page
// Contains SMS code for when thresholds are passed :O

import { toast } from 'react-toastify';
import axios from 'axios';

const recipientPhoneNumber = '+19496273039';

const sendSMS = async (to, message) => {
  try {
    const response = await axios.post('http://localhost:5000/send-sms', { to, message });
    if (response.data.success) {
      console.log('SMS sent successfully!');
    } else {
      console.log('Failed to send SMS.');
    }
  } catch (error) {
    console.log('Error sending SMS:', error.message);
  }
};

export const checkThresholds = (data, thresholds, addNotification) => {
  const isNotificationsEnabled = thresholds.notifs === 1;

  // Checking each threshold
  Object.keys(thresholds).forEach(key => {
    // Ignore 'notifs' key
    if (key === 'notifs') return;

    const threshold = thresholds[key];
    let badValue;

    if (key.endsWith('_low')) {
      // Check if the value is below the lower threshold
      badValue = data.find(item => item[key.replace('_low', '')] < threshold);
    } else if (key.endsWith('_high')) {
      // Check if the value is above the upper threshold
      badValue = data.find(item => item[key.replace('_high', '')] > threshold);
    }

    if (badValue) {
      const notification = {
        id: `${key}-${badValue.timestamp}`,
        pond: `Pond ${1}`, // Needs to be made dynamic just pond 1 rn
        issue: `${key.replace('_', ' ')} alert: ${badValue[key.replace('_low', '').replace('_high', '')]} at ${badValue.timestamp}`
      };
      addNotification(notification); 

      if (!isNotificationsEnabled) return; // Checks if notifs enabled whether or not to do toast and SMS

      const message = `${notification.issue}`;
      sendSMS(recipientPhoneNumber, message);
      
      if (!toast.isActive(`${key}Toast`)) {
        toast.warn(message, {
          toastId: `${key}Toast`
        });
      }
    }
  });
};