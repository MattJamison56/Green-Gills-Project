import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/dashboard';
import { ThresholdProvider } from './ThresholdContext';

function App() {
    
  return (
    <>
    <ThresholdProvider>
      <Dashboard />
      <ToastContainer />
    </ThresholdProvider>
    </>
  );  
}

export default App;
