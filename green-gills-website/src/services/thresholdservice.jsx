// Used in MainApp.jsx to constantly check if thresholds are being passed.
// Uses the data that the MainApp.jsx is constantly receiving to do so along with
// the ThresholdContext which can be changed on the Settings page

import { toast } from 'react-toastify';

let vonage;
async function initVonage() {
  const { Vonage } = await import('@vonage/server-sdk');
  vonage = new Vonage({
    apiKey: "2edee5d5",
    apiSecret: "5DEoUpVkMbt12cyx"
  });
}

const from = "16105782839";
const to = "15202257945";


async function sendSMS(text) {
  try {
    const response = await vonage.sms.send({ to, from, text });
    console.log('Message sent successfully');
    console.log(response);
  } catch (error) {
    console.log('There was an error sending the messages.');
    console.error(error);
  }
}


export const checkThresholds = (data, thresholds, addNotification) => {
  Object.keys(thresholds).forEach(key => {
    const threshold = thresholds[key];
    const highValue = data.find(item => item[key] >= threshold);
    if (highValue) {
      const notification = {
        id: `${key}-${highValue.timestamp}`,
        pond: `Pond ${highValue.pond}`, // Assuming your data includes a pond identifier
        issue: `${key} alert: ${highValue[key]} at ${highValue.timestamp}`
      };
      addNotification(notification);

      if (!toast.isActive(`${key}Toast`)) {
        toast.warn(`${key} alert: ${highValue[key]} at ${highValue.timestamp}`, {
          toastId: `${key}Toast`
        });
      }

      // Send SMS Text Notification
      const text = `${key} alert: ${highValue[key]} at ${highValue.timestamp}`; 
      sendSMS(text);
    }
  });
};


