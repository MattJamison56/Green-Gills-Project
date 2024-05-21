import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThresholdProvider } from './ThresholdContext';
import MainApp from './MainApp';

function App() {
  return (
    <>
      {/* Threshold Provider allows the transfer of information from the settings page down to the dashboard */}
      <ThresholdProvider>
        <MainApp />
        <ToastContainer />
      </ThresholdProvider>
    </>
  );
}

export default App;
