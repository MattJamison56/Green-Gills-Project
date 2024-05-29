import { useContext } from 'react';
import { ThresholdContext } from '../ThresholdContext';

function Settings() {
    const { tempThreshold, setTempThreshold } = useContext(ThresholdContext);

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value)) {
          setTempThreshold(value);
        }
      };

      return (
        <div>
          <h2>Settings</h2>
          <div>
            <label htmlFor="temp-threshold">Temperature Threshold: </label>
            <input
              type="text"
              id="temp-threshold"
              value={tempThreshold}
              onChange={handleInputChange}
            />
          </div>
        </div>
      );
    }
    
    export default Settings;