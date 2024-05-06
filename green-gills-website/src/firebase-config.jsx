// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkfvZ18pQAE5KZnNm0Rya1B1QHWUyfCbU",
  authDomain: "green-gills.firebaseapp.com",
  databaseURL: "https://green-gills-default-rtdb.firebaseio.com",
  projectId: "green-gills",
  storageBucket: "green-gills.appspot.com",
  messagingSenderId: "387298348731",
  appId: "1:387298348731:web:5e895cb13c81a9c046239e",
  measurementId: "G-F8QM4WTX4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };