/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const ThresholdContext = createContext();

export const ThresholdProvider = ({ children }) => {
  const [thresholds, setThresholds] = useState({
    temp_fahrenheit: 100, // Example threshold
    // Add other thresholds as needed
  });

  return (
    <ThresholdContext.Provider value={{ thresholds, setThresholds }}>
      {children}
    </ThresholdContext.Provider>
  );
};

export const useThresholdContext = () => useContext(ThresholdContext);
