/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useThresholdContext } from './ThresholdContext';
import { useNotificationContext } from './NotificationContext';
import PageContainer from './components/pagecontainer/pagecontainer';
import { fetchData } from './services/dataservice';
import { checkThresholds } from './services/thresholdservice';

const MainApp = () => {
  const [data, setData] = useState({});
  const { thresholds } = useThresholdContext();
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    const dataRefs = [
      { name: "Temperature", path: "temperatureData" }
      // Add more data types as needed. The path is the name of json section in the firebase.
    ];

    const dataListeners = {};

    dataRefs.forEach((dataRef) => {
      const unsubscribe = fetchData(dataRef.path, (loadedRows) => {
        setData(prevData => ({
          ...prevData,
          [dataRef.name]: loadedRows
        }));
      });

      dataListeners[dataRef.name] = unsubscribe;
    });

    return () => {
      Object.values(dataListeners).forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // checks for change in data or thresholds
  useEffect(() => {
    Object.keys(data).forEach(key => {
      checkThresholds(data[key], thresholds, addNotification);
    });
  }, [data, thresholds]);

  return <PageContainer data={data} />;
};

export default MainApp;
