// Just fetches the specific data from the database and returns it as a usable object
// Used in MainApp.jsx to pull data from the parent component and disperse it downward to the children

import { database } from '../firebase-config';
import { ref, onValue } from "firebase/database";

export const fetchData = (dataRef, callback) => {
  const tempDataRef = ref(database, dataRef);
  const unsubscribe = onValue(tempDataRef, (snapshot) => {
    const data = snapshot.val();
    const loadedRows = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        loadedRows.push({
          id: key,
          ...data[key]
        });
      });
    }
    callback(loadedRows);
  });

  return unsubscribe;
};
