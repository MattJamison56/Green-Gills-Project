// Displays notifications with their info. need to change pi to send data specific to ponds.
// Test and make sure it works when home

/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { database } from './firebase-config';
import { ref, set, push, onValue, remove } from 'firebase/database';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      const notificationsList = data ? Object.keys(data).map((key) => ({
        id: key,
        ...data[key]
      })) : [];
      setNotifications(notificationsList);
    });
  }, []);

  const addNotification = (notification) => {
    const notificationsRef = ref(database, 'notifications');
    const newNotificationRef = push(notificationsRef);
    set(newNotificationRef, notification);
  };

  const removeNotification = (id) => {
    const notificationRef = ref(database, `notifications/${id}`);
    remove(notificationRef);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationContext = () => useContext(NotificationContext);
