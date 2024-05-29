/* eslint-disable react/prop-types */
import { createContext, useState } from 'react';

export const ThresholdContext = createContext();

export const ThresholdProvider = ({ children }) => {
  const [tempThreshold, setTempThreshold] = useState(83); // Default threshold value

  return (
    <ThresholdContext.Provider value={{ tempThreshold, setTempThreshold }}>
      {children}
    </ThresholdContext.Provider>
  );
};
