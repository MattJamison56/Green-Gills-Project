import { useThresholdContext } from '../ThresholdContext';

const Settings = () => {
  const { thresholds, setThresholds } = useThresholdContext();

  const handleThresholdChange = (event) => {
    const { name, value } = event.target;
    setThresholds(prevThresholds => ({
      ...prevThresholds,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div>
      <label>
        Temperature Threshold:
        <input
          type="number"
          name="temp_fahrenheit"
          value={thresholds.temp_fahrenheit}
          onChange={handleThresholdChange}
        />
      </label>
      {/* Add other threshold inputs as needed */}
    </div>
  );
};

export default Settings;
