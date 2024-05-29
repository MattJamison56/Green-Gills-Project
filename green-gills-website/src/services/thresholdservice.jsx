// Used in MainApp.jsx to constantly check if thresholds are being passed.
// Uses the data that the MainApp.jsx is constantly receiving to do so along with
// the ThresholdContext which can be changed on the Settings page

import { toast } from 'react-toastify';

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
    }
  });
};
