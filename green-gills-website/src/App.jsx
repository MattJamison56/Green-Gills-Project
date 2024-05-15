import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './components/dashboard/dashboard';

function App() {
    
  return (
    <>
      <Dashboard />
      <ToastContainer />
    </>
  );  
}

export default App;
