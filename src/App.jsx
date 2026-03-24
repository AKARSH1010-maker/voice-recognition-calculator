import { useState } from 'react'
import Calculator from './components/Calculator'
import CurrencyConverter from './components/CurrencyConverter'
import ModeToggle from './components/ModeToggle'
import './App.css'

function App() {
  const [mode, setMode] = useState('calculator')

  return (
    <div className="app-container">
      <div className="calculator-wrapper">
        <div className="top-bar">
          <h1>Voice Recognition Calculator</h1>
          <ModeToggle mode={mode} setMode={setMode} />
        </div>

        {mode === 'calculator' ? <Calculator /> : <CurrencyConverter />}
      </div>
    </div>
  )
}

export default App