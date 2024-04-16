import { useState } from 'react'
import rfLogo from './assets/rf-logo.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.renewablefarms.com/" target="_blank">
          <img src={rfLogo} className="logo" alt="RF Logo" />
        </a>
      </div>
      <h1>Renewable Farms Data</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          click {count}
        </button>
      </div>
    </>
  )
}

export default App
