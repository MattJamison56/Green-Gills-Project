/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useThresholdContext } from './ThresholdContext';
import { useNotificationContext } from './NotificationContext';
import PageContainer from './components/pagecontainer/pagecontainer';
import { fetchData } from './services/dataservice';
import { checkThresholds } from './services/thresholdservice';

const MainApp = () => {
  const [data, setData] = useState({ temp: [], ph: [], tds: [] });
  const { thresholds } = useThresholdContext();
  const { addNotification } = useNotificationContext();

  useEffect(() => {
    const dataRefs = [
      { name: "temp", path: "pond1/temperatureData" },
      { name: "ph", path: "pond1/phData" },
      { name: "tds", path: "pond1/tdsData" }
    ];

    const dataListeners = {};

    dataRefs.forEach((dataRef) => {
      const unsubscribe = fetchData(dataRef.path, (loadedRows) => {
        setData(prevData => {
          const newData = {
            ...prevData,
            [dataRef.name]: loadedRows
          };
          //console.log('Updated data:', newData);  // Console log the updated data object
          return newData;
        });
      });

      dataListeners[dataRef.name] = unsubscribe;
    });

    return () => {
      Object.values(dataListeners).forEach(unsubscribe => unsubscribe());
    };
  }, []);

  // checks for change in data or thresholds
  useEffect(() => {
    //console.log('Data object:', data);  // Console log the data object
    Object.keys(data).forEach(key => {
      checkThresholds(data[key], thresholds, addNotification);
    });
  }, [data, thresholds]);

  return <PageContainer data={data} />;
};

export default MainApp;
